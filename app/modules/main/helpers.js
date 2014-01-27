App.module("Main", function(Mod, App) {

	App.helpers = {
		convertDistance: function(data) {
			var value = data || 0.0;
			var unit = 'm';
			if (App.unitSystem === 'english') {

			} else {
				// Convert unit system
				// default is already in metric

				// Idealize order of magnitude
				if (Math.abs(value) >= 5000) {
					value = value / 1000;
					unit = 'km';
				}
			}

			value = Math.round(value * 1000) / 1000;
			return value + ' ' + unit;
		},

		convertMass: function(data) {
			var value = data || 0.0;
			var unit = 'kg';
			if (App.unitSystem === 'english') {

			} else {
				// Convert unit system
				// default is already in metric

				// Idealize order of magnitude
				if (value <= 1) {
					value = value * 1000;
					unit = 'g';
				}
			}

			return value + ' ' + unit;
		},

		convertSpeed: function(data) {
			var value = data || 0.0;
			var unit = 'm/s';

			if (App.unitSystem === 'english') {
				unit = "fpm";
				value /= 196.9;
				value = Math.round(value);
			} else {
				// default is already in metric
				value = Math.round(value * 1000) / 1000;
			}

			return value + ' ' + unit;
		},

		absoluteTime: function(data) {
			var time = new Date(data);
			var ret = (time.getMonth() + 1) + "/" + time.getDate() + "/" + time.getFullYear();
			ret += " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
			return ret;
		},

		relativeTime: function(data) {
			var time = new Date(data);
			var ret = time.getUTCHours();
			ret += ":" + time.getUTCMinutes();
			ret += ":" + time.getUTCSeconds();
			return ret;
		},

		position: function(data) {
			var lat = Math.round(data[1] * 1000) / 1000;
			var lon = Math.round(data[0] * 1000) / 1000;
			return lat + ', ' + lon;
		},

		angle: function(data) {
			var temp = (data + 360) % 360;
			return Math.round(temp * 100) / 100;
		}
		
	};

});