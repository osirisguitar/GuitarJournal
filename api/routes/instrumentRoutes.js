'use strict';

var instrumentService = require('../services/instrumentService');
var ObjectID = require('mongodb').ObjectID;

module.exports = {
  getInstruments: function(req, res) {
    instrumentService.getInstruments(req.user._id, function(err, instruments) {
      if (err) {
        console.error('Error when getting instruments', err);
        res.send(500, 'An error occured when getting instruments');
      } else {
        res.json(instruments);
      }
    });
  },

  saveInstrument: function(req, res) {
    if (req.body._id) {
      req.body._id = new ObjectID(req.body._id);
    }
    req.body.userId = req.user._id;

    instrumentService.saveInstrument(req.user._id, req.body, function(err, savedInstrument) {
      if (err) {
        console.error('Error when saving instrument', err);
        res.send(500, 'Error when saving instrument');
      } else {
        res.json(savedInstrument);
      }
    });
  },

  deleteInstrument: function(req, res) {
    var instrumentId = new ObjectID(req.params.id);
    instrumentService.deleteInstrument(req.user._id, instrumentId, function(err, result) {
      if (err) {
        console.error('Error when deleting instrument', err);
        res.send(500, 'Error when deleting instrument');
      } else {
        res.json(result);
      }
    });
  }
};