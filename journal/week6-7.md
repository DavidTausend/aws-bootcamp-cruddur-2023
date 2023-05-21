# Week 6 and 7 — Deploying Containers, solving CORS with a Load Balancer and Custom Domain


## Contaniners

Containers are a type of software technology that allow applications to run consistently across different computing environments, such as development, testing, and production. A container consists of an entire runtime environment, including the application code, system tools, libraries, and settings required to run the application.


## Dockers

Docker is a popular containerization platform that allows developers to build, package, and deploy applications as containers. It uses operating system-level virtualization to provide a lightweight, portable, and isolated environment for running applications.


## Homework challenge 

### React App on AWS S3 with Static Hosting and Cloudfront 

Create a S3 buckets with the name of the website and diasble block all public access, in my case it will be:
www.hallotausend.com

<img width="1440" alt="Week7-S3BlockDisable" src="https://user-images.githubusercontent.com/125006062/230842249-dcf20dec-61f2-4c79-9fbd-db72f7056eeb.png">



We need to make before we can access the website is to allow read access to anyone. Go to the Permissions tab and update the Bucket policy. Replace www.hallotausend.com with your bucket name:

     {
         "Version": "2012-10-17",
         "Statement": [
             {
                 "Sid": "PublicReadGetObject",
                 "Effect": "Allow",
                 "Principal": "*",
                 "Action": [
                     "s3:GetObject"
                 ],
                 "Resource": [
                     "arn:aws:s3:::www.hallotausend.com/*"
                 ]
             }
         ]
     }
     
     
     
 <img width="1440" alt="Week7-BucketPolicy" src="https://user-images.githubusercontent.com/125006062/230842295-fc58074a-55c8-467f-b9fd-e2591d315311.png">

     
Enable static website hosting for your s3 bucket:

<img width="1440" alt="Week7-EnableStaticWebsite" src="https://user-images.githubusercontent.com/125006062/230773154-161f3f5e-25c1-4ae0-8bc9-b31a94d2728c.png">

Build the website with the following command:

  npm run build

Then upload the website to aws using the following command:
Note: make sure that you are in the right directory, where you run the build that will be in frontend-react-js.

     aws S3 sync build s3://www.hallotausend.com

<img width="1440" alt="Week7-UploadBuildtoS3" src="https://user-images.githubusercontent.com/125006062/230842100-14fac159-38c4-45e1-a3c8-6d2e2cde8027.png">


On this point you can try the your website with the link on static website S3 bucket, the website should just open with http protocol.

<img width="1424" alt="Bildschirmfoto 2023-04-10 um 8 29 33 AM" src="https://user-images.githubusercontent.com/125006062/230841364-e3b5f9f7-423c-4773-998c-efde8e27bc9b.png">

Request a public certicate in certificate manager. Note: The certificate must be request in us-east-1 issued, because we will use cloudfront is a global resource.

<img width="1440" alt="Week7-CM" src="https://user-images.githubusercontent.com/125006062/230845235-ce7a5985-78d3-4e27-a92c-a2737d909d04.png">


Go to Route53 and create dns entry for the certificates:

<img width="1435" alt="Week7-DNS" src="https://user-images.githubusercontent.com/125006062/230850221-5bcf7457-d597-45c8-8250-ef041e88d0d6.png">



The certicate might take time to be issued.

<img width="1440" alt="Wee7-IssuedCertificate" src="https://user-images.githubusercontent.com/125006062/230846025-e6223f8d-44b6-4558-a5e0-15aeac3b4db6.png">



Go to cloudfront to create a new distribution with the following configurations:

<img width="889" alt="Bildschirmfoto 2023-04-10 um 8 43 28 AM" src="https://user-images.githubusercontent.com/125006062/230843533-49378b8f-4a80-4a89-a718-e2dcee478083.png">

Enable Redirect HTTP to HTTPS
<img width="1440" alt="Week7-HTTPS" src="https://user-images.githubusercontent.com/125006062/230843838-61ff99c1-8f71-49d7-9d3e-a465c4923978.png">


Select the previews certificate that we created and type index.html on default root object:

<img width="1428" alt="Week7-CFCertificate" src="https://user-images.githubusercontent.com/125006062/230851894-08907e79-14a2-4994-b348-d98b79f907a5.png">


Then deploy it and wait a while for testing it with the following command:

dig www.hallotausend.com

<img width="945" alt="Week7-DigS3" src="https://user-images.githubusercontent.com/125006062/230858478-dbc4b3db-b687-4068-9522-e52c79410c86.png">


note: It must return your bucket name.

Add another DNS entry with the distribution URL pointing to the S3 bucket in Route53:

<img width="436" alt="Week7-DNSPointCF" src="https://user-images.githubusercontent.com/125006062/230854801-fa1f60c3-482b-440e-b022-b0f6109310a4.png">

Check if the website is point with the cloudfrount: 

dig www.hallotausend.com

<img width="953" alt="Week7-PointCF" src="https://user-images.githubusercontent.com/125006062/230854958-32e538be-2c42-46d7-b951-13199f817cf1.png">


At last try your website www.hallotausend.com:

<img width="1435" alt="Week7-CFWebsiteWork" src="https://user-images.githubusercontent.com/125006062/230865294-b6892432-ffe8-42cc-ba81-c8e20b1c82f2.png">


To make cloudfront with our application just add ALB:

<img width="1434" alt="Week7-AddALBtoCF" src="https://user-images.githubusercontent.com/125006062/230869366-13e0fa15-3cd1-4fc7-ac3c-cadbc848f4b8.png">



## Docker Compose clear up

### Create backend-flask and frontend-react-js

  ### backend-flask.env.erb
  
    AWS_ENDPOINT_URL=http://dynamodb-local:8000
    CONNECTION_URL=postgresql://postgres:password@DB:5432/cruddur
    FRONTEND_URL= https://3000-<%= ENV['GITPOD_WORKSPACE_ID'] %>.<%= ENV['GITPOD_WORKSPACE_CLUSTER_HOST'] %>
    BACKEND_URL=https://4567-<%= ENV['GITPOD_WORKSPACE_ID'] %>.<%= ENV['GITPOD_WORKSPACE_CLUSTER_HOST'] %>
    OTEL_SERVICE_NAME=backend-flask
    OTEL_EXPORTER_OTLP_ENDPOINT=https://api.honeycomb.io
    OTEL_EXPORTER_OTLP_HEADERS=x-honeycomb-team=<%= ENV['HONEYCOMB_API_KEY'] %>
    AWS_XRAY_URL=*4567-<%= ENV['GITPOD_WORKSPACE_ID'] %>.<%= ENV['GITPOD_WORKSPACE_CLUSTER_HOST'] %>*
    AWS_XRAY_DAEMON_ADDRESS=xray-daemon:2000
    AWS_DEFAULT_REGION=<%= ENV['AWS_DEFAULT_REGION'] %>
    AWS_ACCESS_KEY_ID=<%= ENV['AWS_ACCESS_KEY_ID'] %>
    AWS_SECRET_ACCESS_KEY=<%= ENV['AWS_SECRET_ACCESS_KEY'] %>
    ROLLBAR_ACCESS_TOKEN=<%= ENV['ROLLBAR_ACCESS_TOKEN'] %>
    AWS_COGNITO_USER_POOL_ID=<%= ENV['AWS_COGNITO_USER_POOL_ID'] %>
    AWS_COGNITO_USER_POOL_CLIENT_ID=2bsm1nf80lse6sgrntodvnkq01


### frontend-react.js.env.erb

    REACT_APP_BACKEND_URL=https://4567-<%= ENV['process.env.GITPOD_WORKSPACE_ID'] %>.<%= ENV['process.env.GITPOD_WORKSPACE_CLUSTER_HOST'] %>
    HONEYCOMB_TRACES_API=https://api.honeycomb.io/v1/traces
    HONEYCOMB_API_KEY = <%= ENV['HONEYCOMB_API_KEY'] %>
    REACT_APP_AWS_PROJECT_REGION=<%= ENV['AWS_DEFAULT_REGION'] %>
    REACT_APP_AWS_COGNITO_REGION=<%= ENV['AWS_DEFAULT_REGION'] %>
    REACT_APP_AWS_USER_POOLS_ID=eu-central-1_rDpbtgw5E
    REACT_APP_CLIENT_ID =2bsm1nf80lse6sgrntodvnkq01

### Create a docker Network

Create cruddur-net to communicate with the other resources:

      docker network create cruddur-net

<img width="682" alt="Week7-CreateDockerNetwork" src="https://user-images.githubusercontent.com/125006062/230715912-838c704a-b471-44bd-89b0-77b74f52a9f2.png">

### Check docker network

      docker network list

### Add *.env .gitignore

    docker/**/*
    frontend-react-js/build/*
    *.env


### gitpod.yml

    tasks:
      - name: aws-cli
        env:
          AWS_CLI_AUTO_PROMPT: on-partial
        before: |
          cd /workspace
          curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
          unzip awscliv2.zip
          sudo ./aws/install
          cd $THEIA_WORKSPACE_ROOT
      - name: postgres
        before: |
          curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc|sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg
          echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list
          sudo apt update
          sudo apt install -y postgresql-client-13 libpq-dev
        command: |
          export GITPOD_IP=$(curl ifconfig.me)
          source  "$THEIA_WORKSPACE_ROOT/bin/rds/update-sg-rule"
      #Install npm
      - name: react-js
        command: |
          source  "$THEIA_WORKSPACE_ROOT/bin/frontend/generate-env"
          cd frontend-react-js
          npm i
      #Install requirements.txt for boto3    
      - name: flask
        command: |
          source  "$THEIA_WORKSPACE_ROOT/bin/backend/generate-env"
          cd backend-flask
          pip install -r requirements.txt           
      - name: fargate
        before: |
          curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/ubuntu_64bit/session-manager-plugin.deb" -o "session-manager-plugin.deb"
          sudo dpkg -i session-manager-plugin.deb   
          cd backend-flask
    vscode:
      extensions:
       - 42Crunch.vscode-openapi
       - cweijan.vscode-postgresql-client2

    ports:
      - name: frontend
        port: 3000
        onOpen: open-browser
        visibility: public
      - name: backend
        port: 4567
        visibility: public
      - name: xray-daemon
        port: 2000
        visibility: public
    
    
    
### Add the network and the new env_file in the docker compose file

    version: "3.8"
    services:
      backend-flask:
        env_file:
          - backend-flask.env
        build: ./backend-flask
        ports:
          - "4567:4567"
        volumes:
          - ./backend-flask:/backend-flask
        networks:
          - cruddur-net  
        #Homework backend healthcheck  
        healthcheck: 
          test: ["CMD-SHELL", "curl --fail http://localhost:4567/api/activities/home || exit 1"]
          interval: 30s
          timeout: 10s
          retries: 3
        #End of the healthcheck  
      frontend-react-js:
        env_file:
          - frontend-react-js.env
        build: ./frontend-react-js
        ports:
          - "3000:3000"
        networks:
          - cruddur-net   
        volumes:
          - ./frontend-react-js:/frontend-react-js 
        #Homework frontend healthcheck  
        healthcheck:
          test: ["CMD-SHELL", "curl --fail http://localhost:3000 || exit 1"]
          interval: 30s
          timeout: 10s
          retries: 3    
        #End of thr healthcheck  
      dynamodb-local:
        # https://stackoverflow.com/questions/67533058/persist-local-dynamodb-data-in-volumes-lack-permission-unable-to-open-databa
        # We needed to add user:root to get this working.
        user: root
        command: "-jar DynamoDBLocal.jar -sharedDb -dbPath ./data"
        image: "amazon/dynamodb-local:latest"
        container_name: dynamodb-local
        ports:
          - "8000:8000"
        networks:
          - cruddur-net   
        volumes:
          - "./docker/dynamodb:/home/dynamodblocal/data"
        working_dir: /home/dynamodblocal
      db:
        image: postgres:13-alpine
        restart: always
        environment:
          - POSTGRES_USER=postgres
          - POSTGRES_PASSWORD=password
        ports:
          - '5432:5432'
        networks:
          - cruddur-net   
        volumes: 
          - db:/var/lib/postgresql/data
      xray-daemon:
        image: "amazon/aws-xray-daemon"
        environment:
          AWS_ACCESS_KEY_ID: "${AWS_ACCESS_KEY_ID}"
          AWS_SECRET_ACCESS_KEY: "${AWS_SECRET_ACCESS_KEY}"
          AWS_REGION: "eu-central-1"
        command:
          - "xray -o -b xray-daemon:2000"
        ports:
          - 2000:2000/udp
        networks:
          - cruddur-net   
    # the name flag is a hack to change the default prepend folder
    # name when outputting the image names
    networks: 
      cruddur-net:
        driver: bridge
        name: cruddur-net

    volumes:
      db:
        driver: local
    
    
    
### Troubleshoot issues with backend docker network

Create the following script if you are having problems with your backend docker network:

    #! /usr/bin/bash

    docker run --rm \
      --network cruddur-net \
      --publish 4567:4567 \
      -it busybox    

Source: 
https://www.youtube.com/watch?v=QIZx2NhdCMI&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=58
https://www.youtube.com/watch?v=QIZx2NhdCMI&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=59
https://www.youtube.com/watch?v=QIZx2NhdCMI&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=60
https://www.youtube.com/watch?v=QIZx2NhdCMI&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=61
https://www.youtube.com/watch?v=QIZx2NhdCMI&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=62
https://www.youtube.com/watch?v=G_8_xtS2MsY&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=63
https://www.youtube.com/watch?v=G_8_xtS2MsY&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=64
