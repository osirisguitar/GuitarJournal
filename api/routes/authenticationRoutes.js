'use strict';

var authenticationService = require('../services/authenticationService');

module.exports = {
  login: function(req, res) {
    res.cookie('userid', req.user._id, { maxAge: 2592000000 });
    res.json(req.user);
  },

  loggedIn: function(req, res) {
    if (req.isAuthenticated()) {
      console.log('loggedIn', Date.Now());
      req.user._csrf = req.csrfToken();
      res.json(req.user);   
    } else {
      if (req.cookies.hasloggedinwithfb) {
        res.json({ _csrf: req.csrfToken(), autoTryFacebook: true });    
      }
      else {
        res.json({ _csrf: req.csrfToken(), autoTryFacebook: false });   
      }
    }
  },

  logout: function(req, res) {
    res.clearCookie('userid');
    res.clearCookie('hasloggedinwithfb');
    req.logout();
    res.redirect('/');
  },

  allowSimpleLogin: function(req, res) {
    if (process.env.ALLOWSIMPLELOGIN)
      res.send(true);
    else
      res.send(false);
  },

  signup: function(req, res) {
    authenticationService.checkIfUserExists(req.body.email, function(err, user) {
      if (err) {
        console.error(err);
      }

      if (user) {
        res.send(500, { message: 'User already exists' });
      } else {
        authenticationService.createUser(req.body, function(err, user) {
          res.json(user);
        });
      }
    });
  },

  setPassword: function(req, res) {
    authenticationService.setPassword(req.user._id, req.body.password, function(err) {
      if (err) {
        res.send(500, { message: err.message });
      } else {
        res.json({ message: 'Password changed' });
      }
    });
  },

  sendPasswordReminder: function(req, res) {
    authenticationService.sendPasswordReminder(req.body.email, function(err) {
      if (err) {
        res.send(500, { message: err.message });
      } else {
        res.json({ message: 'Reminder sent' });
      }
    });
  }
};