from opentelemetry import trace
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.trace.export import ConsoleSpanExporter, SimpleSpanProcessor
#HoneyComb frontend
#import requests

# Initialize tracing and an exporter that can send data to Honeycomb
provider = TracerProvider()
processor = BatchSpanProcessor(OTLPSpanExporter())
provider.add_span_processor(processor)

# OTEL ----------
# Show this in the logs within the backend-flask app (STDOUT)
#simple_processor = SimpleSpanProcessor(ConsoleSpanExporter())
#provider.add_span_processor(simple_processor)

trace.set_tracer_provider(provider)
tracer = trace.get_tracer(__name__)

def init_honeycomb(app):
  # Initialize automatic instrumentation with Flask
  FlaskInstrumentor().instrument_app(app)
  RequestsInstrumentor().instrument()

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