var express = require('express');

var app = express();

app.use(express.logger('dev'));
app.use(express.static(__dirname + '/app'));

app.listen(8000);