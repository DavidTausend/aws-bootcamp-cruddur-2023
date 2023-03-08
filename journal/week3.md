# Week 3 — Decentralized Authentication

## [Medium] Decouple the JWT verify from the application code by writing a  Flask Middleware

## [Hard] Decouple the JWT verify by implementing a Container Sidecar pattern using AWS’s official Aws-jwt-verify.js library

## [Hard] Decouple the JWT verify process by using Envoy as a sidecar https://www.envoyproxy.io/

## [Hard]  Implement a IdP login eg. Login with Amazon or Facebook or Apple.

## [Easy] Implement MFA that send an SMS (text message), warning this has spend, investigate spend before considering, text messages are not eligible for AWS Credits

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
              FriendlyDeviceName='My Device'
          )

          # Authenticate the user using Amazon Cognito
          response = cognito.initiate_auth(
              AuthFlow='USER_PASSWORD_AUTH',
              AuthParameters={
                  'USERNAME': claims['username'],
                  'PASSWORD': request.form['password'],
                  'SOFTWARE_TOKEN_MFA_CODE': request.form['mfa_code']
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

