'use strict';

var Http = require('http');
var cors = require('cors');
var Express = require('express');
var BodyParser = require('body-parser');
var Swaggerize = require('swaggerize-express');
var Path = require('path');
var port = process.env.PORT || 8000;

var App = Express();

var Server = Http.createServer(App);

App.use(cors());
App.options("*",cors());

App.use(BodyParser.json());
App.use(BodyParser.urlencoded({
    extended: true
}));

App.use(Swaggerize({
    api: Path.resolve('./config/swagger.yaml'),
    docspath: '/doc',
    handlers: Path.resolve('./handlers'),
    security: Path.resolve('./security')
}));

Server.listen(port, function () {
    App.swagger.api.host = this.address().address + ':' + this.address().port;
    /* eslint-disable no-console */
    console.log('App running on %s:%d', this.address().address, this.address().port);
    /* eslint-disable no-console */
});
