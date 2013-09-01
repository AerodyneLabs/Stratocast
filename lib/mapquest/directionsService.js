var request = require('request');

var BASE_URL = 'http://open.mapquestapi.com/directions/v1/route';

function DirectionsService(apiKey) {
	this.apiKey = apiKey || process.env.MAPQUEST_API_KEY;
}

DirectionsService.prototype.directions = function() {};

module.exports = exports = DirectionsService;