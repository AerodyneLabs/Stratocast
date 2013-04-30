var express = require('express');
var http = require('http');
var kue = require('kue');

// Create the webserver
app = express();

app.configure(function() {
	app.use(express.logger('default'));
	app.use(express.static(__dirname + '/public'));
});

http.createServer(app).listen(8000);

// Create the job queue
var jobs = kue.createQueue()
kue.app.set('title', 'HAB Web Job Queue');
kue.app.listen(3000);