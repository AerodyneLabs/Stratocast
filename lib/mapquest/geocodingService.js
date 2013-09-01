var request = require('request');

var BASE_URL = 'http://open.mapquestapi.com/geocoding/v1/address';

function GeocodingService() {
	var apiKey = process.env.MAPQUEST_API_KEY;
}

module.exports = exports = GeocodingService;