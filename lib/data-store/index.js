var redis = require('redis').createClient();
var sprintf = require('sprintf').vsprintf;
var request = require('request');
var fs = require('fs');
var spawn = require('child_process').spawn;
var readline = require('readline');
var async = require('async');
var _ = require('underscore');
var mongo = require('mongoskin');

var UPDATE_INTERVAL = 6 * 60 * 60 * 1000; // ms between source updates
var UPDATE_OFFSET = 2 * 60 * 60 * 1000; // ms delay before starting update
var BASE_URL = 'http://nomads.ncep.noaa.gov/pub/data/nccf/com/gfs/prod/';
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
var LEVELS = [
  10, 20, 30, 50, 70,
  100, 150, 200, 250, 300,
  350, 400, 450, 500, 550,
  600, 650, 700, 750, 800,
  850, 900, 925, 950, 975, 1000
];

var db = mongo.db('localhost:27017/stratocast', {safe: true});

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

/**
 * Make an error handling function for the wgrib2 parser.
 * 
 * @param  {Readline}   rl   Readline instance to close after error
 * @param  {Function} next Callback(error)
 */
make_errorHandler = function(rl, next) {
  return function(data) {
    rl.close();
    setImmediate(function() {next(data);});
  };
};

/**
 * Make a stream closed handling function for the wgrib2 parser.
 * 
 * @param  {Readline}   rl     Readline instance to close after error
 * @param  {Object}   parsed Object the parsed data is stored in
 * @param  {Function} next   Callback(error, data)
 */
make_closeHandler = function(rl, parsed, next) {
  return function(code) {
    rl.close();
    if(code !== 0) {
      setImmediate(function() {next('Error ' + code);});
    } else {
      next(null, parsed);
    }
  };
};

make_dataHandler = function(parsed) {
  var obs = {};
  return function(data) {
    var tokens = data.split(':');
    var line = parseInt(tokens[0], 10);
    var val = parseFloat(tokens[2].split('=', 10)[1]);
    var level = Math.floor((line - 1) / 4);
    var item = (line - 1) % 4;
    
    if(level < 25) {
      switch(item) {
        case 0: // Height
          obs.altitude = val;
          break;
        case 1: // Temp
          obs.temperature = val;
          break;
        case 2: // UGRD
          obs.windU = val;
          break;
        case 3: // VGRD
          obs.windV = val;
          obs.pressure = LEVELS[level] * 100;
          parsed.push(obs);
          obs = {};
      }
    } else {
      switch(item) {
        case 0: // Temp
          obs.temperature = val;
          break;
        case 1: // UGRD
          obs.windU = val;
          break;
        case 2: // VGRD
          obs.windV = val;
          break;
        case 3: // Height
          obs.altitude = val;
          obs.pressure = LEVELS[level] * 100;
          parsed.push(obs);
          obs = {};
      }
    }
  };
};

/**
 * Put a sounding into the cache
 *
 * Passes any error as the first parameter to the callback.
 * Null error indicates success.
 * 
 * @param  {Date}   time     UTC timestamp of the sounding
 * @param  {Number}   lat      Latitude of the sounding
 * @param  {Number}   lng      Longitude of the sounding
 * @param  {Object}   sounding Sounding object
 * @param  {Function} next     Callback(err)
 */
putCache = function(time, lat, lng, sounding, next) {
  db.collection('soundingCache').update({time: time, loc:[lng, lat]}, sounding, {upsert: true}, function(err, res) {
    next(err);
  });
};

/**
 * Get a sounding from the cache
 *
 * Passes any error as the first parameter to the callback.
 * Sounding object is passed as the second parameter.
 * 
 * @param  {Date}   time UTC timestamp of the sounding
 * @param  {Number}   lat  Latitude of the sounding
 * @param  {Number}   lng  Longitude of the sounding
 * @param  {Function} next Callback(err, sounding)
 */
getCache = function(time, lat, lng, next) {
  db.collection('soundingCache').findOne({time: time, loc:[lng, lat]}, function(err, res) {
    if(err) {
      next(err);
    } else {
      next(null, res);
    }
  });
};

/**
 * Remove all soundings for the given time from the cache
 *
 * Passes any error as the first paramter to the callback.
 * 
 * @param  {Date}   time UTC timestamp to be removed
 * @param  {Function} next Callback(err)
 */
clearCache = function(time, next) {
  db.collection('soundingCache').remove({time: time}, {}, function(err) {
    next(err);
  });
};

/**
 * Extract a sounding from a compressed data file
 *
 * Passes any error as the first paramter to the callback.
 * The sounding object is passed as the second paramter if successful.
 * 
 * @param  {Date}   time UTC time of the sounding
 * @param  {Number}   lat  Latitude of the sounding
 * @param  {Number}   lng  Longitude of the sounding
 * @param  {Function} next Callback(error, sounding)
 */
extractSounding = function(time, lat, lng, next) {
  // Get filename
  getFilename(time, function(err, fileName) {
    if(err) {
      next(err);
    } else {
      // Convert lat/lng to i/j
      var i = lng + 1;
      var j = lng + 91;

      var parsed = [];
      var parser = spawn('wgrib2', [
        fileName,
        '-ij',
        i,
        j
      ]);
      var rl = readline.createInterface({
        input: parser.stdout,
        output: parser.stdin
      });
      parser.stderr.on('data', make_errorHandler(rl, next));
      parser.on('close', make_closeHandler(rl, parsed, next));
      rl.on('line', make_dataHandler(parsed));
    }
  });
};

/**
 * Get the name of the file representing a sounding for the provided time
 * 
 * @param  {Date}   time Date of the sounding
 * @param  {Function} next Callback(err, fileName)
 */
getFilename = function(time, next) {
  db.collection('soundingFiles').findOne({time: time}, function(err, res) {
    if(err) {
      next(err);
    } else {
      next(null, res.fileName);
    }
  });
};

/**
 * Set the name of the file representing a sounding for the provided time
 * 
 * @param {Date}   time     Date of the sounding
 * @param {String}   fileName Name of the file
 */
setFilename = function(time, fileName, next) {
  var record = {
    time: time,
    fileName: fileName
  };
  db.collection('soundingFiles').update({time: time}, record, {upsert: true}, function(err, res) {
    next(err);
  });
};

exports.getSounding = function(time, lat, lng, next) {
  // Check cache
  
  // Extract sounding

  // Add to cache
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
    if (analysisTime != nextTimestamp()) scheduleFetch(nextTimestamp());
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
  clearQueue();
  // Add soundings to download queue
  for (var i in HOURS) {
    redis.rpush('soundingQueue', analysisTime + ':' + HOURS[i]);
  }
};

/**
 * Clear the download queue
 */
clearQueue = function() {
  redis.del('soundingQueue');
};

/**
 * Fetch a key off the download queue if available
 *
 * Callback returns any error and first parameter and reply as second.
 *
 * @param  {Function} next Callback function
 */
exports.popQueue = function(next) {
  redis.lpop('soundingQueue', function(err, reply) {
    if (err) {
      next(err, null);
    } else {
      next(null, reply);
    }
  });
};

/**
 * Preprocess a grib file for later use
 *
 * Callback returns any error as first paramter and returns the
 * new filename as the second parameter.
 *
 * @param  {String}   fileName File name to be processed
 * @param  {Function} next     Callback function
 */
exports.preprocessSounding = function(fileName, next) {
  var newfile = fileName + '.small';
  var processor = spawn('wgrib2', [
    fileName,
    '-match',
    'HGT|TMP|UGRD|VGRD',
    '-match',
    'mb:',
    '-set_grib_type',
    'c1',
    '-grib_out',
    newfile
  ]);
  processor.on('close', function(code) {
    try {
      fs.unlinkSync(fileName);
    } catch (e) {
      // Don't care
    }
    if (code !== 0) {
      next(code, null);
    } else {
      next(null, newfile);
    }
  });
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
exports.downloadSounding = function(key, next) {
  // Split the key
  var tokens = key.split(':');
  // Parse the key fields
  var analysisTime = parseInt(tokens[0], 10);
  var forecastHours = parseInt(tokens[1], 10);
  // Get url and filename
  var url = dataUrl(analysisTime, forecastHours);
  var fileName = 'data/' + (analysisTime + (forecastHours * 60*60*1000)) + '.grib2';
  // Download the sounding
  request(url, function(err, res) {
    if (err) {
      next(err, null);
      return;
    }
    if (res.statusCode !== 200) {
      next(res.statusCode, null);
      try {
        fs.unlinkSync(fileName);
      } catch (e) {
        console.log('Could not delete ' + fileName);
      }
      return;
    }
    // Call the provided callback
    next(null, fileName);
  }).pipe(fs.createWriteStream(fileName));
};

/**
 * Put a failed key back in the queue
 * 
 * @param  {String} key Key to be pushed
 */
exports.requeue = function(key) {
  redis.rpush('soundingQueue', key);
};

/**
 * Initialize the data-store
 */
exports.init = function() {
  // Initialize the scheduler
  // TODO test for latest sounding
  clearQueue();
  scheduleFetch(latestTimestamp());
};