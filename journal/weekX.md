# Week X — Cleanup


In this section we will refactor, optimize, and organize our project. Let's end the last week challenge of our Bootcamp!


Go the frontend-react-js on Terminal and copy the following script to build a static file for a website:

Note: The result of the process you can see some errors, I recommend to review and correct them to optimaze your code.

REACT_APP_BACKEND_URL="https://api.hallotausend.com" \
REACT_APP_AWS_PROJECT_REGION="$AWS_DEFAULT_REGION" \
REACT_APP_AWS_COGNITO_REGION="$AWS_DEFAULT_REGION" \
REACT_APP_AWS_USER_POOLS_ID="eu-central-1_rDpbtgw5E" \
REACT_APP_CLIENT_ID="2bsm1nf80lse6sgrntodvnkq01" \
npm run build


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


On the same code under # enviroment name type the following code:

    flask_env,
    

Go to backend-flask.env.erb to add the following code:

    FLASK_ENV=development

Note: This will enable development mode on rollbar web page.


Then generate the env with the following command:

    ./bin/backend/generate-env
