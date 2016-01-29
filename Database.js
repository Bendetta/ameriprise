'use strict';

var Q = require('q');
var MongoClient = require('mongodb').MongoClient;
var config = require('./config');

var Database = {
    
};

Database.TrophyTable = "Trophies";

Database.connect = function() {
    var deferred = Q.defer();
    MongoClient.connect(config.DB_URI, function(err, db) {
       if (err) {
           deferred.reject(err);
           return;
       }       
       console.log('connected to database');
       deferred.resolve(db);
    });
    
    return deferred.promise; 
};

Database.getTrophies = function() {
    var deferred = Q.defer();
    
    Database.connect()
    .then(function(db) {
        var collection = db.collection(Database.TrophyTable);
        collection.find().limit(1).next(function(err, doc) { 
            if (err) {
                deferred.reject(err);
            }           
            deferred.resolve(doc);
            db.close(); 
        });
    });
    
    return deferred.promise;
};

Database.saveTrophies = function(trophies) {
    var deferred = Q.defer();
  
    Database.connect()
    .then(function(db) {
        var collection = db.collection(Database.TrophyTable);
        
        collection.updateOne({_id: trophies._id}, trophies, {}, function(err, result) {
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve();
            db.close();
        });
    });
    
    return deferred.promise;  
};

module.exports = Database;