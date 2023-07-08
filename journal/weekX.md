# Week X — Fix Rollbar flask


Go to rollbar.py to add the following code:

    ## XXX hack to make request data work with pyrollbar <= 0.16.3
    def _get_flask_request():
        print("Getting flask request")
        from flask import request
        print("request:", request)
        return request
    rollbar._get_flask_request = _get_flask_request
    
    def _build_request_data(request):
        return rollbar._build_werkzeug_request_data(request)
    rollbar._build_request_data = _build_request_data
    ## XXX end hack


On the paht in the init_rollbar add the following code:

    flask_env = os.getenv('FLASK_ENV')
    flask_env,
    

Go to backend-flask.env.erb to add the following code:

    FLASK_ENV=development

Note: This will enable development mode on rollbar web page.


Then generate the env with the following command:

    ./bin/backend/generate-env


Deploy your project to production:

     ./bin/cfn/service

<img width="856" alt="WeekX-Deploy" src="https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/9220fbfe-0c90-4de0-8902-23fc9296e7d7">

Deploy the changeset in AWS to finish fixing rollbar.

<img width="1141" alt="WeelX-Cloudformation" src="https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/3b2c6b8d-9ef8-4378-9905-c4b6a7a90ae6">


