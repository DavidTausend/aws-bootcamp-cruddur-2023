## Architecture Guide

Before you run ayn templates, be sure to create an S3 bucket to contain
all off our artifacts for CloudFormation.

````
aws s3 mk s3://cfn-artifacts
export CFN_BUCKET="CFN-artifacts"
gp env CFN_BUCKET="CFN-artifacts"