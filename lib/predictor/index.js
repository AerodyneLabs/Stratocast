module.exports = exports = Prediction;

var _ = require('underscore');
var ds = require('../data-store');
var Observation = require('../atmosphere').AtmosphericObservation;
var Profile = require('../atmosphere').AtmosphericProfile;
var elevation = require('../mapquest').ElevationService;
var Balloon = require('./balloon');
var Parachute = require('./parachute');
var ode45 = require('numeric').dopri;

function Prediction(parameters) {
	this.time = parameters.time;
	this.loc = parameters.loc;
	this.balloon = new Balloon(parameters.balloon);
	this.mass = parameters.mass;
	this.chute = new Parachute(parameters.parachute);
}

Prediction.defaults = {};

Prediction.prototype.run = function(options, next) {
	if (typeof next === 'undefined') {
		next = options;
		options = null;
	}

	var tStep = options.tStep || 60;

	var pred = _.extend(this, options);
	pred.type = 'Feature';
	pred.geometry = {type: 'LineString', coordinates: []};
	pred.properties = {};
	// Get the nearest sounding
	ds.getSounding(pred.time, pred.loc[1], pred.loc[0], function(err, sounding) {
		if (err) {
			next(err);
		} else {
			// Create an atmosphere profile
			var prof = new Profile();
			prof.time = sounding.time;
			prof.loc = sounding.loc;
			var obs = [];
			for (var i = 0; i < sounding.data.length; i++) {
				obs.unshift(new Observation(_.extend({
					timestamp: sounding.time,
					latitude: sounding.loc[1],
					longitude: sounding.loc[0]
				}, sounding.data[i])));
			}
			prof.addObservation(obs);

			pred.startAlt = obs[0].altitude;
			elevation([pred.loc[1], pred.loc[0]], function(err, res) {
				var resHeight;
				if(!err) resHeight = res[0].height;
				if(!isNaN(resHeight) && resHeight !== null) pred.startAlt = resHeight;

				var alt = pred.startAlt;
				var dx = 0;
				var dy = 0;
				var obs = prof.getObservationAtAltitude(pred.startAlt);
				var totalLift = pred.balloon.getLift(obs);
				var rhoA = obs.getAirDensity();
				var drag = pred.balloon.drag;
				var area = pred.balloon.getArea(obs);
				var radius = pred.balloon.getRadius(obs);
				pred.ascentRate = Math.pow((totalLift - (pred.mass * 9.81)) / (0.5 * rhoA * drag * area), 0.5);
				
				var elapsedTime = 0;
				pred.geometry.coordinates.push([pred.loc[0], pred.loc[1], pred.startAlt, 0]);
				// ode45(t0, t1, y0, deriv)
				// Iterate until burst
				var derivs = function(t, y) {
					var out = [];
					obs = prof.getObservationAtAltitude(y[2]);
					out[0] = obs.windU;
					out[1] = obs.windV;
					out[2] = pred.ascentRate;
					return out;
				};
				while(radius <= pred.balloon.burstRadius) {
					var sol = ode45(elapsedTime, elapsedTime + pred.tStep, [dx, dy, alt], derivs);
					console.log(sol);
					dx = sol.y.pop()[0];
					dy = sol.y.pop()[1];
					alt = sol.y.pop()[2];
					elapsedTime += pred.tStep;
					console.log('Solved ' + elapsedTime + ' ' + alt);
					pred.geometry.coordinates.push([0, 0, alt, elapsedTime]);
					obs = prof.getObservationAtAltitude(alt);
					radius = pred.balloon.getRadius(obs);
				}

				// Iterate until landing
				

				next(null, pred);
			});
		}
	});
};