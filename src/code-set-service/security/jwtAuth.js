/**
 * Created by moadkj on 9/14/16.
 */
'use strict'
const jwt = require('jsonwebtoken');

/**
 *  Temp jwt auth function to be directly consumed by handlers while
 *  https://github.com/krakenjs/swaggerize-express/issues/107 is resolved
 */

module.exports = {

    authorize: function(req, callback)
    {
        var auth = req.headers['auth'];
        var key = process.env.JWT_KEY;

        if (auth) {
            jwt.verify(auth, key, {algorithm: 'HS512'}, function (err, decoded) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, decoded);
                }
            });
        }
    }
};