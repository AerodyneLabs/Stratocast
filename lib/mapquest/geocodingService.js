var request = require('request');

var BASE_URL = 'http://open.mapquestapi.com/geocoding/v1/address';

function GeocodingService(apiKey) {
	this.apiKey = apiKey || process.env.MAPQUEST_API_KEY;
}

GeocodingService.prototype.geocode = function() {};

GeocodingService.prototype.reverseGeocode = function() {};

module.exports = exports = GeocodingService;