exports = module.exports = Monotonic;

/**
	Constructor

	@param x
	@param y
*/
function Monotonic(x, y) {
	var n = x.length; // length of input

	// Compute secants and initial slopes
	var delta = new Array(); // secant slope
	var m = new Array(); // slope of control point
	for(var i = 0; i < n - 1; i++) {
		// Secant as finite difference
		delta[i] = (y[i + 1] - y[i]) / (x[i + 1] - x[i]);
		// Initial slope of interior points is average of secant (central difference)
		if(i > 0) m[i] = (delta[i - 1] + delta[i]) / 2.0;
	}
	// Initial slope of terminal points is single sided difference
	m[0] = delta[0];
	m[n - 1] = delta[n - 2];

	// Fix zero slope points
	for(var i = 0; i < n - 1; i++) {
		if(delta[i] === 0) {
			m[i] = 0;
			m[i+1] = 0;
		}
	}

	var alpha = new Array();
	var beta = new Array();
	var dist = new Array();
	var tau = new Array();
	for(var i = 0; i < n - 1; i++) {
		alpha[i] = m[i] / delta[i];
		beta[i] = m[i + 1] / delta[i];
		dist[i] = Math.pow(alpha[i], 2) + Math.pow(beta[i], 2);
		tau[i] = 3 / Math.sqrt(dist[i]);
	}

	for(var i = 0; i < n - 1; i++) {
		if(dist[i] > 9) {
			m[i] = tau[i] * alpha[i] * delta[i];
			m[i + 1] = tau[i] * beta[i] * delta[i];
		}
	}

	// Make local copies
	this.x = x;
	this.y = y;
	this.m = m;
}

Monotonic.prototype.interpolate = function(x) {
	var i;
	for(i = this.x.length - 2; i > 0; i--) {
		if(this.x[i] <= x) break;
	}
	var h = this.x[i + 1] - this.x[i];
	var t = (x - this.x[i]) / h;
	var t2 = Math.pow(t, 2);
	var t3 = Math.pow(t, 3);
	var h00 = 2 * t3 - 3 * t2 + 1;
	var h10 = t3 - 2 * t2 + t;
	var h01 = -2 * t3 + 3 * t2;
	var h11 = t3 - t2;
	var y = h00 * this.y[i] +
					h10 * h * this.m[i] +
					h01 * this.y[i + 1] +
					h11 * h * this.m[i + 1];

	return y;
};