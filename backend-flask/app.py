import os
import sys

from flask import Flask
from flask import request, g
from flask_cors import cross_origin

from aws_xray_sdk.core import xray_recorder

from lib.rollbar import init_rollbar
from lib.xray import init_xray
from lib.cors import init_cors
from lib.cloudwatch import init_cloudwatch
from lib.honeycomb import init_honeycomb
from lib.cognito_jwt_token import jwt_required
from lib.helpers import model_json

from services.create_reply import *
from services.message_groups import *
from services.messages import *
from services.create_message import *

import routes.activities
import routes.users

app = Flask(__name__) 
routes.general.load(app)
routes.activities.load(app)
routes.users.load(app)
routes.messages.load(app)

# initalization
init_xray(app)
init_rollbar(app)
init_honeycomb(app)
init_cors(app)

# CloudWatch --------
#@app.after_request
#def after_request(response):
#  init_cloudwatch(response)

if __name__ == "__main__":
  app.run(debug=True)