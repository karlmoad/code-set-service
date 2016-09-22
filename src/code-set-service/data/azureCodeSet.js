'use strict'
const azure = require("azure-storage");
const formatter = require("./model.js");
const util = require("util");
const host = process.env.AZURE_STORAGE_HOST;
const sas = process.env.AZURE_STORAGE_SAS;
const table = process.env.AZURE_STORAGE_TABLE;
var tableSvc = azure.createTableServiceWithSas(host,sas);
//
// Begin module exported code 
module.exports = {

    executeBatchRequest: function(batches, callback){
        function executeBatch(batch){
            try {
                tableSvc.executeBatch(table, batch, function (err, result, response) {
                    if (!err) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            }
            catch(error){
                console.log(error);
                return false;
            }
        }

        var complete = batches.every(executeBatch);

        if(complete){
            callback(null, "Success");
        }
        else{
            callback("Failure", null);
        }
    },

    getCodes: function(setid, codeid, callback){

        var data = [];    
        var query = new azure.TableQuery()

        if(setid)
        {
            if(codeid){
                query.where("PartitionKey eq ? and RowKey eq ?", setid, codeid);        
            }   
            else{
                query.where("PartitionKey eq ?", setid);
            }     
        }

        function executeQuery(query,token,data, callback){
            try {
                tableSvc.queryEntities(table, query, token, function (error, results) {
                    if (!error) {
                        data.push.apply(data, results.entries);
                        if (results.continuationToken) {
                            executeQuery(query, results.continuationToken, data, callback);
                        }
                        else {
                            formatter.fromAzureResults(data, callback);
                        }
                    } else {
                        callback("ERROR executing request query");
                    }
                });
            }
            catch(error){
                console.log(error);
                callback("Internal Service Error", null);
            }
        }
        executeQuery(query, null, data, callback);
    }
};