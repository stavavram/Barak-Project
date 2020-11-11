FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . /usr/share/server

EXPOSE 8200
CMD [ "node", "index.js" ]