var R = 6367600;

exports.directGeodesic = function(loc, dx, dy) {
	var lat1 = loc[1] * Math.PI / 180.0;
	var lon1 = loc[0] * Math.PI / 180.0;
	var d = Math.sqrt((dx * dx) + (dy * dy));
	var brng = Math.atan2(dx, dy);
	var lat2 = Math.asin(Math.sin(lat1) * Math.cos(d / R) + Math.cos(lat1) * Math.sin(d / R) * Math.cos(brng));
	var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(d / R) * Math.cos(lat1), Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2));
	return [lon2 * 180 / Math.PI, lat2 * 180 / Math.PI];
};

exports.indirectGeodesic = function(start, end) {
	var dLon = (end[0] - start[0]) * Math.PI / 180;
	var lat1 = start[1] * Math.PI / 180;
	var lat2 = end[1] * Math.PI / 180;
	var y = Math.sin(dLon) * Math.cos(lat2);
	var x = (Math.cos(lat1) * Math.sin(lat2)) - (Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon));
	var bearing = Math.atan2(y, x) * 180 / Math.PI;
	return bearing;
};