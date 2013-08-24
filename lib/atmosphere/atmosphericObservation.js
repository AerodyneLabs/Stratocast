exports = module.exports = AtmosphericObservation;

/**
 * Create a new instance of AtmosphericObservation with the given parameters.
 * @param {Number} altitude    Geometric altitude above sea level in meters
 * @param {Number} pressure    Pressure in pascals
 * @param {Number} temperature Temperature in kelvins
 * @param {Number} windU       Easterly component of wind velocity in meters per second
 * @param {Number} windV       Northerly component of wind velocity in meters per second
 * @param {Number} timestamp Number of ms since 1 Jan 1970
 * @param {Number} latitude Signed decimal latitude
 * @param {Number} longitude Signed decimal longitude
 */

function AtmosphericObservation(parameters) {
	this.altitude = parameters.altitude || null;
	this.pressure = parameters.pressure || null;
	this.temperature = parameters.temperature || null;
	this.windU = parameters.windU || null;
	this.windV = parameters.windV || null;
	this.timestamp = parameters.timestamp || null;
	this.latitude = parameters.latitude || null;
	this.longitude = parameters.longitude || null;
}

/**
 * Compute the wind direction represented by this observation.
 *
 * The computed direction uses the meteorlogical standard of
 * representing the direction the wind is from rather than the
 * actual direction of the wind velocity vector.
 *
 * @return {Number} Radians clockwise from north.
 */
AtmosphericObservation.prototype.getWindDirection = function() {
	// TODO Should the angle be the same format as compas bearings?
	return Math.atan2(this.windU, -this.windV);
};

/**
 * Compute the wind speed represented by this observation.
 * 
 * @return {Number} Total wind speed in meters per second
 */
AtmosphericObservation.prototype.getWindSpeed = function() {
	return Math.sqrt(Math.pow(this.windU, 2) + Math.pow(this.windV, 2));
};