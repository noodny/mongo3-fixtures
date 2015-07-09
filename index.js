var MongoClient = require('mongodb').MongoClient,
    async = require('async'),
    colors = require('colors');

module.exports = function(url, fixtures) {
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('\t failure'.red);
            console.log(err);
            db.close();
        } else {
            console.log('\t success'.green);

            console.log('database drop:');
            db.dropDatabase(function(err) {
                if(err) {
                    console.log('\t failure'.red);
                    console.log(err);
                } else {
                    console.log('\t success'.green);
                    async.forEachOfSeries(fixtures, function(documents, collectionName, callback) {
                        var collection = db.collection(collectionName);

                        if(documents.length) {
                            console.log('populate collection ' + collectionName + ':');
                            collection.insert(documents, function(err, result) {
                                if(err) {
                                    console.log('\t failure'.red);
                                    console.log(err);
                                } else {
                                    console.log('\t success'.green + ' (' + documents.length + ' documents)');
                                }
                                callback(err);
                            });
                        }
                    }, function(err) {
                        if(err) {
                            console.log('Database population failed:\n'.red);
                            console.log(err);
                        } else {
                            console.log('Database population finished'.green);
                        }
                        db.close();
                    });
                }
            });
        }
    });
};
