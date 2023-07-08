# Week 3 — Decentralized Authentication

Decentralized authentication refers to a method of authentication that does not rely on a central authority or server to verify the identity of a user. Instead, it uses a decentralized network or system of nodes to verify the user's identity.

## AWS Cognito good practices

+ Use a unique user pool for each application.
+ Enable multi-factor authentication (MFA).
+ Use AWS Identity and Access Management (IAM) roles for access control.
+ Implement secure password policies.
+ Monitor usage and set up alerts.
+ Securely store user profile data.
+ Test authentication and authorization thoroughly.

## Homework

## MFA SMS

I first enabled the MFA in AWS cognito as optional but before it's needed to have a SNS services to send the text message.Then I added the following code in app.py:

      import boto3
      from flask import jsonify
      
      access_token = extract_access_token(request.headers)

      try:
          # Verify the JWT token
          claims = cognito_jwt_token.verify(access_token)

          # Check if MFA is required
          try:
              response = cognito.associate_software_token(
                  AccessToken=access_token
              )
          except cognito.exceptions.NotAuthorizedException:
              # MFA is not required
              data = HomeActivities.run(cognito_user_id=claims['username'])
              return data, 200

          # MFA is required - send an SMS verification code
          phone_number = response['SecretCodeDeliveryDetails']['Destination']
          cognito.verify_software_token(
              AccessToken=access_token,
              UserCode=request.form['mfa_code'],
              FriendlyDeviceName='device'
          )

          # Authenticate the user using Amazon Cognito
          response = cognito.initiate_auth(
              AuthFlow='USER_PASSWORD_AUTH',
              AuthParameters={
                  'USERNAME': claims['username'],
                  'PASSWORD': request.form['password'],
                  'MFA_TOKEN': request.form['mfa_code']
              },
              ClientId='your_client_id',
              Session=response['Session']
          )

          # Return a new JWT token that includes the MFA authentication factor
          return jsonify({
              'access_token': response['AuthenticationResult']['AccessToken'],
              'expires_in': response['AuthenticationResult']['ExpiresIn']
          }), 200

      except TokenVerifyError as e:
          # Invalid JWT token
          app.logger.debug(e)
          app.logger.debug("unauthenticated")
          data = HomeActivities.run()
          return data, 401


## idp with Google

Note: my screenshot are in German, because I live in Germany 🇩🇪.

Go to the Google developer console and click "new project":

<img width="1439" alt="Week3-GoogleDevConsole" src="https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/f2a65831-e389-48b9-9cfe-6b28b18f9491">

Click "new project" and type "Cruddur":

<img width="619" alt="Bildschirmfoto 2023-07-08 um 8 44 09 PM" src="https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/89233dbb-b8bc-4819-8a68-de4859e13476">

Click "Create" and wait until the project is created on the main website:

<img width="1409" alt="Week3-PorjectCruddur" src="https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/76832960-d046-49ac-be24-a37b58cf5b41">

Go to credentials and to create your OAuth 2.0 credentials, select OAuth client ID from the Create credentials dropdown list:

<img width="1397" alt="Week3-CredentialsOAUHT" src="https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/cdd1d1db-9be5-4e70-a9f0-035afb42a326">



Enter the required information for the App Information and Developer Contact Information fields, then click Save and Continue three times (OAuth consent screen -> Scopes -> Test Users) to complete the consent screen setup.

Source:
https://www.youtube.com/watch?v=9obl7rVgzJw&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=40
https://www.youtube.com/watch?v=T4X4yIzejTc&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=41
https://www.youtube.com/watch?v=d079jccoG-M&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=42
https://www.youtube.com/watch?v=d079jccoG-M&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=43
https://www.youtube.com/watch?v=d079jccoG-M&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=44
https://docs.amplify.aws/lib/auth/social/q/platform/js/
