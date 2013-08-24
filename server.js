global.PORT = 8000;

var cluster = require('cluster');

//var ds = require('./lib/data-store');

// Create the cluster
if (cluster.isMaster) { // Master process
  require('./master.js');
} else { // Worker process
  require('./worker.js');
}