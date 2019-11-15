module.exports = exports = Prediction;

// Constants.
const gravity = 9.81;
const minMass = 0.05;

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

	// Verify the minimum mass is not zero.
	if(parseFloat(pred.mass).toFixed(2) < minMass){
	    pred.mass = minMass;
	}

	pred.type = 'FeatureCollection';
	pred.features = [];

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
				var radius = pred.balloon.getRadius(obs);

				// Summary of overall ascent rate.
				pred.ascentRate = Math.pow((minMass * gravity) / (0.5 * obs.getAirDensity() * pred.balloon.drag * pred.balloon.getArea(obs)), 0.5);
				if(pred.balloon.getLift(obs) > ((pred.mass + pred.balloon.mass) * gravity)) {
				    pred.ascentRate = Math.pow((pred.balloon.getLift(obs) - ((pred.mass + pred.balloon.mass) * 9.81)) / (0.5 * obs.getAirDensity() * pred.balloon.drag * pred.balloon.getArea(obs)), 0.5);
				}

				var elapsedTime = 0;
				
				if(pred.direction === 'reverse') { // Reverse prediction

					// Add landing point
					pred.features[4] = {
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: [pred.loc[0], pred.loc[1], pred.startAlt, 0]
						},
						properties: {}
					};
					pred.features[3] = {
						type: 'Feature',
						geometry: {
							type: 'LineString',
							coordinates: [[pred.loc[0], pred.loc[1], pred.startAlt, 0]]
						},
						properties: {}
					};
					pred.landingTime = pred.time;

					// Iterate up until burst
					var descent = function(t, y) {
						var out = [];
						obs = prof.getObservationAtAltitude(y[2]);
						out[0] = -obs.windU;
						out[1] = -obs.windV;
						out[2] = Math.sqrt((pred.mass * gravity) / (0.5 * obs.getAirDensity() * pred.chute.area * pred.chute.drag));
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
						pred.features[3].geometry.coordinates.unshift([point[0], point[1], alt, elapsedTime]);
						obs = prof.getObservationAtAltitude(alt);
						radius = pred.balloon.getRadius(obs);
					}

					// Add burst point
					pred.features[2] = {
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: pred.features[3].geometry.coordinates[0]
						},
						properties: {}
					};
					pred.features[1] = {
						type: 'Feature',
						geometry: {
							type: 'LineString',
							coordinates: [pred.features[3].geometry.coordinates[0]]
						},
						properties: {}
					};
					pred.descentTime = new Date(elapsedTime * -1000);
					pred.burstTime = new Date(pred.time.getTime() + (elapsedTime * 1000));

					// Iterate down until launch
					var ascent = function(t, y) {
						var out = [];
						obs = prof.getObservationAtAltitude(y[2]);
						out[0] = -obs.windU;
						out[1] = -obs.windV;
						out[2] = -Math.pow((minMass * gravity) / (0.5 * obs.getAirDensity() * pred.balloon.drag * pred.balloon.getArea(obs)), 0.5);
						if(pred.balloon.getLift(obs) > ((pred.mass + pred.balloon.mass) * gravity)) {
						    out[2] = -Math.pow((pred.balloon.getLift(obs) - ((pred.mass + pred.balloon.mass) * gravity)) / (0.5 * obs.getAirDensity() * pred.balloon.drag * pred.balloon.getArea(obs)), 0.5);
						}

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
						pred.features[1].geometry.coordinates.unshift([point[0], point[1], alt, elapsedTime]);
					}

					// Add launch point
					pred.features[0] = {
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: pred.features[1].geometry.coordinates[0]
						},
						properties: {}
					};
					pred.ascentTime = new Date((elapsedTime * -1000) - pred.descentTime.getTime());
					pred.elapsedTime = new Date(elapsedTime * -1000);
					pred.launchTime = new Date(pred.time.getTime() - (elapsedTime * -1000));

				} else { // Forward prediction

					// Create launch point
					pred.features[0] = {
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: [pred.loc[0], pred.loc[1], pred.startAlt, 0]
						},
						properties: {}
					};
					pred.features[1] = {
						type: 'Feature',
						geometry: {
							type: 'LineString',
							coordinates: [[pred.loc[0], pred.loc[1], pred.startAlt, 0]]
						},
						properties: {
						}
					};
					pred.launchTime = pred.time;

					// Iterate until burst
					var ascent = function(t, y) {
						var out = [];
						obs = prof.getObservationAtAltitude(y[2]);
						out[0] = obs.windU;
						out[1] = obs.windV;
						out[2] = Math.pow((0.05 * gravity) / (0.5 * obs.getAirDensity() * pred.balloon.drag * pred.balloon.getArea(obs)), 0.5);

            if(pred.balloon.getLift(obs) > ((pred.mass + pred.balloon.mass) * gravity)) {
                out[2] = Math.pow((pred.balloon.getLift(obs) - ((pred.mass + pred.balloon.mass) * gravity)) / (0.5 * obs.getAirDensity() * pred.balloon.drag * pred.balloon.getArea(obs)), 0.5);
            }

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
						pred.features[1].geometry.coordinates.push([point[0], point[1], alt, elapsedTime]);
						obs = prof.getObservationAtAltitude(alt);
						radius = pred.balloon.getRadius(obs);
					}

					// Add burst point
					pred.features[2] = {
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: pred.features[1].geometry.coordinates.slice(-1)[0]
						},
						properties: {}
					};
					pred.features[3] = {
						type: 'Feature',
						geometry: {
							type: 'LineString',
							coordinates: [pred.features[1].geometry.coordinates.slice(-1)[0]]
						},
						properties: {}
					};
					pred.ascentTime = new Date(elapsedTime * 1000);
					pred.burstTime = new Date(pred.time.getTime() + (elapsedTime * 1000));

					// Iterate until landing
					var descent = function(t, y) {
						var out = [];
						obs = prof.getObservationAtAltitude(y[2]);
						out[0] = obs.windU;
						out[1] = obs.windV;
						out[2] = -Math.sqrt((pred.mass * gravity) / (0.5 * obs.getAirDensity() * pred.chute.area * pred.chute.drag));
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
						pred.features[3].geometry.coordinates.push([point[0], point[1], alt, elapsedTime]);
					}

					// Add landing point
					pred.features[4] = {
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: pred.features[3].geometry.coordinates.slice(-1)[0]
						},
						properties: {}
					};

					pred.descentTime = new Date((elapsedTime * 1000) - pred.ascentTime.getTime());
					pred.elapsedTime = new Date(elapsedTime * 1000);
					pred.landingTime = new Date(pred.time.getTime() + (elapsedTime * 1000));
				}

				pred.launchPosition = pred.features[0].geometry.coordinates.slice(0, 2);
				pred.launchAltitude = pred.features[0].geometry.coordinates[2];
				pred.burstPosition = pred.features[2].geometry.coordinates.slice(0, 2);
				pred.burstAltitude = pred.features[2].geometry.coordinates[2];
				pred.landingPosition = pred.features[4].geometry.coordinates.slice(0, 2);
				pred.landingAltitude = pred.features[4].geometry.coordinates[2];
				pred.totalDistance = Math.sqrt((dx * dx) + (dy * dy));
				pred.bearing = geo.indirectGeodesic(
					pred.features[0].geometry.coordinates.slice(0, 2),
					pred.features[4].geometry.coordinates.slice(0, 2)
				);

				pred.analysisTime = new Date();

				next(null, pred);
			});
		}
	});
};