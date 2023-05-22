from services.users_short import *
from services.update_profile import *
from services.user_activities import *

def load(app):
  @app.route("/api/activities/@<string:handle>", methods=['GET'])
  #xray
  #@xray_recorder.capture('activities_users')
  def data_handle(handle):
    model = UserActivities.run(handle)
    return return_model(model)

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