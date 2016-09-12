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
     * summary: Remove and existing code(s)
     * description:
     * parameters: body
     * produces: application/json
     * responses: 200, 400
     */
    delete: function remCode(req, res, next) {


        model.toAzureRemovalBatch(req.body, function(err, batch){
            if(err){
                res.status(400).send("failure");
            }
            else{
                dataProvider.executeBatchRequest(batch,function(err, result){
                    if(err){
                        res.status(400).send("failure");
                    }
                    else{
                        res.status(200).send("success");
                    }
                });
            }
        });
    },
    /**
     * summary: Add/Update an existing code(s)
     * description:
     * parameters: body
     * produces: application/json
     * responses: 200, 404
     */
    put: function setCode(req, res, next) {

        model.toAzureUpdateBatch(req.body, function(err, batch){
            if(err){
                res.status(400).send("failure");
            }
            else{
                dataProvider.executeBatchRequest(batch,function(err, result){
                    if(err){
                        res.status(400).send("failure");
                    }
                    else{
                        res.status(200).send("success");
                    }
                });
            }
        });
    }
};