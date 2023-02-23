# Week 1 — App Containerization

# Homework

## Container security top 10 best practices

In the following information you will find the top 10 best practices for contianers which you can use in your day-to-day while working in an Enterprise as a cloud engineer or cloud secure engineer and in a bootcamp.

### What is container Security?

Container Security is the practice of protecting your application hosted on compute service like containers.

### Application Security vs. Container Security

It's similar but different when we talk about container security, application sercurity is the practice of protecting the applications running on a compute service called containers if the application is within a container, now simply what container security is a practice of protecting applications that are running on something called a container which is a compute service.

### Why contianer sercurty became popular?

The first reason is Docker, it's a very popular open source of containers and it's basically available on every cloud now, other reason why container security got popular is because it was a cloud agnostic and an OS agnostic way of running applications there used to be a thing for people who may not have been in the ID space or the cloud space for a while there used to be a problem where if we were to build an application on my laptop.

### Top 10 conteaner security Best Practice

+ Keep Host & Docker Updated to latest security patches.
+ Docker Deamon & containers should run in non root user mode
+ Image Vulnerability Scanning
+ Trust a Private vs Public Image Registry
+ No Sensitive Data in Docker Files or Images
+ Use Secret Management Services to share secrets.
+ Read only file system and volume for dockers
+ Separate databases for long term storage
+ Use DevSecOps pratices while building application security
+ Ensure all code is tested for vulnerabilities before production use

https://www.youtube.com/watch?v=OjZz4D0B-cA&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=25

## Run the dockerfile CMD as an external script

To run a dockerfile CMD as an external script, it has to be define the command to be run in a separate script file, then reference that script file in the CMD instruction in the dockerfile. First create a script file on root and the name the file external.sh and inside has to have the script to be run like the example:

#!/bin/sh
python3 -m flask run --host=0.0.0.0 --port=4567

Then I change the command in the backend dockerfile to call the external script:

CMD [ "sh", "-c", "./external.sh" ]

## Push and tag a image to DockerHub 

Sign up to DockerHub and create an account, then provide the DockerHub credentials (username and password).

Go to Github to identify the Docker container that you want to move with the following command:

docker images

<img width="766" alt="Docker Images" src="https://user-images.githubusercontent.com/125006062/220195384-81e855b4-5c32-4d3c-b008-11919c4d4275.png">

docker login and Username/Password
<img width="782" alt="Week1-LoginDocker" src="https://user-images.githubusercontent.com/125006062/220835541-31e07639-58e9-4fb6-bbbb-cbc955514e7c.png">

docker tag imagesourcername:tag imagetargetname:newtag

<img width="793" alt="Bildschirm­foto 2023-02-20 um 9 32 14 PM" src="https://user-images.githubusercontent.com/125006062/220195858-703e3e9d-e423-49d5-82a4-f6386197d280.png">

docker push username/image:tag

<img width="790" alt="Bildschirm­foto 2023-02-20 um 9 33 21 PM" src="https://user-images.githubusercontent.com/125006062/220195505-4ae5ed92-edf5-4a3b-aff4-3a74915166ab.png">
<img width="1296" alt="Docker Hub" src="https://user-images.githubusercontent.com/125006062/220196356-819ab60f-7f6d-4494-884c-d2583aa6dddf.png">


## Use multi-stage building for a Dockerfile build


Backend
#Build stage
FROM node:16.18 AS build
WORKDIR /frontend-react-js
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#Run stage
FROM node:16.18 AS run
ENV PORT=3000
WORKDIR /app
COPY --from=build /frontend-react-js/build /app
RUN npm install -g serve
EXPOSE ${PORT}
CMD ["serve", "-s", ".", "-p", "3000"]



Frontend
#Build stage
FROM python:3.10-slim-buster AS build
WORKDIR /backend-flask
COPY requirements.txt requirements.txt
RUN pip3 install --user --no-cache-dir -r requirements.txt

#Production stage
FROM python:3.10-slim-buster AS production
WORKDIR /app
COPY --from=build /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
ENV FLASK_ENV=production
ENV PORT=4567
EXPOSE ${PORT}
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=${PORT}"]



## Healthcheck in Docker compose file

After the backend volume image I added healtcheck:

version: "3.8"
services:
  backend-flask:
    environment:
      FRONTEND_URL: "https://3000-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
      BACKEND_URL: "https://4567-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
    build: ./backend-flask
    ports:
      - "4567:4567"
    volumes:
      - ./backend-flask:/backend-flask  
    healthcheck:
      test: ["CMD-SHELL", "curl --fail http://localhost:4567/healthcheck || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

      
The healthcheck parameter is defined with several options:

+ test: This specifies the command to run to check the health of the service. In this case, we're using curl to make an HTTP request to the /healthcheck endpoint of our service.

+ interval: This specifies how frequently the health check should be run. In this case, it will run every 30 seconds.

+ timeout: This specifies how long to wait for a response from the health check command. If the command takes longer than this time, the check will fail.

+ retries: This specifies how many times to retry the health check before considering the service unhealthy.

When you run docker-compose up with this file, Compose will start the backend-flask container and run the health check command at the specified interval. If the health check fails, the container will be marked as unhealthy and Compose will attempt to restart it based on the restart policy defined in the docker-compose.yml file.

It is posible to monitor the health of the containers using the docker ps command, which will show the status of the health checks. 
 
## The best practices for Dockerfiles
  
  
+ Use a minimal base image: Choose a base image that has only the necessary software and libraries required for your application. This reduces the size of the image and minimizes the attack surface.
  
+ Use specific tags for base images: Use specific tags for your base images to ensure consistency and to avoid unexpected changes in the environment.
Use caching: Use caching to speed up the Docker build process. Caching layers that don't change can be reused in subsequent builds.
  
+ Minimize the number of layers: Minimize the number of layers in your Docker image to reduce the size and complexity of the image.
  
+ Copy files in a single layer: Copy files in a single layer to reduce the size of the image and improve performance.
  
+ Use .dockerignore file: Use a .dockerignore file to exclude unnecessary files and directories from the Docker build context. This reduces the build time and the size of the image.
  
+ Set a user for the container: Set a user for the container to improve security by reducing the privileges of the container.
  
+ Remove unnecessary packages and files: Remove unnecessary packages and files to reduce the size of the image and minimize the attack surface.
  
+ Use environment variables: Use environment variables to pass configuration information to the container at runtime. This makes the container more flexible and configurable.
  
+ Use multi-stage builds: Use multi-stage builds to create smaller and more efficient images. This allows you to separate the build environment from the runtime environment and only include what is necessary in the final image.

## Learn how to install Docker on your localmachine and get the same containers running outside of Gitpod / Codespaces
  
 First step, I installed Docker in my localmachine:
 <img width="715" alt="Week1-DockerInstallation" src="https://user-images.githubusercontent.com/125006062/220744661-197f19d0-8fc9-4488-be1f-bb7c5f9e3178.png">
Because I had many problems trying to push directly the docker image from Gitpod to my localmachine, I decided to pull backend image in Docker Hub that I already had uploaded, I can connect from the docker app on my localmachine to docker hub and pull the image easily by just clicking "pull". For sure, it is possible to use the terminal to pull and run the image. 
<img width="1269" alt="Week1-PullDocker" src="https://user-images.githubusercontent.com/125006062/220746861-2bdb2efe-b241-4214-9b09-a61561134e0b.png">

Then I went back to local and run the docker image:

<img width="1268" alt="Week1-RunDocker" src="https://user-images.githubusercontent.com/125006062/220749071-81d88468-6a85-441a-85a2-b6d8c5b132c4.png">

To test the image, unter inspect is the link to test it with the browser:
<img width="1262" alt="Bildschirm­foto 2023-02-22 um 9 18 32 PM" src="https://user-images.githubusercontent.com/125006062/220749791-f0fc7247-ca82-4880-ab9d-bf33be3a1b62.png">

<img width="1440" alt="Week1-CheckLinkDocker" src="https://user-images.githubusercontent.com/125006062/220750158-5c223325-d6de-48ef-bcdb-cf8fa9fa2377.png">

## Launch an EC2 instance that has docker installed, and pull a container to demonstrate you can run your own docker processes. 

I launched an Ubuntu EC2 instance and installed Docker using the following command:
sudo apt install docker.io
![Week1-InstallDockerUbuntu](https://user-images.githubusercontent.com/125006062/220842128-317b491b-d931-43b3-a0f9-c53976292003.png)

Add a user to docker group so it is possible to manage the docker images:

![Week1-AddtheUsertoDockerGroup](https://user-images.githubusercontent.com/125006062/220842602-07102ed8-ac87-49d7-80f2-d6dba874b4af.png)

Login to Docker hub:

![Week1-EntertoDockerHub](https://user-images.githubusercontent.com/125006062/220842931-4ce38bf2-b9a0-401e-87f2-fc132557a410.png)

Pull the docker container:

![Week1-pulldocker](https://user-images.githubusercontent.com/125006062/220843129-ea36f489-eb8f-4b0e-8e74-b943101ab75e.png)

Run the docker Container:

![Week1-RunningDocker](https://user-images.githubusercontent.com/125006062/220843206-cd696675-032d-4b2a-8cb6-46ba3bcac091.png)


