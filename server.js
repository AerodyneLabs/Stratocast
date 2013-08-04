var PORT = 8000;

var cluster = require('cluster');
var mongoose = require('mongoose');

//var ds = require('./lib/data-store');

// Connect to MongoDB
//mongoose.connect('mongodb://127.0.0.1/habweb');
//mongoose.connection.on('open', function() {
//  console.log('Connected to Mongoose');
//});

// Create the cluster
if (cluster.isMaster) { // Master process
  //ds.init();

  // Count the number of cpus
  var numCPUs = require('os').cpus().length;

  // Create a worker for each cpu
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' terminated with signal ' + signal);
    cluster.fork();
  });

  console.log('Application started on port ' + PORT);
} else { // Worker process
  // Include express
  var express = require('express');

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
  app.listen(PORT);

  console.log('Worker ' + cluster.worker.process.pid + ' running.');
}