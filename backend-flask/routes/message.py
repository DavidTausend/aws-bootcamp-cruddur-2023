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