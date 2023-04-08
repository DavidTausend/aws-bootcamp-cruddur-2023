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



## Create a docker Network

docker network create cruddur-net
<img width="682" alt="Week7-CreateDockerNetwork" src="https://user-images.githubusercontent.com/125006062/230715912-838c704a-b471-44bd-89b0-77b74f52a9f2.png">


