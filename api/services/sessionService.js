'use strict';
/*jshint node:true */

var mongoDB = require('./mongodbService');

module.exports = {
  // Returns 10 sessions of a user, starting from skipCount. Callback must accept
  // two parameters: err, data
  getSessions: function(userId, skipCount, callback) {
      var collection = mongoDB.collection('Sessions');
      collection.find({ "userId": userId }).sort({ date: -1 }).skip(skipCount).limit(10).toArray(function(err, items) {
        callback(err, items);
      });
  }
};