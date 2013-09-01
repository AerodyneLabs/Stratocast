var request = require('request');

var BASE_URL = 'http://open.mapquestapi.com/directions/v1/route';

function DirectionsService() {
	var apiKey = process.env.MAPQUEST_API_KEY;
}

module.exports = exports = DirectionsService;