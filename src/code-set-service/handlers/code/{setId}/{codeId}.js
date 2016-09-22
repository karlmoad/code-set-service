'use strict';
var dataProvider = require('../../../data/azureCodeSet.js');

/**
 * Operations on /code/{setId}/{codeId}
 */
module.exports = {
    /**
     * summary: Get a code value
     * description: 
     * parameters: setId, codeId
     * produces: application/json
     * responses: 200, 400, 404
     */
    get: function getCode(req, res, next) {

        dataProvider.getCodes(req.params.setId, req.params.codeId, function (err, data) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send(data);
            }
        });
    }
};
