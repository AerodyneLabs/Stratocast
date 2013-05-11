var kue = require('kue');
var jobs = kue.createQueue();

var UPDATE_INTERVAL = 6 * 60 * 60 * 1000;	// ms between source updates
var UPDATE_OFFSET = 2 * 60 * 60 * 1000;		// ms delay before starting update

exports.init = function() {
	/* Delete existing fetches */
	jobs.state('delayed', function(err, ids) {
		console.log(ids);
		//TODO Error handling
		var i;
		for(i = 0; i < ids.length; ++i) {
			kue.Job.remove(ids[i], function(err) {
				//TODO error handling
			});
		}
	});

	/* Ensure latest data is in store */
	// TODO latest data check

	/* Schedule the next fetch */
	var nextTime = new Date((1 + Math.floor((new Date().getTime()) / UPDATE_INTERVAL)) * UPDATE_INTERVAL);
	var delayTime = nextTime - (new Date().getTime()) + UPDATE_OFFSET;
	jobs.create('Fetch', {
		title: 'Download ' + nextTime.toUTCString() + ' analysis',
		timestamp: nextTime.getTime
	}).delay(delayTime).save();
};