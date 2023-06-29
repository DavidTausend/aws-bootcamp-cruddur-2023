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
