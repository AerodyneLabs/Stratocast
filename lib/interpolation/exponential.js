exports = module.exports = Exponential;

function Exponential(x, y) {
	// TODO
}

Exponential.prototype.interpolate = function(x) {
	// TODO
};

Exponential.interpolate = function(x0, y0, x1, y1, x) {
	return y0 * Math.pow(y1 / y0, (x - x0) / (x1 - x0));
};