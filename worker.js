// Include libraries
var async = require('async');
var cluster = require('cluster');
var express = require('express');
var mongoose = require('mongoose');
var ds = require('./lib/data-store');

var currentDownload = null;
setInterval(function() {
  if(currentDownload === null) {
    ds.popQueue(updateSounding);
  }
}, 10000);

updateSounding = function(error, key) {
  if(error !== null || key === null) return;
  currentDownload = key;
  async.waterfall([
    function download(callback) {
      ds.downloadSounding(key, callback);
    },
    function preprocess(filename, callback) {
      ds.preprocessSounding(filename, callback);
    }
  ], function(err, result) {
    if(err) {
      ds.requeue(key);
      console.log('Error updating ' + key + ' : ' + err);
    } else {
      console.log('Updated ' + key);
    }
    // Accept a new key now
    currentDownload = null;
  });
};

// Create an express application
app = express();

// Configure express
app.configure(function() {
  // Simple logger
  // TODO Replace logger
  app.use(function(req, res, next) {
    console.log('%s: %s %s', cluster.worker.process.pid, req.method, req.url);
    next();
  });

  // Static file server
  // TODO Replace express.static with nginx
  app.use(express.static(__dirname + '/app'));
});

app.get('/api/sounding', function(req, res) {
  var timestring = req.param('time');
  var location = req.param('loc');
  if(!timestring || !location) {
    res.send(400, 'Bad Request!');
    return;
  }

  location = location.split(',');
  var lat = parseInt(location[0], 10);
  var lng = parseInt(location[1], 10);
  var timestamp = parseInt(timestring, 10);
  if(isNaN(lat) || isNaN(lng) || isNaN(timestamp)) {
    res.send(400, 'Bad Request!');
    return;
  }
  
  var time = new Date(timestamp);
  if(lng < 0) {
    lng += 360;
  }

  ds.getSounding(time, lat, lng, function(err, sounding) {
    if(err) {
      res.send(500, err);
    } else {
      res.send(200, JSON.stringify(sounding));
    }
  });
});

// Bind to a port
app.listen(global.PORT);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/windData');

console.log('Worker ' + cluster.worker.process.pid + ' running.');