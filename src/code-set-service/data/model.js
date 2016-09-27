'use strict'
const azure = require('azure-storage');
const ignore = ['partitionkey', 'rowkey', 'timestamp', '.metadata'];
module.exports = {
    fromAzureResults: function(results, callback){
        var sets = {};

        //iterate records and generate set structures 
        results.forEach(function(record){
            //det if a set already exists if not establish a new inst
            if(!sets[record.PartitionKey._]){
                sets[record.PartitionKey._] = [];
            }

            var ts = record.Timestamp._;
            var vals = [];


            for(var val in record){
                if(record.hasOwnProperty(val)){
                    if(ignore.indexOf(val.toLowerCase()) < 0){
                        var tmp = { id: val, value: record[val]._, timestamp: ts};
                        vals.push(tmp);
                    }
                }
            }

            var code = {id: record.RowKey._, values: vals};

            sets[record.PartitionKey._].push(code);
        });

        var codes = {sets:[]};
        //now iterate the sets object and serialize to app format per the swagger spec
        for( var set in sets){
            if(sets.hasOwnProperty(set)){
                var tset = {id: set, codes: sets[set]};
                codes.sets.push(tset);
            }
        }
        callback(null,codes);
    },

    toAzureUpdateBatch: function(data, callback){

        var batches = [];

        function iterateSet(set){
            if (set.codes) {
                var batch = new azure.TableBatch();
                set.codes.forEach(function (code) {

                    var task = {
                        PartitionKey: {"_": set.id},
                        RowKey: {"_": code.id}
                    };

                    /* fix handle if values is empty array or null altogether */

                    if(code.values) {
                        code.values.forEach(function (value) {
                            task[value.id] = {'_': value.value};
                        });
                    }

                    batch.insertOrReplaceEntity(task);
                });
                batches.push(batch);
                return true;
            }
            else {
                return false;
            }
        }

        if(data.sets){

            var success = data.sets.every(iterateSet);
            if(success){
                callback(null, batches);
            }
            else{
                callback("Failure", null);
            }
        }
        else{
            callback("Malformed Object");
        }
    },

    toAzureRemovalBatch: function(data, callback){
        var batches = [];

        function iterateSet(set){
            if (set.codes) {
                var batch = new azure.TableBatch();
                set.codes.forEach(function (code) {

                    var task = {
                        PartitionKey: {"_": set.id},
                        RowKey: {"_": code.id},
                    };
                    batch.deleteEntity(task);
                });
                batches.push(batch);
                return true;
            }
            else {
                return false;
            }
        }

        if(data.sets){

            var success = data.sets.every(iterateSet);
            if(success){
                callback(null, batches);
            }
            else{
                callback("Failure", null);
            }
        }
        else{
            callback("Malformed Object");
        }
    }
};