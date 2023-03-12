from datetime import datetime, timedelta, timezone
from opentelemetry import trace
#import logging

#postgres
from lib.db import pool, query_wrap_array

tracer = trace.get_tracer("home.activities")

class HomeActivities:
  def run(cognito_user_id=None):
    #Logger.info('HomeActivities')
    with tracer.start_as_current_span("home-activities-mock-data"):
      span = trace.get_current_span()
      now = datetime.now(timezone.utc).astimezone()
      span.set_attribute("app.now", now.isoformat())
      #Postgress
      sql = query_wrap_array("""
      SELECT * FROM activities
      """)
      with pool.connection() as conn:
        with conn.cursor() as cur:
          cur.execute(sql)
          # this will return a tuple
          # the first field being the data
          json = cur.fetchone()  
      return json[0]
    return results
