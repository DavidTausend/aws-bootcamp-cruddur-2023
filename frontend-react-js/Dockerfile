#FROM node:16.18

#ENV PORT=3000

#COPY . /frontend-react-js
#WORKDIR /frontend-react-js
#RUN npm install
#EXPOSE ${PORT}
#CMD ["npm", "start"]

# Build Stage
FROM node:16.18 AS build
COPY package*.json /frontend-react-js/
WORKDIR /frontend-react-js
RUN npm install
COPY . .
RUN npm run build

# Final Stage
FROM node:16.18-alpine
ENV PORT=3000
WORKDIR /frontend-react-js
COPY --from=build /frontend-react-js/build ./build
COPY --from=build /frontend-react-js/node_modules ./node_modules
EXPOSE ${PORT}
CMD ["npm", "start"]
