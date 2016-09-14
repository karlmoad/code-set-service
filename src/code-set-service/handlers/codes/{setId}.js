'use strict';
var dataProvider = require('../../data/azureCodeSet.js');
var auth = require('../../security/jwtAuth.js');
/**
 * Operations on /codes/{setId}
 */
module.exports = {
    /**
     * summary: retrieve an entire code set
     * description: 
     * parameters: setId
     * produces: application/json
     * responses: 200, 400, 404
     */
    get: function getCodeSet(req, res, next) {

        auth.authorize(req, function(err, decoded) {
            if (!err) {
                dataProvider.getCodes(req.params.setId, null, function (err, data) {
                    if (err) {
                        res.status(400).send(err);
                    }
                    else {
                        res.status(200).send(data);
                    }
                });
            }
        });
    }
};
