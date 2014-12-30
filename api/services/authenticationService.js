'use strict';

var mongoDB = require('./mongodbService');
var cryptoHelper = require('../cryptoHelper');

module.exports = {
  // Checks username and password against database, and calls
  // callback with either error or user set.
  checkLogin: function (username, password, callback) {
    var passwordHash = cryptoHelper.createPasswordHash(password);

    var users = mongoDB.collection('Users');
    users.findOne({ email: username, password: passwordHash }, callback);
  },

  checkIfUserExists: function(username, callback) {
    var users = mongoDB.collection('Users');
    users.findOne({ email: username }, callback);
  },

  createUser: function(user, callback) {
    user.password = cryptoHelper.createPasswordHash(user.password);

    var users = mongoDB.collection('Users');
    users.save(user, { safe:true }, callback);
  }
};