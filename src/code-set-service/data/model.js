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
        var batch = new azure.TableBatch();
        if(data.sets){
            for(var set in data.sets){
                if(data.sets[set].codes){
                    if(data.sets.hasOwnProperty(set)){

                        var SET = data.sets[set];

                        for(var code in data.sets[set].codes){
                            if(data.sets[set].codes.hasOwnProperty(code)){

                                var CODE = data.sets[set].codes[code];
                                var VALS = [];

                                var task = {
                                    PartitionKey: {"_": SET.id},
                                    RowKey: {"_": CODE.id}
                                };

                                CODE.values.forEach(function(value){
                                    task[value.id] = value.value;
                                });

                                batch.insertOrReplaceEntity(task);
                            }
                        }
                    }
                }
                else{
                    callback("Malformed object");
                }
            }

            callback(null, batch);

        }else{
            callback("Malformed object");
        }
    },

    toAzureRemovalBatch: function(data, callback){
        var batch = new azure.TableBatch();
        if(data.sets){
            data.sets.forEach(function(set){
                if(set.codes){
                    set.codes.forEach(function(code){

                        var task = {
                            PartitionKey:{"_": set.id},
                            RowKey:{"_":code.id},
                        };
                        batch.deleteEntity(task);
                    });

                    callback(null, batch);
                }
                else{
                    callback("Malformed object");
                }
            });
        }else{
            callback("Malformed object");
        }
    }
};