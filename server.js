var cluster = require('cluster');
var mongoose = require('mongoose');

//var ds = require('./lib/data-store');

var numCPUs = require('os').cpus().length;

// Connect to MongoDB
//mongoose.connect('mongodb://127.0.0.1/habweb');
//mongoose.connection.on('open', function() {
//  console.log('Connected to Mongoose');
//});

// Create the cluster
if(cluster.isMaster) { // Master process
  //ds.init();
  for(var i=0; i < numCPUs; i++) {
    cluster.fork();
  }
} else { // Worker process
  // Include express
  var express = require('express');

  // Create an express application
  app = express();

  // Configure express
  app.configure(function() {
    app.use(express.static(__dirname + '/app'));
  });

  // Bind to a port
  app.listen(8000);
}