var mongoose = require('mongoose');

var Sounding = new mongoose.Schema({
  timestamp: {
    type: Date,
    index: true
  },
  location: {
    type: {
      type: [Number],
      index: '2d'
    }
  },
  analysis: {
    type: Date
  },
  duration: {
    type: Number
  },
  data: [{
    altitude: Number,
    pressure: Number,
    temperature: Number,
    dewPoint: Number,
    windU: Number,
    windV: Number
  }]
});

Sounding.set('autoIndex', false);

module.exports = mongoose.model('Sounding', Sounding);