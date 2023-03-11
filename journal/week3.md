# Week 3 — Decentralized Authentication

Decentralized authentication refers to a method of authentication that does not rely on a central authority or server to verify the identity of a user. Instead, it uses a decentralized network or system of nodes to verify the user's identity.

Decentralized authentication can be achieved through various technologies, such as blockchain and distributed ledger technology (DLT), which enable the creation of a network of nodes that collectively verify user identities. In this system, each node maintains a copy of the user's identity data and can verify the authenticity of the user's identity without relying on a central server or authority.

One advantage of decentralized authentication is that it can increase security and privacy by reducing the risk of a single point of failure or a data breach. Since there is no central authority or server to compromise, it is much harder for an attacker to gain access to user data or impersonate a user.

Decentralized authentication also allows for greater user control over their own identity data, as users can maintain ownership of their data and choose who has access to it. This can help prevent identity theft and give users greater control over their online presence.

Overall, decentralized authentication is a promising approach to online identity verification that can improve security, privacy, and user control.

## AWS Cognito

it's a fully managed authentication, authorization, and user management service provided by Amazon Web Services (AWS). It enables developers to add user sign-up, sign-in, and access control to web and mobile applications quickly and easily.

With Amazon Cognito, developers can easily integrate popular social identity providers, such as Google, Facebook, and Amazon, and enable user authentication with email and password, phone number, or multi-factor authentication (MFA). Additionally, Amazon Cognito provides support for enterprise identity providers through Security Assertion Markup Language (SAML) 2.0 integration.

Amazon Cognito also offers features such as user profile data storage, configurable password policies, and integration with AWS Lambda for custom authentication flows. It also supports Amazon CloudFront signed URLs and AWS Identity and Access Management (IAM) roles, making it easy to control access to application resources.

Overall, Amazon Cognito makes it easy for developers to add user authentication and access control to their applications while maintaining security and scalability.

## AWS Cognito good practices

+ Use a unique user pool for each application: It's recommended to create a separate user pool for each application rather than sharing a single user pool across multiple applications. This approach provides better isolation of user data and allows for more granular access control.

+ Enable multi-factor authentication (MFA): Multi-factor authentication adds an extra layer of security to the authentication process. It's recommended to enable MFA for all users, especially those who have access to sensitive data.

+ Use AWS Identity and Access Management (IAM) roles for access control: Use IAM roles to control access to resources within the application. This ensures that only authorized users can access resources and reduces the risk of unauthorized access.

+ Implement secure password policies: Use strong password policies to ensure that users create strong passwords. Amazon Cognito allows you to configure password policies, such as password length, complexity, and expiration.

+ Monitor usage and set up alerts: Monitor user activity and usage of the application using Amazon CloudWatch. Set up alerts to notify you of any unusual activity, such as failed login attempts or suspicious user behavior.

+ Securely store user profile data: Use Amazon Cognito to securely store user profile data, including email addresses, phone numbers, and user preferences. This data should be encrypted and stored securely to protect user privacy.

+ Test authentication and authorization thoroughly: Test the authentication and authorization flows of your application thoroughly to ensure that they are secure and functioning as expected. Test different scenarios, such as invalid logins and MFA failures, to identify and fix potential vulnerabilities.

## Homework

## MFA SMS

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

