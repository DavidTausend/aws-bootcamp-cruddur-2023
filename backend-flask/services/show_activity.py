from datetime import datetime, timedelta, timezone
class ShowActivities:
  def run(activity_uuid):
    now = datetime.now(timezone.utc).astimezone()
    sql = db.template('activities','home')
    results = db.query_array_json(sql)
    return results
    return results