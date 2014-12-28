'use strict';

var goalService = require('../services/goalService');
var ObjectID = require('mongodb').ObjectID;

module.exports = {
  getGoals: function(req, res) {
    goalService.getGoals(req.user._id, function(err, goals) {
      if (err) {
        console.error('Error when getting goals', err);
        res.send(500, 'An error occured when getting goals');
      } else {
        res.json(goals);
      }
    });
  },

  saveGoal: function(req, res) {
    if (req.body._id) {
      req.body._id = new ObjectID(req.body._id);
    }
    req.body.userId = req.user._id;

    goalService.saveGoal(req.user._id, req.body, function(err, savedGoal) {
      if (err) {
        console.error('Error when saving goal', err);
        res.send(500, 'Error when saving goal');
      } else {
        res.json(savedGoal);
      }
    });
  },

  deleteGoal: function(req, res) {
    var goalId = new ObjectID(req.params.id);
    goalService.deleteGoal(req.user._id, goalId, function(err, result) {
      if (err) {
        console.error('Error when deleting goal', err);
        res.send(500, 'Error when deleting goal');
      } else {
        res.json(result);
      }
    });
  }
};