# Week 6 — Deploying Containers

## Contaniners

Containers are a type of software technology that allow applications to run consistently across different computing environments, such as development, testing, and production. A container consists of an entire runtime environment, including the application code, system tools, libraries, and settings required to run the application.

Containers are designed to be lightweight, portable, and isolated from the host system, which makes them ideal for deploying and running applications in distributed and cloud-based architectures. They use operating system-level virtualization to provide a consistent environment for the application to run, while also isolating the application from the underlying host system and other containers running on the same host.

Containers are often used with container orchestration platforms, such as Kubernetes, which automate the deployment, scaling, and management of containerized applications. Popular container technologies include Docker, rkt, and LXC.

## Dockers

Docker is a popular containerization platform that allows developers to build, package, and deploy applications as containers. It uses operating system-level virtualization to provide a lightweight, portable, and isolated environment for running applications.

Docker enables developers to create containers that contain all of the dependencies and libraries required to run their applications, making it easier to deploy and run applications consistently across different computing environments. It also provides tools for building, testing, and deploying containerized applications, as well as a public registry, Docker Hub, where users can share and distribute their container images.

Docker has become a popular technology for DevOps teams and cloud-based architectures, as it enables fast and efficient deployment and scaling of applications. It is supported by most major cloud platforms, including AWS, Microsoft Azure, and Google Cloud Platform.

./bin/rds/update-sq-rule


docker build \
--build-arg REACT_APP_BACKEND_URL="http://cruddur-alb-547998038.eu-central-1.elb.amazonaws.com:4567" \
--build-arg REACT_APP_AWS_PROJECT_REGION="$AWS_DEFAULT_REGION" \
--build-arg REACT_APP_AWS_COGNITO_REGION="$AWS_DEFAULT_REGION" \
--build-arg REACT_APP_AWS_USER_POOLS_ID="$AWS_COGNITO_USER_POOL_ID" \
--build-arg REACT_APP_CLIENT_ID="2bsm1nf80lse6sgrntodvnkq01" \
-t frontend-react-js \
-f Dockerfile.prod \
.




docker build \
--build-arg REACT_APP_BACKEND_URL="https://api.hallotausend.com" \
--build-arg REACT_APP_AWS_PROJECT_REGION="$AWS_DEFAULT_REGION" \
--build-arg REACT_APP_AWS_COGNITO_REGION="$AWS_DEFAULT_REGION" \
--build-arg REACT_APP_AWS_USER_POOLS_ID="eu-central-1_rDpbtgw5E" \
--build-arg REACT_APP_CLIENT_ID="2bsm1nf80lse6sgrntodvnkq01" \
-t frontend-react-js \
-f Dockerfile.prod \
.

docker build --build-arg REACT_APP_BACKEND_URL="https://api.hallotausend.com" --build-arg REACT_APP_AWS_PROJECT_REGION="$AWS_DEFAULT_REGION" --build-arg REACT_APP_AWS_COGNITO_REGION="$AWS_DEFAULT_REGION" --build-arg REACT_APP_AWS_USER_POOLS_ID="eu-central-1_rDpbtgw5E" --build-arg REACT_APP_CLIENT_ID="2bsm1nf80lse6sgrntodvnkq01" -t frontend-react-js -f Dockerfile.prod .


Login in ecs
./bin/ecr/login

## Build Backend prod
docker run -rm \
-p 4567:4567 \
-e AWS_ENDPOINT_URL="http://dynamodb-local:8000" \
-e CONNECTION_URL="postgresql://postgres:password@db:5432/cruddur" \
-e FRONTEND_URL="https://3000-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}" \
-e BACKEND_URL="https://4567-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}" \
-e OTEL_SERVICE_NAME='backend-flask' \
-e OTEL_EXPORTER_OTLP_ENDPOINT="https://api.honeycomb.io" \
-e OTEL_EXPORTER_OTLP_HEADERS="x-honeycomb-team=${HONEYCOMB_API_KEY}" \
-e AWS_XRAY_URL="*4567-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}*" \
-e AWS_XRAY_DAEMON_ADDRESS="xray-daemon:2000" \
-e AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION}" \
-e AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}" \
-e AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}" \
-e ROLLBAR_ACCESS_TOKEN="${ROLLBAR_ACCESS_TOKEN}" \
-e AWS_COGNITO_USER_POOL_ID="${AWS_COGNITO_USER_POOL_ID}" \
-e AWS_COGNITO_USER_POOL_CLIENT_ID="2bsm1nf80lse6sgrntodvnkq01" \   
-it backend-flask-prod


## Week7

### Create a docker Network

docker network create cruddur-net
<img width="682" alt="Week7-CreateDockerNetwork" src="https://user-images.githubusercontent.com/125006062/230715912-838c704a-b471-44bd-89b0-77b74f52a9f2.png">

### Check docker network

      docker network list

### .gitignore

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
    
    
    
### docker compose

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
    
    
    
### dockerfile

    #[TODO] For debugging, don't leave these in
    #RUN apt-get update -y
    #RUN apt-get install iputils-ping -y


### busybox

    #! /usr/bin/bash

    docker run --rm \
      --network cruddur-net \
      --publish 4567:4567 \
      -it busybox
  
  
  
  ### backend-flask.env.erb
  
      AWS_ENDPOINT_URL=http://dynamodb-local:8000
    # Postgres
    # CONNECTION_URL: "${PROD_CONNECTION_URL}"
    CONNECTION_URL=postgresql://postgres:password@DB:5432/cruddur
    FRONTEND_URL= https://3000-<%= ENV['GITPOD_WORKSPACE_ID'] %>.<%= ENV['GITPOD_WORKSPACE_CLUSTER_HOST'] %>
    BACKEND_URL=https://4567-<%= ENV['GITPOD_WORKSPACE_ID'] %>.<%= ENV['GITPOD_WORKSPACE_CLUSTER_HOST'] %>
    # Honycomb backend
    OTEL_SERVICE_NAME=backend-flask
    OTEL_EXPORTER_OTLP_ENDPOINT=https://api.honeycomb.io
    OTEL_EXPORTER_OTLP_HEADERS=x-honeycomb-team=<%= ENV['HONEYCOMB_API_KEY'] %>
    # xray
    AWS_XRAY_URL=*4567-<%= ENV['GITPOD_WORKSPACE_ID'] %>.<%= ENV['GITPOD_WORKSPACE_CLUSTER_HOST'] %>*
    AWS_XRAY_DAEMON_ADDRESS=xray-daemon:2000
    # AWS
    AWS_DEFAULT_REGION=<%= ENV['AWS_DEFAULT_REGION'] %>
    AWS_ACCESS_KEY_ID=<%= ENV['AWS_ACCESS_KEY_ID'] %>
    AWS_SECRET_ACCESS_KEY=<%= ENV['AWS_SECRET_ACCESS_KEY'] %>
    # Rollbar
    ROLLBAR_ACCESS_TOKEN=<%= ENV['ROLLBAR_ACCESS_TOKEN'] %>
    # Cognito
    AWS_COGNITO_USER_POOL_ID=<%= ENV['AWS_COGNITO_USER_POOL_ID'] %>
    AWS_COGNITO_USER_POOL_CLIENT_ID=2bsm1nf80lse6sgrntodvnkq01


### Backend-flask.env.erb

    const REACT_APP_BACKEND_URL=https://4567-<%= ENV['process.env.GITPOD_WORKSPACE_ID'] %>.<%= ENV['process.env.GITPOD_WORKSPACE_CLUSTER_HOST'] %>
    #HoneyComb fronted
    const OTEL_SERVICE_NAME=frontend-ract-js
    const HONEYCOMB_TRACES_API=https://api.honeycomb.io/v1/traces
    #const HONEYCOMB_API_KEY = <%= ENV['HONEYCOMB_API_KEY'] %>
    #AWS Cognito
    const REACT_APP_AWS_PROJECT_REGION=<%= ENV['AWS_DEFAULT_REGION'] %>
    const REACT_APP_AWS_COGNITO_REGION=<%= ENV['AWS_DEFAULT_REGION'] %>
    const REACT_APP_AWS_USER_POOLS_ID=eu-central-1_rDpbtgw5E
    const REACT_APP_CLIENT_ID =2bsm1nf80lse6sgrntodvnkq01

    
    


