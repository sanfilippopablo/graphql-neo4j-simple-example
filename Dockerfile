FROM node:latest

WORKDIR /app

COPY package.json .
RUN npm install
RUN npm install hapi

COPY . .

CMD npm start