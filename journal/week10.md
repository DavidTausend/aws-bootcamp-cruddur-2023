# Week 10 — CloudFormation Part 1

Cloudformation will help us to setup our AWS resources so that we can spend less time creating or managing those resourses and more time developing our application. 

Here are the main benefits:
+ Simplify infrastructure management
+ Quickly replicate your infrastructure
+ Easily control and track changes to your infrastructure

Source:https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html


The first assisment for this week is to create a template.yml file unter aws/cfn/:

    AWSTemplateFormatVersion: 2010-09-09
    Description: |
      Setup ECS Cluster
    Resources:
      ECSCluster: #Logical Name
        Type: 'AWS::ECS::Cluster'
        Properties:
          ClusterName: MyCluster
          CapacityProvider: []
      

To automate the process of creating lets create a bash script unter bin/cfn/deploy with the following code:

    #! /usr/bin/env bash
    set -e # Stop the excution of the script if it fails

    CFN_PATH="/workspace/aws-bootcamp-cruddur-2023/aws/cfn/template.yml"

    aws cloudformation deploy \
        --stack-name "my-cluster" \
        --template-file $CFN_PATH \
        --no-execute-changeset \
        --capabilities CAPABILITY_NAMED_IAM
    
<img width="869" alt="Week10-CreateStack" src="https://user-images.githubusercontent.com/125006062/233837842-bf7646c1-7325-426a-b442-47822e37565c.png">


To check if the stack was created go the Cloudformation on AWS:

<img width="1365" alt="Week10-MyCluster" src="https://user-images.githubusercontent.com/125006062/233837949-59832862-6e67-495b-9e11-5bdd6ae18e2b.png">


Open your cluster, select change sets name, then click twice execute change set to deploy it:

<img width="596" alt="Week10-ExecuteChangeSet" src="https://user-images.githubusercontent.com/125006062/233838830-7f2ac9a0-1fa9-406e-839f-3b7b065136b5.png">


Validate the Cloudformation teamplate at this location on local machine:

aws cloudformation validate-template --template-body file:///workspace/aws-bootcamp-cruddur-2023/aws/cfn/template.yml



pip install cfn-lint


Source:
https://www.youtube.com/watch?v=BRmEG4zicM0&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=85
