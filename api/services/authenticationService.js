'use strict';

var mongoDB = require('./mongodbService');
var cryptoHelper = require('../cryptoHelper');
var emailjs = require('emailjs');

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
  },

  setPassword: function(userId, password, callback) {
    mongoDB.collection('Users').findOne({ _id: userId }, function(err, user) {
      if (err || !user) {
        return callback(new Error('User not found'));
      } else {
        user.password = cryptoHelper.createPasswordHash(password);
        mongoDB.collection('Users').save(user, { safe: true }, function(err) {
            if (err) {
              console.error('Problem when setting password', err);
              return callback(new Error('Error when setting password: ' + err.message));
            } else {
              callback(null);
            }          
        });
      }
    });
  },

  sendPasswordReminder: function(email, callback) {
    mongoDB.collection('Users').findOne({ email: email }, function(err, user) {
      if (err || !user) {
        return callback(new Error('No such user'));
      } else {
        var password = cryptoHelper.createRandomPassword(10); 
        user.password = cryptoHelper.createPasswordHash(password);
        mongoDB.collection('Users').save(user, { safe: true }, function(err) {
          var emailServer = emailjs.server.connect({
            host: process.env.SMTP_HOST,
            user: process.env.SMTP_USER,
            port: process.env.SMTP_PORT,
            password: process.env.SMTP_PASSWORD
          });

          emailServer.send({
            from: 'OSIRIS GUITAR Journal <journal@osirisguitar.com>',
            subject: 'Password reset',
            to: user.email,
            text: 'A new password has been generated for your account on the OSIRIS GUITAR Journal.\n\nThe new password is ' + password
          }, function(err, message) {
            if (err) {
              console.error('Problem when sending email', err, message);
              return callback(new Error('Error when sending email: ' + message));
            } else {
              callback(null);
            }
          });
        });
      }
    });
  }
};