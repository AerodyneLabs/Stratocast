var Exponential = require('../../lib/interpolation').Exponential;

describe('Exponential interpolation object', function() {

	it('interpolates with static method', function() {
		expect(Exponential.interpolate(1, 1, 2, 2, 3)).toEqual(4);
	});

});