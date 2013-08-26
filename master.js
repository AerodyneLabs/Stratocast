// Include libraries
var cluster = require('cluster');
var ds = require('./lib/data-store');

// Count the number of cpus
var numCPUs = require('os').cpus().length;

// Initialize data store
ds.init();

// Create a worker for each cpu
for (var i = 0; i < numCPUs; i++) {
  cluster.fork();
}

cluster.on('exit', function(worker, code, signal) {
  console.log('Worker ' + worker.process.pid + ' terminated with signal ' + signal);
  cluster.fork();
});

console.log('Application started on port ' + global.PORT);