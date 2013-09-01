var request = require('request');

var BASE_URL = 'http://open.mapquestapi.com/elevation/v1/profile';

function ElevationService(apiKey) {
	this.apiKey = apiKey || process.env.MAPQUEST_API_KEY;
}

ElevationService.prototype.elevation = function(points, callback) {
	var json = {
		latLngCollection: points
	};
	var reqUrl = BASE_URL + '?key=' + this.apiKey + '&json=' + JSON.stringify(json);
	request(reqUrl, function(err, res, body) {
		if (err) {
			callback(err);
		} else if (res.statusCode !== 200) {
			callback(body);
		} else {
			callback(null, body);
		}
	});
};

module.exports = exports = ElevationService;