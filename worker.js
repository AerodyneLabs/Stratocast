// Include libraries
var cluster = require('cluster');
var express = require('express');
var mongoose = require('mongoose');

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