'use strict';
/**
 * Authorize function for securityDefinitions:token
 * type : apiKey
 * description: 
 */
module.exports = function authorize(req, res, next) {
    //The context('this') for authorize will be bound to the 'securityDefinition'
    //this.name - The name of the header or query parameter to be used for securityDefinitions:token apiKey security scheme.
    //this.in - The location of the API key ("query" or "header") for securityDefinitions:token apiKey security scheme.
    validate(req, function (error, availablescopes) {
        var auth = req.header(this.name);

        if (auth) {
            console.log(auth);
            next();
        }

    });
};
