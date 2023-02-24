FROM node:16.18

ENV PORT=3000

COPY . /frontend-react-js
WORKDIR /frontend-react-js
RUN npm install
EXPOSE ${PORT}
CMD ["npm", "start"]

# Build stage
#FROM node:16.18 AS build
#WORKDIR /build
#COPY package.json package-lock.json ./
#RUN npm ci --silent
#COPY . .
#RUN npm run build

# Run stage
#FROM node:16.18-slim
#ENV NODE_ENV=production
#ENV PORT=3000
#WORKDIR /app
#COPY --from=build /build/dist .
#RUN npm ci --only=production --silent
#EXPOSE ${PORT}
#CMD ["node", "index.js"]