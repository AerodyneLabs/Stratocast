var Observation = require('../../lib/atmosphere').AtmosphericObservation;

describe('AtmosphericObservation object', function() {

	it('holds the observed values', function() {
		var obs = new Observation(1000, 2000, 273.15, 1, 2);
		expect(obs.altitude).toEqual(1000);
		expect(obs.pressure).toEqual(2000);
		expect(obs.temperature).toEqual(273.15);
		expect(obs.windU).toEqual(1);
		expect(obs.windV).toEqual(2);
	});

	it('computes wind speed', function() {
		var obs = new Observation(0, 0, 0, 3, 4);
		expect(obs.getWindSpeed()).toEqual(5);
	});

	it('computes wind direction in NE quadrant', function() {
		var obs = new Observation(0, 0, 0, 1, 1);
		expect(obs.getWindDirection()).toEqual(3 * Math.PI / 4);
	});

	it('computes wind direction in SE quadrant', function() {
		var obs = new Observation(0, 0, 0, 1, -1);
		expect(obs.getWindDirection()).toEqual(Math.PI / 4);
	});

	it('computes wind direction in SW quadrant', function() {
		var obs = new Observation(0, 0, 0, -1, -1);
		expect(obs.getWindDirection()).toEqual(-1 * Math.PI / 4);
	});

	it('computes wind direction in NW quadrant', function() {
		var obs = new Observation(0, 0, 0, -1, 1);
		expect(obs.getWindDirection()).toEqual(-3 * Math.PI / 4);
	});

});