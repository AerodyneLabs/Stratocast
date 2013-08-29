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

// Bind to a port
app.listen(global.PORT);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/windData');

console.log('Worker ' + cluster.worker.process.pid + ' running.');