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
    
    

Source:

https://www.youtube.com/watch?v=BRmEG4zicM0&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=85
