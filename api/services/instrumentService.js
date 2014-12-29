'use strict';

var mongoDB = require('./mongodbService');
var fs = require('fs');

module.exports = {
  getInstruments: function(userId, callback) {
    var instruments = mongoDB.collection('Instruments');
    instruments.find({ 'userId': userId }).toArray(callback);
  },

  saveInstrument: function(userId, instrument, callback) {
    // Local function that saves, needed since the image resize ends in a callback
    var save = function() {
      mongoDB.collection('Instruments')
        .save(instrument, { safe:true }, callback);
    };

    if (instrument.image) {
      var filename = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
      fs.writeFile('api/images/' + filename + '.jpg', instrument.image, 'base64', function(err) {
        if (err)
          return console.dir(err);
          instrument.image = null;
          instrument.imageFile = filename;
        save();
        });
    }
    else {
      save();
    }
  },

  deleteInstrument: function(userId, instrumentId, callback) {
    var instruments = mongoDB.collection('Instruments');
    instruments.remove({ _id: instrumentId, userId: userId }, 1, callback);
  }
};