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
            var out = true;
            /**
             * Fall through logic array.every wil halt if callback function returns false
             * setting the output of the every call to false otherwise true see MDN Array.every() for more details
             */

            try {
                tableSvc.executeBatch(table, batch, function (err, result, response) {
                    if (err){
                        console.log(err);
                        out = false;
                    }
                });
            }
            catch(error){
                console.log(error);
                out = false;
            }
            finally {
                return out;
            }

        }

        var clear = batches.every(executeBatch);



        if(clear){
            callback(null, "Success");
        }else{
            callback("Failure", null);
        }
    },

    executeSetDelete: function(setid, callback){
        var self = this;
        self.getCodes(setid, null, function (err, data) {
            if (err) {
                callback(err);
            }
            else {
                formatter.toAzureRemovalBatch(data, function (error, batches) {
                    if (error) {
                        callback(error);
                    }
                    else {
                        self.executeBatchRequest(batches, callback);
                    }
                });
            }
        });
    },

    executeCodeDelete: function(setid, codeid, callback){

        var task = {
            PartitionKey: {'_':setid},
            RowKey: {'_':codeid}
        };

        tableSvc.deleteEntity(table, task, function(error, response){
            if(!error) {
                callback(null,"success");
            }else{
                callback(error);
            }
        });
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