'use strict';

var practiceSessionService = require('../services/practiceSessionService');
var ObjectID = require('mongodb').ObjectID;

module.exports = {
  getPracticeSession: function(req, res) {
    var sessionId = new ObjectID(req.params.id);

    practiceSessionService.getPracticeSession(sessionId, function(err, practiceSessionHtml) {
      if (err) {
        console.error('Error when getting practice session', err);
        res.send(500, 'An error occured when getting practice session');
      } else {
        res.send(practiceSessionHtml);
      }
    });
  },

  getPracticeSessionImage: function(req, res) {
    var sessionId = new ObjectID(req.params.id);

    practiceSessionService.getPracticeSessionImage(sessionId, function(err, imageBuffer) {
      if (err) {
        console.error('Error when getting practice session image', err);
        res.send(500, 'An error occured when getting practice session image');
      } else {
        res.type('image/jpeg');
        res.send(imageBuffer);
      }      
    });
  }
};
