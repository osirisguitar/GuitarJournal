'use strict';

var sessionService = require('../services/sessionService');

module.exports = {
  getSessions: function(req, res, next) {
    var skip = req.params.skip ? parseInt(req.params.skip, 10) : 0;

    sessionService.getSessions(req.user._id, skip, function(err, sessions) {
      if (err) {
        console.error("Error when getting sessions", err);
        res.send(500, "An error occured when getting sessions");
      } else {
        res.json(sessions);
      }
    });
  },

  getSession: function(req, res) {
    sessionService.getSession(req.user._id, req.params.id, function(err, session) {
      if (err) {
        console.error("Error when getting session", err);
        res.send(500, "An error occured when getting session");
      } else {
        res.json(session);
      }
    });
  },

  saveSession: function(req, res) {
    sessionService.saveSession(req.user._id, req.body, function(err, savedSession) {
      if (err) {
        console.error("Error when saving session", err);
        res.send(500, "Error when saving session");
      } else {
        res.json(savedSession);
      }
    });
  },

  deleteSession: function(req, res) {
    sessionService.deleteSession(req.user._id, req.params.id, function(err, result) {
      if (err) {
        console.error("Error when deleting session", err);
        res.send(500, "Error when deleting session");
      } else {
        res.json(result);
      }
    });
  }
};
