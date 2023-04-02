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
