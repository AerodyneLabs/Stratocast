var kue = require('kue');
var jobs = kue.createQueue();
var sprintf = require('sprintf').vsprintf;
var request = require('request');
var fs = require('fs');
var spawn = require('child_process').spawn;
var readline = require('readline');

var UPDATE_INTERVAL = 6 * 60 * 60 * 1000;	// ms between source updates
var UPDATE_OFFSET = 2 * 60 * 60 * 1000;		// ms delay before starting update
var BASE_URL = 'http://nomads.ncep.noaa.gov/pub/data/nccf/com/gfs/prod/';

dataUrl = function(analysisTime, forecastHours) {
	// gfs.2013052400
	var folder = sprintf(
		'gfs.%04d%02d%02d%02d/', [
		analysisTime.getUTCFullYear(),
		analysisTime.getUTCMonth()+1,
		analysisTime.getUTCDate(),
		analysisTime.getUTCHours()
	]);
	// gfs.t00z.pgrbf00.grib2
	var file = sprintf(
		'gfs.t%02dz.pgrbf%02d.grib2', [
		analysisTime.getUTCHours(),
		forecastHours
	]);
	return BASE_URL + folder + file;
};

scheduleFetch = function(analysisTime) {
	var delayTime = analysisTime - (new Date().getTime()) + UPDATE_OFFSET;
	var job = jobs.create('Fetch', {
		title: 'Update to ' + analysisTime.toUTCString() + ' analysis',
		analysisTime: analysisTime
	});
	if(delayTime > 0) job.delay(delayTime);
	job.attempts(5).save();
};

exports.init = function() {
	/* Delete existing fetches */
	jobs.state('delayed', function(err, ids) {
		//TODO Error handling
		var i;
		for(i = 0; i < ids.length; ++i) {
			kue.Job.remove(ids[i], function(err) {
				//TODO error handling
			});
		}
	});

	/* Ensure latest data is in store */
	var prevTime = new Date((Math.floor((new Date().getTime()) / UPDATE_INTERVAL)) * UPDATE_INTERVAL);
	// TODO latest data check
	// FIXME Can fail if started inside offset time
	if(true) scheduleFetch(prevTime);

	/* Schedule the next fetch */
	var nextTime = new Date((1 + Math.floor((new Date().getTime()) / UPDATE_INTERVAL)) * UPDATE_INTERVAL);
	scheduleFetch(nextTime);
};

jobs.promote();

jobs.process('Fetch', function(job, done) {
	console.log('Processing: ' + job.data.title);
	var timestamp = job.data.analysisTime;
	for(var h = 0; h <= 192; h += 3) {
		var jobtime = timestamp + (h * 60 * 60 * 1000);
		jobs.create('Update', {
			title: 'Update: ' + h + ' hours from ' + new Date(timestamp).toUTCString(),
			forecastHours: h,
			analysisTime: new Date(timestamp)
		}).save();
	}
	done();
});

jobs.process('Update', 2, function(job, done) {
	console.log('Updating: ' + job.data.analysisTime + ' +' + job.data.forecastHours);
	var fileUrl = dataUrl(new Date(job.data.analysisTime), job.data.forecastHours);
	var fileName = fileUrl.split('/').pop();
	console.log('Downloading: ' + fileUrl);
	request(fileUrl, function(err, res) {
		if(err) job.error(err);
		console.log(job.data.forecastHours + ' Downloaded');
		//job.progress(50,100);
		var parser = spawn('wgrib2', [
			'data/' + fileName,
			'-match',
			'GUST',
			'-text',
			'-'
		]);
		var rl = readline.createInterface({
			input: parser.stdout,
			output: parser.stdin
		});
		parser.stderr.on('data', function(data) {
			rl.close();
			console.log('! ' + data);
			job.error(data);
		});
		parser.on('close', function(code) {
			rl.close();
			done();
		});
		rl.on('line', function(data) {
			console.log('> ' + data);
		});
	}).pipe(fs.createWriteStream('data/' + fileName));
});

/* Parsing Information
HGT
TEMP
208 TCDC Total Cloud Cover
259 GUST Surface gust speed
262.1/2 UGRD/VGRD surface wind speed
267.1/2 UGRD/VGRD surface wind speed
*/