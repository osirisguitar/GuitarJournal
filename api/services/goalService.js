'use strict';

var mongoDB = require('./mongodbService');

module.exports = {
  getGoals: function(userId, callback) {
    var collection = mongoDB.collection('Goals');
    collection.find({ 'userId': userId }).sort({ completionDate: 1, title: 1 }).toArray(callback);    
  },

  saveGoal: function(userId, goal, callback) {
    var collection = mongoDB.collection('Goals');
    collection.save(goal, {safe:true}, callback);
  },

  deleteGoal: function(userId, goalId, callback) {
    var goals = mongoDB.collection('Goals');
    goals.remove({ _id: goalId, userId: userId }, 1, callback);
  }
};