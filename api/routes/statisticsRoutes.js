'use strict';

var statisticsService = require('../services/statisticsService');

module.exports = {
  getOverview: function(req, res) {
    statisticsService.getOverview(req.user._id, req.params.days, function(err, statistics) {
      if (err) {
        console.error('Error when getting statistics overview', err);
        res.send(500, 'Error when getting statistics overview');
      } else {
        res.json(statistics);
      }
    });
  },

  getPerWeekday: function(req, res) {
    statisticsService.getPerWeekday(req.user._id, function(err, statistics) {
      if (err) {
        console.error('Error when getting statistics per weekday', err);
        res.send(500, 'Error when getting statistics per weekday');
      } else {
        res.json(statistics);
      }
    });
  },

  getPerWeek: function(req, res) {
    statisticsService.getPerWeek(req.user._id, req.params.weeks, function(err, statistics) {
      if (err) {
        console.error('Error when getting statistics per week', err);
        res.send(500, 'Error when getting statistics per week');
      } else {
        res.json(statistics);
      }
    });
  },

  getMinutesPerDay: function(req, res) {
    var date = new Date();
    date = new Date(date.setDate(date.getDate() - req.params.days)); // Is this REALLY the easiest way?

    statisticsService.getMinutesPerDay(req.user._id, date, function(err, statistics) {
      if (err) {
        console.error('Error when getting minutes per day', err);
        res.send(500, 'Error when getting minutes per day');
      } else {
        res.json(statistics);
      }
    });
  }

};