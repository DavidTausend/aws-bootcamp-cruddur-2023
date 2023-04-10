# Week 8 — Serverless Image Processing


Create a directory for CDK in main folder:

    mkdir thumbing-serverless-cdk
    
 
Move to that directory using the following command:

    cd thumbing-serverless-cdk/


Install AWS CDK with the following command:
note: -g means the installation will be locally.

    npm install aws-cdk -g
     
    
Install dotenv dependency:

    npm i dotenv

Then type to initials our cdk project:

    cdk init app --language typescript

<img width="1438" alt="Week8-CDKinitapp" src="https://user-images.githubusercontent.com/125006062/230866906-6949cfdf-0082-487c-bd5a-e6b68d687ec2.png">

Important!
you need to bootstrap your account to push information to aws, therefore, run the following command with your AWS acccount ID and region:

    cdk bootstrap "aws://250283220840/eu-central-1"

<img width="1088" alt="Week8-Bootstrap" src="https://user-images.githubusercontent.com/125006062/230886393-898274ea-e239-42e6-a314-cb5b627618cb.png">

<img width="1440" alt="Week8-CloudFormationBootstrap" src="https://user-images.githubusercontent.com/125006062/230886861-24ec57c1-d95d-4467-bf48-b016c0a49432.png">


Go to thumbing-serverless-cdk/lib/import * as s3 from 'aws-cdk-lib/aws-s3' and add the following code:

    import * as s3 from 'aws-cdk-lib/aws-s3'
    import * as lambda from 'aws-cdk-lib/aws-lambda'
    import * as dotenv from 'dotenv';

    dotenv.config();
    
    {
        super(scope, id, props);

        // The code that defines your stack goes here
        const bucketName: string = process.env.THUMBING_BUCKET_NAME as string;
        const functionPath: string = process.env.THUMBING_FUNCTION_PATH as string;
        const folderInput: string = process.env.THUMBING_S3_FOLDER_INPUT as string;
        const folderOutput: string = process.env.THUMBING_S3_FOLDER_OUTPUT as string;


        const bucket = this.createbucket(bucketName);
        const lambda = this.createLambda(functionPath, bucketName, folderInput, folderOutput);

      }

      createbucket(bucketName: string): s3.IBucket {
        const bucket = new s3.Bucket(this, 'ThumbingBucket',{
          bucketName: bucketName,
          removalPolicy: cdk.RemovalPolicy.DESTROY
        });
        return bucket;
      }

      createLambda(functionPath: string, bucketName: string, folderInput: string, folderOutput: string): lambda.IFunction {
        const lambdaFunction = new lambda.Function(this, 'ThumbLambada',{
          runtime: lambda.Runtime.NODEJS_18_X,
          handler: 'index.handler',
          code: lambda.Code.fromAsset(functionPath),
          environment: {
            DEST_BUCKET_NAME: bucketName,
            FOLDER_INPUT: folderInput,
            FOLDER_OUTPUT: folderOutput,
            PROCESS_WIDTH: '512',
            PROCESS_HEIGHT: '512'
          }
        });
        return lambdaFunction;
      }


Then run the following command on terminal:

    cdk synth
<img width="1093" alt="Week8-CDKSynth" src="https://user-images.githubusercontent.com/125006062/230883980-1ab97b2b-7dfa-46a0-9a5b-07a12934dc44.png">


Deploy the CDK running:

cdk deploy

CDK

Source:
https://www.youtube.com/watch?v=YiSNlK4bk90

