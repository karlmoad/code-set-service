'use strict';
const jwt = require('jsonwebtoken');
/**
 * Authorize function for securityDefinitions:token
 * type : apiKey
 * description: 
 */
module.exports = function authorize(req, res, next) {

    // The context('this') for authorize will be bound to the 'securityDefinition'
    // this.name - The name of the header or query parameter to be used for securityDefinitions:token apiKey security scheme.
    // this.in - The location of the API key ("query" or "header") for securityDefinitions:token apiKey security scheme.
    var auth = req.header(this.name);
    var key = process.env.JWT_KEY;

    if(auth) {
        jwt.verify(auth, key, {algorithm: 'HS512'}, function (err, decoded) {
            if (err) {
                res.status(400).send('Unauthorized');
            }
            else {
                req.auth = decoded;
                next();
            }
        });
    }
};
