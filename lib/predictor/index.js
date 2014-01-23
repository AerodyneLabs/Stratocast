module.exports = exports = Prediction;

var _ = require('underscore');
var ds = require('../data-store');
var Observation = require('../atmosphere').AtmosphericObservation;
var Profile = require('../atmosphere').AtmosphericProfile;
var elevation = require('../mapquest').ElevationService;
var Balloon = require('./balloon');
var Parachute = require('./parachute');
var ode45 = require('numeric').dopri;
var geo = require('../geodesic');

function Prediction(parameters) {
	this.time = parameters.time;
	this.loc = parameters.loc;
	this.balloon = new Balloon(parameters.balloon);
	this.mass = parameters.mass;
	this.chute = new Parachute(parameters.parachute);
	this.direction = parameters.direction || 'forward';
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

			pred.startAlt = obs[0].altitude + 10;
			elevation([pred.loc[1], pred.loc[0]], function(err, res) {
				var resHeight;
				if(!err) {
					if(res) resHeight = res[0].height;
				}
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
				
				if(pred.direction === 'reverse') {
					console.log('Running reverse prediction');
					// Iterate up until burst
					var descent = function(t, y) {
						var out = [];
						obs = prof.getObservationAtAltitude(y[2]);
						out[0] = -obs.windU;
						out[1] = -obs.windV;
						out[2] = Math.sqrt((pred.mass * 9.81) / (0.5 * obs.getAirDensity() * pred.chute.area * pred.chute.drag));
						return out;
					}
					while (radius <= pred.balloon.burstRadius) {
						var sol = ode45(0, pred.tStep, [dx, dy, alt], descent);
						var r = sol.y.pop();
						dx = r[0];
						dy = r[1];
						alt = r[2];
						elapsedTime -= pred.tStep;
						var point = geo.directGeodesic(pred.loc, dx, dy);
						pred.geometry.coordinates.unshift([point[0], point[1], alt, elapsedTime]);
						obs = prof.getObservationAtAltitude(alt);
						radius = pred.balloon.getRadius(obs);
						console.log("D: " + alt + " " + radius + "/" + pred.balloon.burstRadius);
					}

					// Iterate down until launch
					var ascent = function(t, y) {
						var out = [];
						obs = prof.getObservationAtAltitude(y[2]);
						out[0] = -obs.windU;
						out[1] = -obs.windV;
						out[2] = -pred.ascentRate;
						return out;
					};
					while(alt >= pred.startAlt) {
						var sol = ode45(0, pred.tStep, [dx, dy, alt], ascent);
						var r = sol.y.pop();
						dx = r[0];
						dy = r[1];
						alt = r[2];
						elapsedTime -= pred.tStep;
						var point = geo.directGeodesic(pred.loc, dx, dy);
						pred.geometry.coordinates.unshift([point[0], point[1], alt, elapsedTime]);
						console.log("A: " + alt + " " + pred.startAlt);
					}
				} else {
					console.log("Running forward prediction");
					// Iterate until burst
					var ascent = function(t, y) {
						var out = [];
						obs = prof.getObservationAtAltitude(y[2]);
						out[0] = obs.windU;
						out[1] = obs.windV;
						out[2] = pred.ascentRate;
						return out;
					};
					while (radius <= pred.balloon.burstRadius) {
						var sol = ode45(0, pred.tStep, [dx, dy, alt], ascent);
						var r = sol.y.pop();
						dx = r[0];
						dy = r[1];
						alt = r[2];
						elapsedTime += pred.tStep;
						var point = geo.directGeodesic(pred.loc, dx, dy);
						pred.geometry.coordinates.push([point[0], point[1], alt, elapsedTime]);
						obs = prof.getObservationAtAltitude(alt);
						radius = pred.balloon.getRadius(obs);
					}

					// Iterate until landing
					var descent = function(t, y) {
						var out = [];
						obs = prof.getObservationAtAltitude(y[2]);
						out[0] = obs.windU;
						out[1] = obs.windV;
						out[2] = -Math.sqrt((pred.mass * 9.81) / (0.5 * obs.getAirDensity() * pred.chute.area * pred.chute.drag));
						return out;
					};
					while (alt >= pred.startAlt) {
						var sol = ode45(0, pred.tStep, [dx, dy, alt], descent);
						var r = sol.y.pop();
						dx = r[0];
						dy = r[1];
						alt = r[2];
						elapsedTime += pred.tStep;
						var point = geo.directGeodesic(pred.loc, dx, dy);
						pred.geometry.coordinates.push([point[0], point[1], alt, elapsedTime]);
					}				
				}

				next(null, pred);
			});
		}
	});
};