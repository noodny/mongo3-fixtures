var MongoClient = require('mongodb').MongoClient,
    async = require('async'),
    colors = require('colors');

module.exports = function(options, done) {
    var log;
    if(options.verbose) {
        log = console.log;
    } else {
        log = function() {
        };
    }

    MongoClient.connect(options.url, function(err, db) {
        if(err) {
            log('\t failure'.red);
            log(err);
            db.close();
        } else {
            log('\t success'.green);

            log('database drop:');
            db.dropDatabase(function(err) {
                if(err) {
                    log('\t failure'.red);
                    log(err);
                } else {
                    log('\t success'.green);
                    async.forEachOfSeries(options.fixtures, function(documents, collectionName, callback) {
                        var collection = db.collection(collectionName);

                        if(documents.length) {
                            log('populate collection ' + collectionName + ':');
                            collection.insert(documents, function(err, result) {
                                if(err) {
                                    log('\t failure'.red);
                                    log(err);
                                } else {
                                    log('\t success'.green + ' (' + documents.length + ' documents)');
                                }
                                callback(err);
                            });
                        }
                    }, function(err) {
                        if(err) {
                            log('Database population failed:\n'.red);
                            log(err);
                        } else {
                            log('Database population finished'.green);
                        }
                        db.close();
                        if(done) {
                            done();
                        }
                    });
                }
            });
        }
    });
};
