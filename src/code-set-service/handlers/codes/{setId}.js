'use strict';
var dataProvider = require('../../data/azureCodeSet.js');
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
        dataProvider.getCodes(req.params.setId, null, function (err, data) {
            if (err) {
                res.status(400).send("Failure");
            }
            else {
                res.status(200).send(data);
            }
        });
    },

    delete: function deleteCodeSet(req, res, next) {
        dataProvider.executeSetDelete(req.params.setId, null, function(err, data){
            if(err){
                console.log(err);
                res.status(400).send("Failure");
            }
            else{
                res.status(200).send("Success");
            }
        });
    }
};
