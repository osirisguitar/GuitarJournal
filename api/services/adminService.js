'use strict';

var mongoDB = require('./mongodbService');

module.exports = {
  getUsers: function(callback) {
    mongoDB.collection('Users').find().toArray(callback);
  },

  getUserObjects: function(userId, callback) {
    var returnData = {};

    mongoDB.collection('Users').findOne({ _id: userId }, function(err, user) {
      if (err)
        return console.error(err);
      returnData.user = user;
      mongoDB.collection('Sessions').find({ userId: userId }).toArray(function(err, sessions) {
        if (err)
          return console.error(err);
        returnData.sessions = sessions;

        mongoDB.collection('Instruments').find({ userId: userId }).toArray(function(err, instruments) {
          if (err)
            return console.error(err);
          returnData.instruments = instruments;

          mongoDB.collection('Goals').find({ userId: userId }).toArray(function(err, goals) {
            returnData.goals = goals;

            callback(null, returnData);
          });
        });
      });
    });
  }
};