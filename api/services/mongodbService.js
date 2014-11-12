'use strict';
/*jshint node:true */

var mongoClient = require('mongodb').MongoClient;

var mongoDBConnection = null;

module.exports = {
  init: function(connectionString, connectedCallback) {
    mongoDBConnection = mongoClient.createConnection(function(err, connection) {
      if (err) {
        console.log("Could not connect to MongoDB", err);
      } else {
        mongoDBConnection = connection;
      }

      connectedCallback(err, connection);
    });
  },

  collection: function(collectionName) {
    return mongoDBConnection.collection(collectionName);
  }
};