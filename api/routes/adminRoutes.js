'use strict';

var adminService = require('../services/adminService');
var ObjectID = require('mongodb').ObjectID;

module.exports = {
  getUsers: function(req, res) {
    var loggedInUser = req.user._id;

    if (loggedInUser !== '512684441ea176ca050002b7') {
      res.status(401).send('You are not authorized to use this resource');
      return;
    }
    else {
      adminService.getUsers(function(err, users) {
        if (err) {
          console.error('Error when getting users', err);
          res.send(500, 'An error occured when getting users');
        } else {
          res.json(users);
        }
      });
    }
  },

  getUserObjects: function(req, res) {
    var loggedInUser = req.user._id;

    if (loggedInUser !== '512684441ea176ca050002b7') {
      res.status(401).send('You are not authorized to use this resource');
      return;
    }
    else {
      var userId = new ObjectID(req.params.id);
      adminService.getUserObjects(userId, function(err, userObjects) {
        if (err) {
          console.error('Error when getting user objects', err);
          res.send(500, 'An error occured when getting user objects');
        } else {
          res.json(userObjects);
        }
      });
    }
  }
};