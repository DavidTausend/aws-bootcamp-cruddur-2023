# Week 8 — Serverless Image Processing

Serverless Image Processing refers to a computing approach where image processing tasks, such as image resizing, cropping, filtering, and other transformations, are performed using serverless computing architectures.

On this week we will be using CDK with typscript:

Create a directory for CDK in main folder:

    mkdir thumbing-serverless-cdk
    
 
Move to that directory using the following command:

    cd thumbing-serverless-cdk/


Install AWS CDK with the following command:
note: -g means the installation will be locally.

    npm install aws-cdk -g
     
Then the following code so next time you start your environment you install cdk and copy .env.example .env for the deployment:

     - name: cdk
        before: |
          npm install aws-cdk -g    
          cd thumbing-serverless-cdk
          cp .env.example .env
          npm i
          
          
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


Enter your env information on .env.example file:
note: If you don't have the file please create it.

    THUMBING_BUCKET_NAME="assets.hallotausend.com"
    THUMBING_S3_FOLDER_INPUT="avatars/original"
    THUMBING_S3_FOLDER_OUTPUT="avatars/processed"
    THUMBING_WEBHOOK_URL="https://api.hallotausend.com/webhooks/avatar"
    THUMBING_TOPIC_NAME="cruddur-assets"
    THUMBING_FUNCTION_PATH="/workspace/aws-bootcamp-cruddur-2023/aws/lambdas/process-images"

Then run the following command on the terminal to double check the deployment:

    cdk synth
<img width="1093" alt="Week8-CDKSynth" src="https://user-images.githubusercontent.com/125006062/230883980-1ab97b2b-7dfa-46a0-9a5b-07a12934dc44.png">


To deploy the CDK run the following command on thumbing-serverless-cdk directory:
note: we install the CDK on this directory, therefore, CDK will just run on it.

    cdk deploy
<img width="1440" alt="Week8-CDKDeploy" src="https://user-images.githubusercontent.com/125006062/231072441-bed5723c-6a86-4e36-a301-13283baaf0ef.png">


Load the Env Vars to thumbing-serverless-cdk-stack.ts file:

    const bucketName: string = process.env.THUMBING_BUCKET_NAME as string;
    const folderInput: string = process.env.THUMBING_S3_FOLDER_INPUT as string;
    const folderOutput: string = process.env.THUMBING_S3_FOLDER_OUTPUT as string;
    const webhookUrl: string = process.env.THUMBING_WEBHOOK_URL as string;
    const topicName: string = process.env.THUMBING_TOPIC_NAME as string;
    const functionPath: string = process.env.THUMBING_FUNCTION_PATH as string;
    console.log('bucketName',bucketName)
    console.log('folderInput',folderInput)
    console.log('folderOutput',folderOutput)
    console.log('webhookUrl',webhookUrl)
    console.log('topicName',topicName)
    console.log('functionPath',functionPath)
    

Create index.js file in lambdas/process-images folder and add the following code:

    const process = require('process');
    const {getClient, getOriginalImage, processImage, uploadProcessedImage} = require('./s3-image-processing.js')
    const path = require('path');

    const bucketName = process.env.DEST_BUCKET_NAME
    const folderInput = process.env.FOLDER_INPUT
    const folderOutput = process.env.FOLDER_OUTPUT
    const width = parseInt(process.env.PROCESS_WIDTH)
    const height = parseInt(process.env.PROCESS_HEIGHT)

    client = getClient();

    exports.handler = async (event) => {
      const srcBucket = event.Records[0].s3.bucket.name;
      const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
      console.log('srcBucket',srcBucket)
      console.log('srcKey',srcKey)

      const dstBucket = bucketName;

      filename = path.parse(srcKey).name
      const dstKey = `${folderOutput}/${filename}.jpg`
      console.log('dstBucket',dstBucket)
      console.log('dstKey',dstKey)

      const originalImage = await getOriginalImage(client,srcBucket,srcKey)
      const processedImage = await processImage(originalImage,width,height)
      await uploadProcessedImage(client,dstBucket,dstKey,processedImage)
    };


Create test.js file in lambdas/process-images folder and add the following code:

    const {getClient, getOriginalImage, processImage, uploadProcessedImage} = require('./s3-image-processing.js')

    async function main(){
      client = getClient()
      const srcBucket = 'cruddur-thumbs'
      const srcKey = 'avatar/original/data.jpg'
      const dstBucket = 'cruddur-thumbs'
      const dstKey = 'avatar/processed/data.png'
      const width = 256
      const height = 256

      const originalImage = await getOriginalImage(client,srcBucket,srcKey)
      console.log(originalImage)
      const processedImage = await processImage(originalImage,width,height)
      await uploadProcessedImage(client,dstBucket,dstKey,processedImage)
    }

    main()


## Issues documentation

1. CDK: ENOENT: no such file or directory, open 'cdk.out/manifest.json'

This error occurred because I believe that I couse some misconfiguration in the cdk files. Therefore, I tried different solutions from google, chartGTP but it didn't work, even F4dy tried to help me out without any luck. 

Solution: I empty the cdk init with this command rm -rf *, then I install again the cdk init app --language typescript.

![Bildschirmfoto_2023-04-12_um_8 17 24_AM_2](https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/01f057e5-56fd-4b59-b8e2-2c89a5b38713)

<img width="1439" alt="Bildschirmfoto_2023-04-12_um_10 03 03_PM" src="https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/b39bfe1e-2f1a-41ee-a31b-84d8d6c4e6ca">

<img width="1440" alt="Bildschirmfoto_2023-04-13_um_8 12 35_PM" src="https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/2e874090-c972-4227-a0db-aa6e94424153">

<img width="441" alt="Bildschirmfoto 2023-05-10 um 4 30 57 PM" src="https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/c36fa429-3a95-4a4d-820d-82f479a88448">


2. API Trigger not working in lambda authorizer.

I checked multiple times the videos, google searches, ChartGPT, office hours. Then I rebuild again the API Gateway and the lambda authorizer, but I got the same issue. I know something is wrong with the API Gateway or lambda permission, therefore, it doesn't trigger the API.

<img width="1063" alt="Bildschirmfoto 2023-05-07 um 9 00 40 PM" src="https://github.com/DavidTausend/aws-bootcamp-cruddur-2023/assets/125006062/44b3a124-cd0f-4bfb-98bb-4b4e21c9ed29">


Source:
https://www.youtube.com/watch?v=YiSNlK4bk90&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=70
https://www.youtube.com/watch?v=YiSNlK4bk90&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=71
https://www.youtube.com/watch?v=YiSNlK4bk90&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=72
https://www.youtube.com/watch?v=YiSNlK4bk90&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=73


