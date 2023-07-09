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

<img width="1430" alt="Week3-Config" src="https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/2c2d452b-c251-4960-8b2a-bb46e7ce685d">

<img width="679" alt="Week3-Create" src="https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/e5851b56-e00a-462b-a0b0-d590bc835c2e">

<img width="684" alt="Week3-ConfigView" src="https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/5002fcc1-e79e-4f4c-8ee2-2a19a5fd807c">

Go to the AWS Cognito console and choose your user pool "crudder-user-pool".

![Week3-UserPool](https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/ffa7d118-96b4-4bf8-9eac-3e5406519363)


Click "Sign-in experience" tab, and then locate Federated sign-in. Click on "Add an identity provider".

![Week3-Federated](https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/05389e06-8dc5-4222-90d3-0a94c71c4728)

Choose Google as your social IdP and enter the Google Developer Console app client ID and app client secret that were generated in the previous section.

![Week3-GoogleldP](https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/c05d7f0a-a652-4ec1-8514-128553f2b107)


Map attributes from your ldP to your user pool, then choose add identity provider:

![Week3-Map](https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/5990dd1a-a298-4314-af90-4b503cd3205b)


From the App client integration tab, select App client from the list and click Edit hosted UI settings.

For now, add one URL http://localhost:3000 for the Allowed callback URLs and the Allowed sign-out URLs. Then select Google from the Identity providers menu.
Make sure to set the OAuth 2.0 grant types to Implicit Grant. This specifies that the client should directly receive the access token (and optionally, the ID token based on scopes).

Note: There is a recommended option to use the authorization code, but in order to do so, we will need to implement Proof Key for Code Exchange (PKCE) in the backend, which will complicate things. Therefore, for now, stick with the option of sending the token directly to the client (Implicit grant).

From the OpenID Connect scopes menu, select OpenID and then aws.cognito.signin.user.admin, Email, and Profile. Choose Save changes.

![Week3-HostedUI](https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/cdbaaf7d-bba8-41ec-8846-bfaf1fcc0ef1)


From the Domain menu under the Actions dropdown, select Create Cognito domain and enter your cognito domain name:

![Week3-CognitoDomain](https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/28511bf2-535b-4a8f-8c7a-3b144973b74a)


Go back to the Google developer console and on the left navigation bar, choose Credentials and select the client you created in the first step and click the edit button:

![Week3-EditCredentials](https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/b4f7a2b6-33e8-4ed9-a626-4b453f2aad2d)

In the Authorized JavaScript origins field, enter your user pool domain and in the Authorized redirect URIs field, enter your user pool domain with the /oauth2/idpresponse endpoint:

![Week3-AddDomain](https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/39359f46-4c3a-4ed1-9340-cff6dcfc2c87)


Go your code to update app.js:



Source:
https://www.youtube.com/watch?v=9obl7rVgzJw&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=40
https://www.youtube.com/watch?v=T4X4yIzejTc&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=41
https://www.youtube.com/watch?v=d079jccoG-M&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=42
https://www.youtube.com/watch?v=d079jccoG-M&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=43
https://www.youtube.com/watch?v=d079jccoG-M&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=44
https://docs.amplify.aws/lib/auth/social/q/platform/js/
https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-social-idp.html

