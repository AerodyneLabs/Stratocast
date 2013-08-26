var redis = require('redis').createClient();
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
var HOURS = [
  0, 3, 6, 9, 12, 15, 18, 21,
  24, 27, 30, 33, 36, 39, 42, 45,
  48, 51, 54, 57, 60, 63, 66, 69,
  72, 75, 78, 81, 84, 87, 90, 93,
  96, 99, 102, 105, 108, 111, 114, 117,
  120, 123, 126, 129, 132, 135, 138, 141,
  144, 147, 150, 153, 156, 159, 162, 165,
  168, 171, 174, 177, 180, 183, 186, 189,
  192, 204,
  216, 228,
  240, 252,
  264, 276,
  288, 300,
  312, 324,
  336, 348,
  360, 372,
  384
];

/**
 * Generate the URL for the specified forecast.
 * 
 * @param  {Number} analysisTimestamp Timestamp the analysis was performed
 * @param  {Integer} forecastHours Number of hours out from the analysis
 * @return {String} The URL of the sounding
 */
var dataUrl = function(analysisTimestamp, forecastHours) {
  var analysisTime = new Date(analysisTimestamp);
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

/**
 * Get the expected timestamp of the latest sounding.
 * 
 * @return {Number} Unix timestamp
 */
latestTimestamp = function() {
  var now = Date.now();
  return Math.floor(now / UPDATE_INTERVAL) * UPDATE_INTERVAL;
};

/**
 * Get the expected timestamp of the next sounding
 * 
 * @return {Number} Unix timestamp
 */
nextTimestamp = function() {
  return latestTimestamp() + UPDATE_INTERVAL;
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

/**
 * Schedule a download for the provided analysis time.
 * 
 * @param  {Number} analysisTime Unix timestamp
 */
scheduleFetch = function(analysisTime) {
  // Compute the delay time
  var delay = analysisTime + UPDATE_OFFSET - Date.now();
  // Print the status update
  console.log('Scheduling ' + (new Date(analysisTime)).toUTCString() + ' in ' + delay / 1000 + ' seconds');
  // Schedule the download
  setTimeout(function() {
    startFetch(analysisTime);
    // Schedule the next fetch
    if(analysisTime != nextTimestamp()) scheduleFetch(nextTimestamp());
  }, delay);
};

/**
 * Start the fetch process after triggered
 * 
 * @param  {Number} analysisTime Unix timestamp
 */
startFetch = function(analysisTime) {
  // Print the status update
  console.log('Queing ' + (new Date(analysisTime)).toUTCString());
  // Remove any stragglers from previous fetch
  redis.del('soundingQueue');
  // Add soundings to download queue
  for (var i in HOURS) {
    redis.rpush('soundingQueue', analysisTime + ':' + HOURS[i]);
  }
};

/**
 * Download the sounding specified by the provided key
 *
 * The callback passes any error as the first parameter and the
 * filename of the downloaded file as the second parameter.
 * 
 * @param  {String}   key  Key from download queue
 * @param  {Function} next Callback called on completion of download
 */
exports.download = function(key, next) {
  // Split the key
  var tokens = key.split(':');
  // Parse the key fields
  var analysisTime = parseInt(tokens[0], 10);
  var forecastHours = parseInt(tokens[1], 10);
  // Get url and filename
  var url = dataUrl(analysisTime, forecastHours);
  var fileName = 'data/' + analysisTime + '.' + forecastHours + '.grib2';
  // Download the sounding
  request(url, function(err, res) {
    if(err) {
      console.log('ERROR downloading ' + fileName);
      next(err, null);
    }
    console.log('Donwloaded ' + fileName);
    // Call the provided callback
    next(null, fileName);
  }).pipe(fs.createWriteStream(fileName));
};

/**
 * Initialize the data-store
 */
exports.init = function() {
  // Initialize the scheduler
  // TODO test for latest sounding
  scheduleFetch(latestTimestamp());
};