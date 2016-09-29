FROM node:5.11
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./app/ /usr/src/app/
RUN npm install
RUN npm install -g nodemon
EXPOSE 8000 6000
cmd [ "nodemon", "--debug=6000 server.js" ]
