var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var kue = require('kue');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/habweb');
mongoose.connection.on('open', function() {
	console.log('Connected to Mongoose');
});

// Create the job queue
var jobs = kue.createQueue();

// Create the webserver
app = express();

app.configure(function() {
	app.use(express.logger('dev'));
	app.use(express.static(__dirname + '/public'));
	app.use(express.basicAuth(function(user, pass, callback) {
		var result = (user === 'admin' && pass === 'password');
		console.log(result);
		callback(null, result);
}));
	app.use('/queue', kue.app);
});

http.createServer(app).listen(80);
console.log('Listening on port 80');