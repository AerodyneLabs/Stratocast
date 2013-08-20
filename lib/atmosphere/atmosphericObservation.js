exports = module.exports = AtmosphericObservation;

/**
 * Create a new instance of AtmosphericObservation with the given parameters.
 * @param {Number} altitude    Geometric altitude above sea level in meters
 * @param {Number} pressure    Pressure in pascals
 * @param {Number} temperature Temperature in kelvins
 * @param {Number} windU       Easterly component of wind velocity in meters per second
 * @param {Number} windV       Northerly component of wind velocity in meters per second
 */

function AtmosphericObservation(altitude, pressure, temperature, windU, windV) {
	this.altitude = altitude;
	this.pressure = pressure;
	this.temperature = temperature;
	this.windU = windU;
	this.windV = windV;
}

AtmosphericObservation.prototype.getWindDirection = function() {
	return Math.atan2(this.windU, -this.windV);
};

AtmosphericObservation.prototype.getWindSpeed = function() {
	return Math.sqrt(Math.pow(this.windU, 2) + Math.pow(this.windV, 2));
};