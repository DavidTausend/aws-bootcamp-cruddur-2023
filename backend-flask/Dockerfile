#FROM python:3.10-slim-buster

# Inside Container
# Make a new folder inside the container
#WORKDIR /backend-flask

# Outside Container -> Inside Container
# This contairs the libraries want to install to run the app
#COPY requirements.txt requirements.txt

# Inside Container
# Install the python libraries used for the app
#RUN pip3 install -r requirements.txt

# Outside Container -> Inside Container
# . means everything in the current directory
# first period . - /backend-flask (outside container)
# Second period . /backend.flask (inside container)

#COPY . .

# Set Enviroment Variable (Env Vars)
# Inside Container and will remain set when the container is runnnung
#ENV FLASK_ENV=development

#EXPOSE ${PORT}

# CMD (Command)
# python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=4567
#Andrew's Code
#CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=4567"]
#External CMD script
#CMD [ "sh", "-c", "./External.sh" ]

# Build stage
FROM python:3.10-slim-buster AS build
WORKDIR /build
COPY requirements.txt requirements.txt
RUN pip3 install --prefix=/install -r requirements.txt
COPY . .

# Run stage
FROM python:3.10-slim-buster
ENV FLASK_ENV=development
ENV PORT=4567
WORKDIR /app
COPY --from=build /install /usr/local
COPY --from=build /build .
EXPOSE ${PORT}
CMD ["sh", "-c", "./External.sh"]
