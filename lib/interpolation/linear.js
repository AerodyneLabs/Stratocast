exports = module.exports = Linear;

/**
	Constructor

	@param x
	@param y
*/

function Linear(x, y) {
  // Make local copies
  this.x = x;
  this.y = y;
}

Linear.prototype.interpolate = function(x) {
  //TODO
};

Linear.interpolate = function(x0, y0, x1, y1, x) {
  var dx = x1 - x0;
  var dy = y1 - y0;
  var d = x - x0;
  var y = y0 + dy * d / dx;
  return y;
};