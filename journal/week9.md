# Week 9 — CI/CD with CodePipeline, CodeBuild and CodeDeploy


On this week we build a CI/CD, that stands for Continuous Integration/Continuous Deployment, the development software we help us to streamline the process of building, testing, and deploying software.

## Create Codepipeline and Codebuild

As fitst step go to AWS and look for Codepipeline, then create the codepipeline with the following values:

Note: as a good practice always check the adavance settings:

<img width="1436" alt="Week9-ChoosePipelineSetting" src="https://user-images.githubusercontent.com/125006062/233819496-672a8a90-c202-4482-be2b-5e44d90866e0.png">


Add source stage selecting the Source provider GitHub V2 that uses codestar from aws, then click connection to connect your Github with aws:

<img width="1434" alt="Week9-SourceProvider" src="https://user-images.githubusercontent.com/125006062/233819642-65409427-f4bf-4210-bfee-36b5b96240cc.png">


Type the desired name for the connection and click connect:

<img width="1435" alt="Week9-GitHubConnection" src="https://user-images.githubusercontent.com/125006062/233819703-e32a857e-fe18-44c8-ac17-8b16ec3b1497.png">


Authorize aws to connect with github:

<img width="723" alt="Week9-Authorize" src="https://user-images.githubusercontent.com/125006062/233819782-d21a5077-0176-4a88-a0d7-a24b849aac97.png">


Click install app:

<img width="867" alt="Week9-InstallApp" src="https://user-images.githubusercontent.com/125006062/233819797-1f4f5a12-d7ff-472e-b740-3fcad1a6f360.png">


Select just the repository that you wish to connect with aws, in this case will be aws-bootcamp-cruddur-2023:

<img width="540" alt="Week9-AddRepo" src="https://user-images.githubusercontent.com/125006062/233819854-71df12bd-5fd9-4b33-946a-9226826768db.png">


Finish the connection clicking connect:

<img width="879" alt="Week9-GithubApp" src="https://user-images.githubusercontent.com/125006062/233819885-875e6e66-432e-47b6-91ca-418b84db80aa.png">


If the connection was susessful with appaer "ready to connect": 

<img width="868" alt="Week9-ConnectionSucessful" src="https://user-images.githubusercontent.com/125006062/233819922-6852d0ed-8a6f-4f7e-9a66-28097c0eb269.png">


Go to github and create a "prod" branch by clicking on branch:

<img width="1429" alt="Week9-GoGithub" src="https://user-images.githubusercontent.com/125006062/233819951-f25d6899-3ab5-42bc-ab4d-146e405eaa93.png">


Then click new branch and name it "prod" for production:

<img width="1416" alt="Week9-CreateBranch" src="https://user-images.githubusercontent.com/125006062/233820054-980d3c2c-fae8-41f0-94e5-d87f74b495b0.png">

<img width="446" alt="Week9-BranchProd" src="https://user-images.githubusercontent.com/125006062/233820063-fea33ff6-5f58-4a42-b12f-108b55b8ef24.png">

<img width="1261" alt="Week9-Branches" src="https://user-images.githubusercontent.com/125006062/233820087-03d7e575-1cc1-4ed3-a58a-d0576538088b.png">


On the codepipeline settings select your repository, then the new branch just created:

<img width="811" alt="Week9-Prod" src="https://user-images.githubusercontent.com/125006062/233820148-fc240536-5b4b-4f81-9b8a-a4a7813fe76d.png">


Skip the need step and continue:

<img width="839" alt="Week9-SkipStage" src="https://user-images.githubusercontent.com/125006062/233820176-06cfd5ca-0117-4a76-a791-661d7c06300c.png">


Select the following values depending of region and cluster name:

<img width="839" alt="Week9-SkipStage" src="https://user-images.githubusercontent.com/125006062/233820176-06cfd5ca-0117-4a76-a791-661d7c06300c.png">


Review the settings and create the pipeline:

<img width="1440" alt="Week9-ReviewConfiguration" src="https://user-images.githubusercontent.com/125006062/233820224-2089a6c8-e800-47c5-a68f-560382083e22.png">


You will notice that the deployment becuase it is need some other configurations.Therefore, click edit:

<img width="1433" alt="Week9-Codepipeline" src="https://user-images.githubusercontent.com/125006062/233820244-161caadf-44cc-4db6-9f57-49418b309403.png">


## Issues documentation

### Codebuild access denied when running pipeline

Error log:

      [Container] 2023/04/23 08:31:04 Running command aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $IMAGE_URL

      An error occurred (AccessDeniedException) when calling the GetAuthorizationToken operation: User: arn:aws:sts::250283220840:assumed-role/codebuild-cruddur-backend--service-role/AWSCodeBuild-3158ce99-75d4-4547-87a6-87a6080d7969 is not authorized to perform: ecr:GetAuthorizationToken on resource: * because no identity-based policy allows the ecr:GetAuthorizationToken action
      Error: Cannot perform an interactive login from a non TTY device

      [Container] 2023/04/23 08:31:16 Command did not exit successfully aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $IMAGE_URL exit status 1
      [Container] 2023/04/23 08:31:16 Phase complete: INSTALL State: FAILED
      [Container] 2023/04/23 08:31:16 Phase context status code: COMMAND_EXECUTION_ERROR Message: Error while executing command: aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $IMAGE_URL. Reason: exit status 1


Error summary:
The error clearly indicates that our codebuild doesn’t have sufficient permission to connect with ecr cluster backend-flask.

Easy solutions:

1. Go to the AWS Management Console and navigate to the IAM service.
2. Click on "Roles" from the left-hand menu and search for the IAM role associated with the CodeBuild project, in my case the name is codebuild-cruddur-backend--service-role.
3. Click on the IAM role to view its details.
4. Click on the "Attach policies" button.
5. Search for the policy AmazonEC2ContainerRegistryPowerUser and select it.
6. Click on the "Attach policy" button to attach the policy to the IAM role.

<img width="1432" alt="Week9-PermissionsResolved" src="https://user-images.githubusercontent.com/125006062/233832192-db7963e6-9935-44df-b33d-bc87afbb0dec.png">

or

add the following json code to the permissions of the backend-flask cluster:

        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "codebuild"
                    "Effect": "Allow",
                    "Action": [
                        "ecr:GetAuthorizationToken",
                        "ecr:BatchCheckLayerAvailability",
                        "ecr:GetDownloadUrlForLayer",
                        "ecr:GetRepositoryPolicy",
                        "ecr:DescribeRepositories",
                        "ecr:ListImages",
                        "ecr:DescribeImages",
                        "ecr:BatchGetImage",
                        "ecr:GetLifecyclePolicy",
                        "ecr:GetLifecyclePolicyPreview",
                        "ecr:ListTagsForResource",
                        "ecr:DescribeImageScanFindings",
                        "ecr:InitiateLayerUpload",
                        "ecr:UploadLayerPart",
                        "ecr:CompleteLayerUpload",
                        "ecr:PutImage"
                    ],
                    "Resource": "*"
                }
            ]
        }

## Homework challenge

### Add a test stage in CodePipeline

After the Source stage, choose Add stage.

For Stage name, enter the name of the test stage (for example, Test). If you choose a different name, use it throughout this procedure.

 <img width="1073" alt="Week9-AddTest" src="https://user-images.githubusercontent.com/125006062/235369034-c21ab4a1-b806-4c34-8171-ddaf26f64ec9.png">
 
In the selected stage, choose Add action.
 
In Edit action, for Action name, enter a name for the action (for example, Test). 
 
For Action provider, under Test, choose CodeBuild.

For Input artifacts, select the source value to test.
 
Choose the name of the build project and click "done".

<img width="1222" alt="Week9-TestStage" src="https://user-images.githubusercontent.com/125006062/235370259-e22bf471-ad9c-46f3-92bd-48bb5d799e21.png">


Choose Save.
 
Choose Release change.

<img width="1152" alt="Week9-TestSuccessful" src="https://user-images.githubusercontent.com/125006062/235370328-9b11f3cb-3003-4dda-8368-0f0b956b2db9.png">


After the pipeline runs successfully, you can get the test results. In the Test stage of the pipeline, choose the CodeBuild hyperlink to open the related build project page in the CodeBuild console.

On the build project page, in Build history, choose the Build run hyperlink.

On the build run page, in Build logs, choose the View entire log hyperlink to open the build log in the Amazon CloudWatch console.
Scroll through the build log to view the test results.



Source:
https://www.youtube.com/watch?v=DLYfI0ehMZE&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=81
https://www.youtube.com/watch?v=DLYfI0ehMZE&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=82
https://www.youtube.com/watch?v=DLYfI0ehMZE&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=83
https://docs.aws.amazon.com/codebuild/latest/userguide/how-to-create-pipeline.html
https://docs.aws.amazon.com/codebuild/latest/userguide/how-to-create-pipeline-add-test.html
