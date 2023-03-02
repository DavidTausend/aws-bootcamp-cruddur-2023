#FROM node:16.18

#ENV PORT=3000

#COPY . /frontend-react-js
#WORKDIR /frontend-react-js
#RUN npm install
#EXPOSE ${PORT}
#CMD ["npm", "start"]

# Build stage
FROM node:16.18-alpine AS build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Final stage
FROM node:16.18-alpine
ENV PORT=3000
WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json* /app/
RUN npm install --production --silent
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/src /app/src
EXPOSE ${PORT}
CMD ["npm", "start"]