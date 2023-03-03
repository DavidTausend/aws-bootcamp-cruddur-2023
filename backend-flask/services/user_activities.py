from datetime import datetime, timedelta, timezone
from aws_xray_sdk.core import xray_recorder
from opentelemetry import trace

tracer = trace.get_tracer("user.activities")

class UserActivities:
  def run(user_handle):
    #Honeycomb
    with tracer.start_as_current_span("home-activities-mock-data"):
      #xray
      segment = xray_recorder.begin_segment('segment_name')
  
    model = {
       'errors': None,
       'data': None
    }

    now = datetime.now(timezone.utc).astimezone()

    if user_handle == None or len(user_handle) < 1:
            model['errors'] = ['blank_user_handle']
    else:
      now = datetime.now()
      results = [{
        'uuid': '248959df-3079-4947-b847-9e0892d1bab4',
        'handle':  'Andrew Brown',
        'message': 'Cloud is fun!',
        'created_at': (now - timedelta(days=1)).isoformat(),
        'expires_at': (now + timedelta(days=31)).isoformat()
      }]
      model['data'] = results
    
    subsegment = xray_recorder.begin_subsegment('mock-data')
      # xray ---
    dict = {
      "now": now.isoformat(),
      "results-size": len(model['data'])
    }
    subsegment.put_metadata('key', dict, 'namespace')
    
    return model