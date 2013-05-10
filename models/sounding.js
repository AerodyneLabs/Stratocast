var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Sounding = new Schema({
	timestamp : {type: Date},
	location : {type: [Number]},
	analysis : {type: Date},
	duration : {type: Number},
	altitude : {type: [Number]},
	pressure : {type: [Number]},
	temperature : {type: [Number]},
	dewPoint : {type: [Number]},
	windU : {type: [Number]},
	windV : {type: [Number]}
});

module.exports = mongoose.model('Sounding', Sounding);