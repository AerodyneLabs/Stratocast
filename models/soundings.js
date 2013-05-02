var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Sounding = new Schema({
	timestamp : {type: Date},
	latitude : {type: Number},
	longitude : {type: Number},
	performed : {type: Date},
	duration : {type: Number},
	altitude : [Number],
	pressure : [Number],
	temperature : [Number],
	dewPoint : [Number],
	windU : [Number],
	windV : [Number]
});

module.exports = mongoose.model('Sounding', Sounding);