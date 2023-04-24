## Architecture Guide

Before you run ayn templates, be sure to create an S3 bucket to contain
all off our artifacts for CloudFormation.

````
aws s3 mk s3://cfn-artifacts-hallotausend.com
export CFN_BUCKET="cfn-artifacts-hallotausend.com"
gp env CFN_BUCKET="cfn-artifacts-hallotausend.com"
````

> Remember bucket names are unique to the provide code example you may need to adjust
