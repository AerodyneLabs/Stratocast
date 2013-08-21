exports = module.exports = AtmosphericProfile;

require('./atmosphericObservation');

function AtmosphericProfile() {
	this.observations = [];
}

AtmosphericProfile.prototype.addObservation = function(observation) {};

AtmosphericProfile.prototype.getObservationAtAltitude = function(altitude) {
	// Nothing to do if we have no data
	if (this.observations.length === 0) return null;
};