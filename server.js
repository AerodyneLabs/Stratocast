global.PORT = 8000;

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
  require('./worker.js');
}