#from datetime import datetime, timedelta, timezone
from aws_xray_sdk.core import xray_recorder
from opentelemetry import trace
from lib.db import db

#tracer = trace.get_tracer("user.activities")

class UserActivities:
  def run(user_handle):
    #xray
    #try:
      #Honeycomb
      #with tracer.start_as_current_span("user-activities-mock-data"):
        #span = trace.get_current_span()
        #now = datetime.now(timezone.utc).astimezone()
        #span.set_attribute("user.now", now.isoformat())  
        #xray
        #segment = xray_recorder.begin_segment('segment_name')
    
      model = {
        'errors': None,
        'data': None
      }

      #now = datetime.now(timezone.utc).astimezone()

      if user_handle == None or len(user_handle) < 1:
              model['errors'] = ['blank_user_handle']
      else:
        print("else:")
        sql = db.template('users','show')
        results = db.query_object_json(sql,{'handle': user_handle})
        model['data'] = results

      #xray ---
      #subsegment = xray_recorder.begin_subsegment('mock-data')
        # xray ---
      #dict = {
        #"now": now.isoformat(),
        #"results-size": len(model['data'])
      #}
      #subsegment.put_metadata('key', dict, 'namespace')
      #xray_recorder.end_subsegment()
    #finally:  
    #  # Close the segment
      #xray_recorder.end_subsegment()
      #span.set_attribute("user.result_lenght", len(results))  
        return model