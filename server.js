var express = require('express');
var http = require('http');
var mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/habweb');
mongoose.connection.on('open', function() {
	console.log('Connected to Mongoose');
});

// Create the webserver
app = express();

app.configure(function() {
	app.use(express.logger('default'));
	app.use(express.static(__dirname + '/public'));
});

http.createServer(app).listen(8000);