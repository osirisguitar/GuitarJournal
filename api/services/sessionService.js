'use strict';

var mongoDB = require('./mongodbService');
var ObjectID = require('mongodb').ObjectID;
var moment = require('moment');

module.exports = {
  /**
   * Gets (a maximum of) 10 sessions for a user.
   *
   * @param userId - ObjectID of a user
   * @param skipCount - how many sessions to skip
   * @param callback - called with (error, sessions)
   */
  getSessions: function(userId, skipCount, callback) {
    mongoDB.collection('Sessions').find({ "userId": userId }).sort({ date: -1 }).skip(skipCount).limit(20).toArray(function (err, sessions) {
      var instrumentIds = {};
      var goalIds = {};

      sessions.forEach(function (session) {
        instrumentIds[session.instrumentId] = session.instrumentId;
        goalIds[session.goalId] = session.goalId;
      });

      instrumentIds = Object.keys(instrumentIds).map(function (instrumentId) { return new ObjectID(instrumentId); });
      goalIds = Object.keys(goalIds).map(function (goalId) { return new ObjectID(goalId); });

      mongoDB.collection('Instruments').find({ _id: { $in: instrumentIds } }).toArray(function (err, instruments) {
          var instrumentMap = {};

          instruments.forEach(function (instrument) {
            instrumentMap[instrument._id] = instrument;
          });

          mongoDB.collection('Goals').find({ _id: { $in: goalIds } }).toArray(function (err, goals) {
            var goalMap = {};

            goals.forEach(function (goal) {
              goalMap[goal._id] = goal;
            });

            sessions.forEach(function (session) {
              if (session.instrumentId) {
                session.instrument = instrumentMap[session.instrumentId];
              }

              if (session.goalId) {
                session.goal = goalMap[session.goalId];
              }
            });

            callback(null, sessions);
          });
      });
    });
  },

  /**
   * Gets a session for a user
   *
   * @param userId - user id in ObjectID format
   * @param sessionId - session id in string format
   * @param callback - called with (error, session)
   */
  getSession: function(userId, sessionId, callback) {
    mongoDB.collection('Sessions').findOne({ _id: new ObjectID(sessionId), userId: userId }, callback);
  },

  /**
   * Saves a session for a user
   *
   * @param userId - user id in ObjectID format
   * @param session - session object
   * @param callback - called with (error, result)
   */
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

  /**
   * Deletes a session for a user
   *
   * @param userId - user id in ObjectID format
   * @param sessionId - session id in string format
   * @param callback - called with (error, result)
   */
  deleteSession: function(userId, sessionId, callback) {
    mongoDB.collection('Sessions').remove({ _id: new ObjectID(sessionId), userId: userId }, 1, callback);
  }
};