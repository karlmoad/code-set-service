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

    executeSetDelete: function(setid, callback){

        var batches = null;
        this.getCodes(setid, null, function (err, data) {
                if (err) {
                    callback(err);
                }
                else {
                    formatter.toAzureRemovalBatch(data, function (error, formatted) {
                        if (error) {
                            callback(error);
                        }
                        else {
                            batches = formatted;
                        }
                    });
                }
        });

        if(batches){
            this.executeBatchRequest(batches, callback);
        }
        else{
            callback("Failure");
        }
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