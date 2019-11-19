var Observation = require('../../lib/atmosphere').AtmosphericObservation;
var Profile = require('../../lib/atmosphere').AtmosphericProfile;

describe('AtmosphericProfile object', function() {
	var pro;
	var obs1, obs2;

	beforeEach(function() {
		pro = new Profile();
		obs1 = new Observation({
			altitude: 2,
			temperature: 2,
			pressure: 2,
			windU: 2,
			windV: 2
		});
		obs2 = new Observation({
			altitude: 1,
			temperature: 1,
			pressure: 1,
			windU: 1,
			windV: 1
		});
	});

	it('fails gracefully with no data', function() {
		// Create function to call interpolation function
		var caller = function() {
			return pro.getObservationAtAltitude(1);
		};

		// Observations array should be empty
		expect(pro.observations.length).toEqual(0);
		// Should return null
		expect(caller()).toBe(null);
		// Should not throw any exceptions
		expect(caller).not.toThrow();
	});

	it('can have an observation added to it', function() {
		pro.addObservation(obs1);

		expect(pro.observations.length).toEqual(1);
		expect(pro.observations[0]).toEqual(obs1);
	});

	it('can have observations added to it', function() {
		pro.addObservation([obs1, obs2]);

		expect(pro.observations.length).toEqual(2);
		expect(pro.observations[0]).not.toEqual(pro.observations[1]);
	});

	it('sorts its observations by altitude', function() {
		pro.addObservation([obs1, obs2]);

		expect(pro.observations[0]).toEqual(obs2);
		expect(pro.observations[1]).toEqual(obs1);
	});

	it('interpolates by altitude between observations', function() {
		// TODO Use values that better test interpolation
		pro.addObservation([obs1, obs2]);
		
		// TODO More robust testing
		var ans = new Observation({
			altitude: 1.5,
			temperature: 1.5,
			pressure: 1.4142135623730951,
			windU: 1.5,
			windV: 1.5
		});
		var res = pro.getObservationAtAltitude(1.5);

		expect(res).toEqual(ans);
	});

});