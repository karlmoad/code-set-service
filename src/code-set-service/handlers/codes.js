'use strict';
var dataProvider = require('../data/azureCodeSet.js');
var model = require('../data/model.js');

/**
 * Operations on /codes
 */
module.exports = {
    /**
     * summary: retrieve all codes
     * description: 
     * parameters: 
     * produces: application/json
     * responses: 200, 400
     */
    get: function getCodes(req, res, next) {
        dataProvider.getCodes(null,null,function(err, data){
           if(err){
                res.status(400).send("failure");
           }
           else{
                res.status(200).send(data);
           }
        });
    },

    /**
     * summary: Add/Update an existing code(s)
     * description:
     * parameters: body
     * produces: application/json
     * responses: 200, 400
     */
    put: function setCode(req, res, next) {
        model.toAzureUpdateBatch(req.body, function (err, batches) {
            if (err) {
                res.status(400).send("failure");
            }
            else {
                dataProvider.executeBatchRequest(batches, function (err, result) {
                    if (err) {
                        res.status(400).send("failure");
                    }
                    else {
                        res.status(200).send("success");
                    }
                });
            }
        });
    }
};
