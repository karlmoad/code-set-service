FROM node:5.11
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./app/ /usr/src/app/
RUN npm install
EXPOSE 8000
cmd [ "npm", "start" ]
