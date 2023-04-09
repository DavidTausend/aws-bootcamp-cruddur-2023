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

Amazon Cognito is a fully managed service by Amazon Web Services (AWS) that provides user authentication and authorization for applications. To ensure the security of your Amazon Cognito setup, it's important to follow best practices. Here are some security best practices for Amazon Cognito:

+ Use a unique user pool for each application: It's recommended to create a separate user pool for each application rather than sharing a single user pool across multiple applications. This approach provides better isolation of user data and allows for more granular access control.

+ Enable multi-factor authentication (MFA): Multi-factor authentication adds an extra layer of security to the authentication process. It's recommended to enable MFA for all users, especially those who have access to sensitive data.

+ Use AWS Identity and Access Management (IAM) roles for access control: Use IAM roles to control access to resources within the application. This ensures that only authorized users can access resources and reduces the risk of unauthorized access.

+ Implement secure password policies: Use strong password policies to ensure that users create strong passwords. Amazon Cognito allows you to configure password policies, such as password length, complexity, and expiration.

+ Monitor usage and set up alerts: Monitor user activity and usage of the application using Amazon CloudWatch. Set up alerts to notify you of any unusual activity, such as failed login attempts or suspicious user behavior.

+ Securely store user profile data: Use Amazon Cognito to securely store user profile data, including email addresses, phone numbers, and user preferences. This data should be encrypted and stored securely to protect user privacy.

+ Test authentication and authorization thoroughly: Test the authentication and authorization flows of your application thoroughly to ensure that they are secure and functioning as expected. Test different scenarios, such as invalid logins and MFA failures, to identify and fix potential vulnerabilities.

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


## Secure API Gateway HTTP endpoint with JWT

To create the three Lambda functions with the requirements you described, you can follow these steps:
1.	Open the AWS Management Console and navigate to the AWS Lambda service.
2.	Click on the "Create Function" button.
3.	Select "Author from scratch" and enter a name for the first Lambda function (e.g., "Pre-tokenAuthLambda").
4.	Choose "Python" as the runtime.
5.	Under "Permissions," select "Create a new role with basic Lambda permissions" and enter a name for the role.
6.	Click on "Create function."
7.	In the function code editor, you can write the code to customize the claims in the identity token. For example, you can use the event parameter to access the input data, modify the claims, and return the modified data.
8.	Click on "Deploy" to save the function.
Repeat steps 3-8 for the second and third Lambda functions (e.g., "LambdaForAdminUser" and "LambdaForRegularUser"), but choose "Node.js" as the runtime instead of Python. In the function code editor, you can write the code to handle the HTTP API Gateway integration for the corresponding routes (/AdminUser and /RegularUser).
9.	Once you have created all three Lambda functions, you can create an HTTP API Gateway in the AWS Management Console.
10.	Select "HTTP API" as the protocol and click on "Create API."
11.	Under "Routes," click on "Create Route."
12.	Enter "/AdminUser" as the route and select "Lambda Function" as the integration target.
13.	Choose the "LambdaForAdminUser" function as the target.
14.	Click on "Create Route."
15.	Repeat steps 11-14 for the "/RegularUser" route and the "LambdaForRegularUser" function.
16.	Once you have created both routes, you can deploy the API by clicking on "Actions" and selecting "Deploy API."
17.	You can now test the API by sending HTTP requests to the API Gateway endpoints for the "/AdminUser" and "/RegularUser" routes, which will trigger the corresponding Lambda functions.

To create an IAM role with the IAM policy you provided for each of the three Lambda functions, you can follow these steps:
1.	Open the AWS Management Console and navigate to the IAM service.
2.	Click on "Roles" in the left-hand menu and then click on "Create role."
3.	Select "AWS service" as the trusted entity and choose "Lambda" as the service that will use this role.
4.	Click on "Next: Permissions."
5.	Under "Attach permissions policies," click on "Create policy."
6.	Select the "JSON" tab and copy and paste the IAM policy you provided into the text box.
7.	Click on "Review policy."
8.	Enter a name for the policy (e.g., "LambdaLogsPolicy") and click on "Create policy."
9.	In the "Create role" page, click on the "Refresh" button under "Attach permissions policies."
10.	Search for and select the policy you just created (e.g., "LambdaLogsPolicy") and click on "Next: Tags."
11.	(Optional) Add any desired tags and click on "Next: Review."
12.	Enter a name for the role (e.g., "LambdaExecutionRole") and click on "Create role."
13.	Repeat steps 2-12 for the other two Lambda functions, using the same policy and role name but changing the name of the Lambda function in the "Resource" field of the policy.
Once you have created the IAM roles, you can assign them to the corresponding Lambda functions by going to the "Permissions" tab of each Lambda function and selecting the role from the "Execution role" dropdown. This will grant the Lambda functions the necessary permissions to create and write logs to CloudWatch Logs.

## idp with Facebook and Google


Source:
https://www.youtube.com/watch?v=9obl7rVgzJw&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=40
https://www.youtube.com/watch?v=T4X4yIzejTc&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=41
https://www.youtube.com/watch?v=d079jccoG-M&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=42
https://www.youtube.com/watch?v=d079jccoG-M&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=43
https://www.youtube.com/watch?v=d079jccoG-M&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=44
