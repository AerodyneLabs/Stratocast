App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

	Mod.views.BalloonCalculatorView = Marionette.ItemView.extend({
		template: 'balloonCalculatorView',
		tagName: 'div',
		modelEvents: {
			'change': 'update'
		},
		templateHelpers: function() {
			return _.extend(App.helpers, {});
		},

		estBurstAltitude: function() {
			var balloon = Mod.balloons[this.model.get('brand') + ' ' + this.model.get('size')];
			var burstVolume = (4 / 3) * Math.PI * Math.pow(balloon.burstRadius, 3);
			var lift = parseFloat(this.model.get('lift'));
			var payload = parseFloat(this.model.get('mass'));
			var launchVolume = (lift + balloon.mass + payload) / (1.275 - 0.1785);
			var burstAltitude = (7238.3 * Math.log(1 / (launchVolume / burstVolume)));

			return burstAltitude;
		},

		estGasVolume: function() {
			var balloon = Mod.balloons[this.model.get('brand') + ' ' + this.model.get('size')];
			var lift = parseFloat(this.model.get('lift'));
			var payload = parseFloat(this.model.get('mass'));
			var launchVolume = (lift + balloon.mass + payload) / (1.275 - 0.1785);

			return Math.round(launchVolume * 1000);
		},

		estAscentRate: function() {
			var balloon = Mod.balloons[this.model.get('brand') + ' ' + this.model.get('size')];
			var lift = parseFloat(this.model.get('lift'));
			var payload = parseFloat(this.model.get('mass'));
			var launchVolume = (lift + balloon.mass + payload) / (1.275 - 0.1785);
			var radius = Math.pow((3 * launchVolume) / (4 * Math.PI), 1 / 3);
			var area = Math.PI * Math.pow(radius, 2);
			var ascentRate = Math.sqrt((2 * lift * 9.81) / (1.275 * area * balloon.drag));

			return ascentRate;
		},

		estAscentTime: function() {
			var seconds = this.estBurstAltitude() / this.estAscentRate();
			var time = new Date(seconds * 1000);

			return time;
		},

		serializeData: function() {
			var alt = this.estBurstAltitude();
			var ar = this.estAscentRate();
			var time = this.estAscentTime();
			var volume = this.estGasVolume();

			return {
				estAscentRate: ar,
				estBurstAltitude: alt,
				estAscentTime: time,
				estGasVolume: volume
			};
		},

		update: function() {
			this.render();
		},

		initialize: function(options) {}
	});

});