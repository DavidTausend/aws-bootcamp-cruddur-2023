from flask import Flask
from flask import request, g
from flask_cors import CORS, cross_origin
import os
import sys

from services.users_short import *
from services.home_activities import *
from services.notifications_activities import *
from services.user_activities import *
from services.create_activity import *
from services.create_reply import *
from services.search_activities import *
from services.message_groups import *
from services.messages import *
from services.create_message import *
from services.show_activity import *
from services.update_profile import *

from lib.cognito_jwt_token import jwt_required

# HoneyComb ---------
from opentelemetry import trace
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.trace.export import ConsoleSpanExporter, SimpleSpanProcessor

# X-RAY ----------
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.ext.flask.middleware import XRayMiddleware

#HoneyComb frontend
#import requests

# CloudWatch Logs ----
import watchtower
import logging

# Rollbar ------
from time import strftime
import os
import rollbar
import rollbar.contrib.flask
from flask import got_request_exception

# Configuring Logger to Use CloudWatch
# LOGGER = logging.getLogger(__name__)
# LOGGER.setLevel(logging.DEBUG)
# console_handler = logging.StreamHandler()
# cw_handler = watchtower.CloudWatchLogHandler(log_group='cruddur')
# LOGGER.addHandler(console_handler)
# LOGGER.addHandler(cw_handler)
# LOGGER.info("test log")

# HoneyComb ---------
# Initialize tracing and an exporter that can send data to Honeycomb
provider = TracerProvider()
processor = BatchSpanProcessor(OTLPSpanExporter())
provider.add_span_processor(processor)

# X-RAY ----------
#xray_url = osgetenv("AWS_XRAY_URL")
#xray_recorder.configure(service='backend-flask', dynamic_naming=xray_url)

# OTEL ----------
# Show this in the logs within the backend-flask app (STDOUT)
#simple_processor = SimpleSpanProcessor(ConsoleSpanExporter())
#provider.add_span_processor(simple_processor)

trace.set_tracer_provider(provider)
tracer = trace.get_tracer(__name__)

app = Flask(__name__)

#xray
#XRayMiddleware(app, xray_recorder)

#HoneyComb Backend
# Initialize automatic instrumentation with Flask
FlaskInstrumentor().instrument_app(app)
RequestsInstrumentor().instrument()


frontend = os.getenv('FRONTEND_URL')
backend = os.getenv('BACKEND_URL')
origins = [frontend, backend]
cors = CORS(
  app, 
  resources={r"/api/*": {"origins": origins}},
  headers=['Content-Type', 'Authorization'], 
  expose_headers='Authorization',
  methods="OPTIONS,GET,HEAD,POST"
)

# CloudWatch --------
#@app.after_request
#def after_request(response):
#    timestamp = strftime('[%Y-%b-%d %H:%M]')
#    LOGGER.error('%s %s %s %s %s %s', timestamp, request.remote_addr, request.method, request.scheme, request.full_path, response.status)
#    return response

# rollbar
rollbar_access_token = os.getenv('ROLLBAR_ACCESS_TOKEN')
with app.app_context():
  def init_rollbar():
      """init rollbar module"""
      rollbar.init(
          # access token
          rollbar_access_token,
          # environment name
          'production',
          # server root directory, makes tracebacks prettier
          root=os.path.dirname(os.path.realpath(__file__)),
          # flask already sets up logging
          allow_logging_basic_config=False)

      # send exceptions from `app` to rollbar, using flask's signal system.
      got_request_exception.connect(rollbar.contrib.flask.report_exception, app)


def model_json(model):
  if model['errors'] is not None:
    return model['errors'], 422
  else:
    return model['data'], 200

@app.route('/api/health-check')
def health_check():
  return {'success': True, 'ver': 1}, 200

#@app.route('/rollbar/test')
#def rollbar_test():
#    rollbar.report_message('Hello World!', 'warning')
#    return "Hello World!"

@app.route("/api/message_groups", methods=['GET'])
@jwt_required()
def data_message_groups():
  model = MessageGroups.run(cognito_user_id=g.cognito_user_id)
  return model_json(model)

@app.route("/api/messages/<string:message_group_uuid>", methods=['GET'])
@jwt_required()
def data_messages(message_group_uuid):
    model = Messages.run(
        cognito_user_id=g.cognito_user_id,
        message_group_uuid=message_group_uuid
      )
    return model_json(model)

@app.route("/api/messages", methods=['POST','OPTIONS'])
@cross_origin()
@jwt_required()
def data_create_message():
  message_group_uuid   = request.json.get('message_group_uuid',None)
  user_receiver_handle = request.json.get('handle',None)
  message = request.json['message']
  if message_group_uuid == None:
  # Create for the first time
    model = CreateMessage.run(
    mode="create",
    message=message,
    cognito_user_id=g.cognito_user_id,
    user_receiver_handle=user_receiver_handle
    )
  else:
  # Push onto existing Message Group
    model = CreateMessage.run(
    mode="update",
    message=message,
    message_group_uuid=message_group_uuid,
    cognito_user_id=g.cognito_user_id
    )
  return model_json(model)

def default_home_feed(e):
  # unauthenicatied request
  app.logger.debug(e)
  app.logger.debug("unauthenicated")
  data = HomeActivities.run()
  return data, 200


@app.route("/api/activities/home", methods=['GET'])
#xray
#@xray_recorder.capture('activities_home')
@jwt_required(on_error=default_home_feed)
def data_home():
  #Cognito
  data = HomeActivities.run(cognito_user_id=g.cognito_user_id)
  return data, 200

@app.route("/api/activities/notifications", methods=['GET'])
def data_notifications():
  data = NotificationsActivities.run()
  return data, 200

@app.route("/api/activities/@<string:handle>", methods=['GET'])
#xray
#@xray_recorder.capture('activities_users')
def data_handle(handle):
  model = UserActivities.run(handle)
  return return_model(model)

@app.route("/api/activities/search", methods=['GET'])
def data_search():
  term = request.args.get('term')
  model = SearchActivities.run(term)
  return model_json(model)

@app.route("/api/activities", methods=['POST','OPTIONS'])
@cross_origin()
@jwt_required()
def data_activities():
  message = request.json['message']
  ttl = request.json['ttl']
  model = CreateActivity.run(message, g.cognito_user_id, ttl)
  return model_json(model)
  

@app.route("/api/activities/<string:activity_uuid>", methods=['GET'])
#Xray
@xray_recorder.capture('activities_show')
def data_show_activity(activity_uuid):
  data = ShowActivity.run(activity_uuid=activity_uuid)
  return data, 200

@app.route("/api/activities/<string:activity_uuid>/reply", methods=['POST','OPTIONS'])
@cross_origin()
def data_activities_reply(activity_uuid):
  user_handle  = 'davidtausend'
  message = request.json['message']
  model = CreateReply.run(message, user_handle, activity_uuid)
  return model_json(model)

#HoneyComb Frontend
#@app.route("/honeycomb/traces", methods=['POST','OPTIONS'])
#@cross_origin(supports_credentials=True)
#def collect_traces():
#   otlp_json_exported_from_frontend = request.json

#    headers = {
#        'Content-Type': 'application/json',
#        'x-honeycomb-team': os.getenv('HONEYCOMB_API_KEY'),
#    }

#    try:
#        response = requests.post(
#            url=os.getenv('HONEYCOMB_TRACES_API'),
#            json=otlp_json_exported_from_frontend,
#            headers=headers
#        )
        #Raise any error 4xx or 500
#        response.raise_for_status()  

#        return {'success': True}, 200

#    except requests.exceptions.RequestException as e:
        #Handle any exceptions that occur during the POST request
#        print('Error sending data to Honeycomb:', e)
#        return {'success': False}, 500  

@app.route("/api/users/@<string:handle>/short", methods=['GET'])
def data_users_short(handle):
  data = UsersShort.run(handle)
  return data, 200

@app.route("/api/profile/update", methods=['POST','OPTIONS'])
@cross_origin()
@jwt_required()
def data_update_profile():
  bio          = request.json.get('bio',None)
  display_name = request.json.get('display_name',None)
  model = UpdateProfile.run(
    cognito_user_id=g.cognito_user_id,
    bio=bio,
    display_name=display_name
  )
  return model_json(model)

if __name__ == "__main__":
  app.run(debug=True)