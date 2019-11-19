function Parachute(options) {

    // Minimum allowable value for the parachute, so we prevent a divide by zero.
    var minValue = 0.01;

    // Defaults for the parachute.
    var defaultArea = 0.6;
    var defaultDrag = 1.5;

    // Use the default value, if input not provided.
	this.area = parseFloat(options.area).toFixed(2) || defaultArea;
	this.drag = parseFloat(options.drag).toFixed(2) || defaultDrag;

	// Verify the input arguments, using default if not valid.
	if(this.area < minValue) {
	    this.area = minValue;
	}

	if(this.drag < minValue) {
	    this.drag = minValue;
	}
}

module.exports = exports = Parachute;