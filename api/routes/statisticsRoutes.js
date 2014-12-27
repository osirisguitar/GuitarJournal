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
  }  
};