from psycopg_pool import ConnectionPool
import os
import re
import sys
from flask import current_app as app

class Db:
  def _init_(self):
    self._init_pool()

  def template(self,name):
    template_paht = os.path.join(app.intance_path,'db','sql', name)
    with open(template_path, 'r') as f:
      template_content = f.read()
    return template_content
    #pathing = list((app.root_path,'db','sql',) + args)
    #pathing[-1] = pathing[-1] + ".sql"

  def _init_pool(self):  
    connection_url = os.getenv("CONNECTION_URL")
    self.pool = ConnectionPool(connection_url)

  #when we want to commint code data as an insert    
  def query_commit(self,sql,params):  
    print("SQL STATEMENT------[commit with returning]------")
    print(sql + "\n")
    
    pattern = r"\bRETURNING\b"
    is_returning_id = re.search(pattern, sql)

    try:
      conn = self.pool.connection()  
      cur = conn.cursor(sql,params)
      if is_returning_id:
        returning_id = cur.fetchone()[0]
      conn.commint()
      if is_returning_id:
        return returning_id   
    except Exception as err:
     self.print_sql_err(err)
  #when we want to return an array of json object
  def query_array_json(self,sql):
    print("SQL STATEMENT------[array]------")
    print(sql + "\n")
    print("")
    wrapped_sql = self.query_wrap_array(sql)
    with self.pool.connection() as conn:
        with conn.cursor() as cur:
          cur.execute(wrapped_sql)
          # this will return a tuple
          # the first field being the data
          json = cur.fetchone()  
        return json[0]
  #when we want to return a json object   
  def query_object_json(self,sql):
    print("SQL STATEMENT------[object]------")
    print(sql + "\n")
    wrapped_sql = self.query_wrap_object(sql)
    with self.pool.connection() as conn:
        with conn.cursor() as cur:
          cur.execute(wrapped_sql)
          # this will return a tuple
          # the first field being the data
          json = cur.fetchone()  
        return json[0]

def query_wrap_object(self,template):   
    sql = f"""
    (SELECT COALESCE(row_to_json(object_row),'{{}}'::json) FROM (
    {template}
    ) object_row);
    """
    return sql

def query_wrap_array(self,template):
  sql = f"""
  (SELECT COALESCE(array_to_json(array_agg(row_to_json(array_row))),'[]'::json) FROM (
  {template}
  ) array_row);
  """
  return sql  
def print_psycopg_err(self,err):
    # get details about the exception
    err_type, err_obj, traceback = sys.exc_info()

    # get the line number when exception occured
    line_num = traceback.tb_lineno

    # print the connect() error
    print ("\npsycopg ERROR:", err, "on line number:", line_num)
    print ("psycopg traceback:", traceback, "-- type:", err_type)

    # print the pgcode and pgerror exceptions
    print ("pgerror:", err.pgerror)
    print ("pgcode:", err.pgcode, "\n")

db = Db()