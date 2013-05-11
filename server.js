var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var kue = require('kue');

var ds = require('./lib/data-store');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/habweb');
mongoose.connection.on('open', function() {
	console.log('Connected to Mongoose');
});

// Create the job queue
var jobs = kue.createQueue();
kue.app.listen(8000);

// Create the webserver
app = express();

app.configure(function() {
	app.use(express.logger('dev'));
	app.use(express.static(__dirname + '/public'));
});

http.createServer(app).listen(80);
console.log('Listening on port 80');

ds.init();