var Observation = require('../../lib/atmosphere').AtmosphericObservation;
var Profile = require('../../lib/atmosphere').AtmosphericProfile;

describe('AtmosphericProfile object', function() {
	var pro;
	var obs1, obs2;

	beforeEach(function() {
		pro = new Profile();
		obs1 = new Observation(2, 2, 2, 2, 2);
		obs2 = new Observation(1, 1, 1, 1, 1);
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
		// TODO More robust testing
		var ans = new Observation(1.5, 1.5, 1.5, 1.5, 1.5, 1.5);
		var res = pro.getObservationAtAltitude(1.5);

		pro.addObservation([obs1, obs2]);

		expect(res).toEqual(ans);
	});

});