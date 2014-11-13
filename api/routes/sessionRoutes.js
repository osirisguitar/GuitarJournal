'use strict';

var sessionService = require('../services/sessionService');

module.exports = {
  getSessions: function(req, res, next) {
    var skip = req.params.skip ? parseInt(req.params.skip, 10) : 0;

    sessionService.getSessions(req.user._id, skip, function(err, items) {
      if (err) {
        console.error("Error when getting sessions", err);
        res.send(500, "An error occured when getting sessions");
      } else {
        res.json(items);
      }
    });
  }
}
