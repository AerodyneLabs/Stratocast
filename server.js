var PORT = 8000;

var cluster = require('cluster');

//var ds = require('./lib/data-store');

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
  // Include libraries
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
  app.listen(PORT);

  // Connect to MongoDB
  mongoose.connect('mongodb://127.0.0.1/windData');

  console.log('Worker ' + cluster.worker.process.pid + ' running.');
}