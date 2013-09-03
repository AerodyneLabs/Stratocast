var R = 8.31432;
var RHO0_HE = 0.1762;
var RHO0_AIR = 1.276;
// Molecular Weights - kg/mol
var MW_H = 0.00201588;
var MW_HE = 0.004002602;
var MW_AIR = 0.0289644;

var BALLOONS = {
	'Kaymont 600g': {
		mass: 0.6,
		burstRadius: 3.048,
		drag: 0.3
	},
	'Kaymont 800g': {
		mass: 0.8,
		burstRadius: 3.505,
		drag: 0.3
	},
	'Kaymont 1200g': {
		mass: 1.2,
		burstRadius: 4.267,
		drag: 0.25
	}
};

function Balloon(options) {
	this.type = options.type || 'Kaymont 800g';
	this.mass = BALLOONS[this.type].mass;
	this.burstRadius = BALLOONS[this.type].burstRadius;
	this.drag = BALLOONS[this.type].drag;
	this.gas = options.gas || 'helium';
	if(this.gas === 'hydrogen') {
		this.MW = MW_H;
	} else {
		this.MW = MW_HE;
	}
	if(options.totalLift) {
		var totalLift = parseFloat(options.totalLift);
		var rhoG = (100000 * this.MW) / (R * 273.15);
		var rhoA = (100000 * MW_AIR) / (R * 273.15);
		var V = (totalLift) / (rhoA - rhoG);
		this.mols = (100000 * V) / (R * 273.15);
		var lift = this.getLift();
	}
}

Balloon.prototype.getVolume = function(input) {
	if(typeof(input) === 'undefined') input = {};
	var T = input.temperature || 273.15;
	var P = input.pressure || 100000;
	return (this.mols * R * T) / P;
};

Balloon.prototype.getRadius = function(input) {
	if(typeof(input) === 'undefined') input = {};
	var V = this.getVolume(input);
	return Math.pow((3.0 * V) / (4.0 * Math.PI), 1.0 / 3.0);
};

Balloon.prototype.getArea = function(input) {
	if(typeof(input) === 'undefined') input = {};
	var r = this.getRadius(input);
	return Math.PI * Math.pow(r, 2.0);
};

Balloon.prototype.getLift = function(input) {
	if(typeof(input) === 'undefined') input = {};
	var T = input.temperature || 273.15;
	var P = input.pressure || 100000;
	var rhoG = (P * this.MW) / (R * T);
	var rhoA = (P * MW_AIR) / (R * T);
	var V = this.getVolume(input);
	return V * (rhoA - rhoG) * 9.81;
};

module.exports = exports = Balloon;