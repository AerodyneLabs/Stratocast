exports = module.exports = AtmosphericProfile;

var Observation = require('./atmosphericObservation');
var Linear = require('../interpolation').Linear;
var Exponential = require('../interpolation').Exponential;

function AtmosphericProfile() {
	this.observations = [];
}

AtmosphericProfile.prototype.addObservation = function(observation) {
	// Add the observation(s)
	if(Object.prototype.toString.call(observation) === '[object Array]') {
		// Input is an array of observations
		for(var i = 0; i < observation.length; i++) {
			this.observations.push(observation[i]);
		}
	} else {
		// Input is a single observation
		this.observations.push(observation);
	}
	// Sort the observation list
	this.observations.sort(AtmosphericProfile.comparator);
};

AtmosphericProfile.prototype.getObservationAtAltitude = function(altitude) {
	// Nothing to do if we have no data
	if (this.observations.length === 0) {
		console.log("No profile data!");
		return null;
	}
	// Traverse observations to find top level
	var i;
	for(i = 0; i <= this.observations.length; i++) {
		if(i === this.observations.length) break;
		if(this.observations[i].altitude > altitude) break;
	}
	if(i === 0) {
		//console.log('Request is below defined data');
		// TODO extrapolate instead of this hack
		return this.observations[0];
	} else if(i === this.observations.length) {
		// TODO better expolation
		//console.log('Request is above defined data');
		var peak = this.observations[this.observations.length - 1];
		var p = peak.pressure * Math.pow(1 - (0.0000225577 * ( altitude - peak.altitude )), 5.25588);
		return new Observation({
			altitude: altitude,
			pressure: p,
			temperature: peak.temperature,
			windU: peak.windU,
			windV: peak.windV,
			timestamp: peak.timestamp,
			latitude: peak.latitude,
			longitude: peak.longitude
		});
	} else {
		var base = this.observations[i-1];
		var top = this.observations[i];
		var temp = Linear.interpolate(
			base.altitude, base.temperature,
			top.altitude, top.temperature,
			altitude
		);
		var pres = Exponential.interpolate(
			base.altitude, base.pressure,
			top.altitude, top.pressure,
			altitude
		);
		var u = Linear.interpolate(
			base.altitude, base.windU,
			top.altitude, top.windU,
			altitude
		);
		var v = Linear.interpolate(
			base.altitude, base.windV,
			top.altitude, top.windV,
			altitude
		);
		return new Observation({
			altitude: altitude,
			pressure: pres,
			temperature: temp,
			windU: u,
			windV: v,
			timestamp: base.timestamp,
			latitude: base.latitude,
			longitude: base.longitude
		});
	}
};

AtmosphericProfile.comparator = function(a, b) {
	if(a.altitude < b.altitude) {
		return -1;
	}
	if(a.altitude > b.altitude) {
		return 1;
	}
	return 0;
};