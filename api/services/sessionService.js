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
    mongoDB.collection('Sessions').find({ "userId": userId }).sort({ date: -1 }).skip(skipCount).limit(10).toArray(callback);
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