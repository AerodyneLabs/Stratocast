var sprintf = require('sprintf').vsprintf;
var request = require('request');
var fs = require('fs');
var spawn = require('child_process').spawn;
var readline = require('readline');

var UPDATE_INTERVAL = 6 * 60 * 60 * 1000; // ms between source updates
var UPDATE_OFFSET = 2 * 60 * 60 * 1000; // ms delay before starting update
var BASE_URL = 'http://nomads.ncep.noaa.gov/pub/data/nccf/com/gfs/prod/';
var X_POINTS = 360;
var Y_POINTS = 181;

/**
 * Generate the URL for the specified forecast.
 * @param  {Date} analysisTime Time the analysis was performed
 * @param  {Integer} forecastHours Number of hours out from the analysis
 * @return {String} The URL of the sounding
 */
var dataUrl = function(analysisTime, forecastHours) {
  // Example folder name
  // gfs.2013052400
  var folder = sprintf(
    'gfs.%04d%02d%02d%02d/', [
      analysisTime.getUTCFullYear(),
      analysisTime.getUTCMonth() + 1,
      analysisTime.getUTCDate(),
      analysisTime.getUTCHours()
    ]);

  // Example file name
  // gfs.t00z.pgrbf00.grib2
  var file = sprintf(
    'gfs.t%02dz.pgrbf%02d.grib2', [
      analysisTime.getUTCHours(),
      forecastHours
    ]);

  return BASE_URL + folder + file;
};

var scheduleFetch = function(analysisTime) {
  var delayTime = analysisTime - (new Date().getTime()) + UPDATE_OFFSET;
  var job = jobs.create('Fetch', {
    title: 'Update to ' + analysisTime.toUTCString() + ' analysis',
    analysisTime: analysisTime
  });
  if (delayTime > 0) job.delay(delayTime);
  job.attempts(5).save();
};

var parseSounding = function(fileName, fieldName) {
  var i = 0;
  var data = 0;
  var parser = spawn('wgrib2', [
    'data/' + fileName,
    '-match',
    'fieldName',
    '-text',
    '-'
  ]);
  var rl = readline.createInterface({
    input: parser.stdout,
    output: parser.stdin
  });
  parser.stderr.on('data', function(data) {
    rl.close();
    console.log('!' + data);
    return null;
  });
  parser.on('close', function(code) {
    rl.close();
    console.log('Done Parsing: ' + fileName + ' > ' + fieldName);
    return data;
  });
  // Output format
  // Junk line
  // x*y data lines
  // info line
  rl.on('line', function(data) {
    console.log(i+++' > ' + data);
  });
};

exports.init = function() {
  // blah
};