# Week 9 — CI/CD with CodePipeline, CodeBuild and CodeDeploy


On this week we build a CI/CD, that stands for Continuous Integration/Continuous Deployment, the development software we help us to streamline the process of building, testing, and deploying software.

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


You will notice that the deployment becuase it is need some other configurations:

<img width="1433" alt="Week9-Codepipeline" src="https://user-images.githubusercontent.com/125006062/233820244-161caadf-44cc-4db6-9f57-49418b309403.png">



