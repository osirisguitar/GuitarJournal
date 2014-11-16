'use strict';

var mongoDB = require('./mongodbService');
var ObjectID = require('mongodb').ObjectID;
var moment = require('moment');

module.exports = {
  // Returns 10 sessions of a user, starting from skipCount. Callback must accept
  // two parameters: err, data
  getSessions: function(userId, skipCount, callback) {
    mongoDB.collection('Sessions').find({ "userId": userId }).sort({ date: -1 }).skip(skipCount).limit(10).toArray(callback);
  },

  getSession: function(userId, sessionId, callback) {
    mongoDB.collection('Sessions').findOne({ _id: new ObjectID(sessionId), userId: userId }, callback);
  },

  saveSession: function(userId, session, callback) {
    session.userId = userId;

    if (session._id) {
      session._id = new ObjectID(session._id);
    }
    if (session.goalId) {
      session.goalId = new ObjectID(session.goalId);    
    }
    if (session.instrumentId) {
      session.instrumentId = new ObjectID(session.instrumentId);
    }
    if (session.date) {
      session.date = new Date(session.date);
    }
    if (session.startTime && session.endTime) {
      var start = moment(session.startDate);
      start.hour(session.startTime.split(":")[0]);
      start.minute(session.startTime.split(":")[1]);
      var end = moment(session.startDate);
      end.hour(session.endTime.split(":")[0]);
      end.minute(session.endTime.split(":")[1]);

      session.length = Math.round(moment.duration(end - start) / 60000);
    }

    mongoDB.collection('Sessions').save(session, {safe:true}, callback);
  },

  deleteSession: function(userId, sessionId, callback) {
    mongoDB.collection('Sessions').remove({ _id: new ObjectID(sessionId), userId: userId }, 1, callback);
  }
};