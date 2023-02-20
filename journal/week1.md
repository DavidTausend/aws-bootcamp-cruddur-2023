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

To run a dockerfile CMD as an external script, it has to be define the command to be run in a separate script file, then reference that script file in the CMD instruction in the dockerfile.

example:

FROM some-image:latest

COPY my-script.sh /

CMD ["/my-script.sh"]

In this example, the Dockerfile starts with a base image "some-image:latest" and then copies a script file "my-script.sh" to the root directory of the container. Finally, the CMD instruction runs the script file by executing the command ["/my-script.sh"].

To use this Dockerfile, it's needed to create the my-script.sh file and place it in the same directory as the Dockerfile. The script file should contain the command or commands you want to run when the container starts up.

An exanmple from my-script.sh could be: echo "Hello, World!". Then running the Docker container, should output Hello, World! printed to the console.

docker-compose up

## Push and tag a image to DockerHub 

Sign up to DockerHub and create an account, then provide the DockerHub credentials (username and password).  Inside the website create a repository to move the docker container:

<img width="887" alt="Week1-DockerHub Respository" src="https://user-images.githubusercontent.com/125006062/219968809-873ce84f-ee26-4c35-a746-8dc7ae11b907.png">

Go to Github to identify the Docker container that you want to move with the following command:

docker images
<img width="766" alt="Docker Images" src="https://user-images.githubusercontent.com/125006062/220195384-81e855b4-5c32-4d3c-b008-11919c4d4275.png">


docker login

Username/Password
docker tag imagesourcername:tag imagetargetname:newtag
<img width="793" alt="Bildschirm­foto 2023-02-20 um 9 32 14 PM" src="https://user-images.githubusercontent.com/125006062/220195858-703e3e9d-e423-49d5-82a4-f6386197d280.png">

docker push username/image:tag
<img width="790" alt="Bildschirm­foto 2023-02-20 um 9 33 21 PM" src="https://user-images.githubusercontent.com/125006062/220195505-4ae5ed92-edf5-4a3b-aff4-3a74915166ab.png">

<img width="1440" alt="Docker Hub" src="https://user-images.githubusercontent.com/125006062/220195751-c63621b4-c70a-469b-ba68-cc43a6296771.png">

Build your Docker image using the docker build command. Make sure to specify a unique name and tag for your image using the -t flag.

To push an image to Docker Hub, you must first name your local image using your Docker Hub username and the repository name that you created through Docker Hub on the web.

You can add multiple images to a repository by adding a specific :<tag> to them (for example docs/base:testing). If it’s not specified, the tag defaults to latest.

Name your local images using one of these methods:

When you build them, using docker build -t <hub-user>/<repo-name>[:<tag>]
By re-tagging an existing local image docker tag <existing-image> <hub-user>/<repo-name>[:<tag>]
By using docker commit <existing-container> <hub-user>/<repo-name>[:<tag>] to commit changes
Now you can push this repository to the registry designated by its name or tag.


$ docker push <hub-user>/<repo-name>:<tag>
The image is then uploaded and available for use by your teammates and/or the community.


## Use multi-stage building for a Dockerfile build

## Implement a healthcheck in the V3 Docker compose file

version: "3"

services:
  my-service:
    image: my-image:latest
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/healthcheck"]
      interval: 30s
      timeout: 10s
      retries: 3
      
In this example, we have a service named my-service that is based on the my-image:latest Docker image. The healthcheck parameter is defined with several options:

test: This specifies the command to run to check the health of the service. In this case, we're using curl to make an HTTP request to the /healthcheck endpoint of our service.

interval: This specifies how frequently the health check should be run. In this case, it will run every 30 seconds.

timeout: This specifies how long to wait for a response from the health check command. If the command takes longer than this time, the check will fail.

retries: This specifies how many times to retry the health check before considering the service unhealthy.

When you run docker-compose up with this file, Compose will start the my-service container and run the health check command at the specified interval. If the health check fails, the container will be marked as unhealthy and Compose will attempt to restart it based on the restart policy defined in the docker-compose.yml file.

You can monitor the health of your containers using the docker ps command, which will show the status of the health checks. For example, if the health check for my-service is failing, the output of docker ps might look like this:

CONTAINER ID   IMAGE            COMMAND                  CREATED          STATUS                     PORTS      NAMES
1234567890ab   my-image:latest  "my-service start"       5 minutes ago    Up 5 minutes (unhealthy)   8080/tcp   my-service


 
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
  
 

## Launch an EC2 instance that has docker installed, and pull a container to demonstrate you can run your own docker processes. 
