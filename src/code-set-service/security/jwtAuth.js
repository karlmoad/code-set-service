/**
 * Created by moadkj on 9/14/16.
 */
'use strict'
const jwt = require('jsonwebtoken');

/**
 * old authorization logic, swaggerize-routes issue resolved logic moved to appropriate security handler per path
 */

module.exports = {
    authorize: function(req, callback)
    {
        callback(null);
    }
};