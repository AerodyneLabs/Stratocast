var linear = require('../../lib/interpolation').Linear;

describe('Linear interpolation object', function() {

	it('interpolates with static method', function() {
		expect(linear.interpolate(1, 1, 2, 2, 1.5)).toEqual(1.5);
	});

});