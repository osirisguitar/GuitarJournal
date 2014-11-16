'use strict';

var mongoDB = require('./mongodbService');
var ObjectID = require('mongodb').ObjectID;

module.exports = {
  getOverview: function(userId, numDays, callback) {
    var results = {};
    var match = { userId: userId };
    if (numDays) {
      var daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - numDays);
      match.date = { $gte: daysAgo };
    }
    var sessions = mongoDB.collection('Sessions');

    sessions.find(match).count(function(error, count) {
      results.totalSessions = count;
      sessions.aggregate(
        [
          {
            $match: match
          },
          {
            $group: {
              _id: "$userId",
              averageLength: { $avg: "$length" },
              totalLength: { $sum: "$length" },
              averageRating: { $avg: "$rating" },
              firstSession: { $min: "$date" },
              latestSession: { $max: "$date" }
            }
          }
        ], 
        function(err, agg) {
          if (err) {
            console.log(err);
            return callback(err, null);
          }
          if (agg && agg.length > 0) {
            results.averageLength = Math.round(agg[0].averageLength);
            results.totalLength = agg[0].totalLength;
            results.averageRating = Math.round(agg[0].averageRating*100)/100;
            results.firstSession = agg[0].firstSession;
            results.latestSession = agg[0].latestSession;             
          }
          sessions.aggregate(
          [
            {
              $match: match
            },
            {
              $group: 
              {
                _id: '$instrumentId', 
                numUses: { $sum: 1 }
              }
            },
            {
              $sort: { numUses: -1 }
            }
          ],
          function (err, agg) {
            if (err) {
              console.log(err);
              return callback(err, null);
            } 

            if (agg && agg.length > 0) {
             results.mostUsedInstrument = agg[0]._id;
            }

            callback(err, results);
          });
        });
      });
  }
};