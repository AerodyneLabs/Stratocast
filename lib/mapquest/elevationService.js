var request = require('request');

var BASE_URL = 'http://open.mapquestapi.com/elevation/v1/profile';

function ElevationService(points, callback) {
	var apiKey = process.env.MAPQUEST_API_KEY;
	var json = {
		latLngCollection: points
	};
	var reqUrl = BASE_URL + '?key=' + apiKey + '&json=' + JSON.stringify(json);
	request(reqUrl, function(err, res, body) {
		if (err) {
			callback(err);
		} else if (res.statusCode !== 200) {
			callback(body);
		} else {
			results = JSON.parse(body);
			callback(null, results.elevationProfile);
		}
	});
}

module.exports = exports = ElevationService;