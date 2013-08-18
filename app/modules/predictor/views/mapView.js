App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

	Mod.views.MapView = Marionette.ItemView.extend({
		template: 'mapView',
		tagName: 'div',
		className: 'map-wrapper',
		model: Mod.FlightModel,

		initialize: function() {
			// Bind resize event to manage map size
			$(window).on('resize', this.resize);
		},

		onShow: function() {
			this.map = L.map('map').setView([42, -93], 13);
			// TODO Map attribution
			// TODO Sat layer
			// TODO Hybrid layer
			L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg',{
				attribution: 'Map data &copy;',
				maxZoom: 18,
				subdomains: '1234'
			}).addTo(this.map);
			this.resize();
		},

		resize: function() {
			// TODO bottom padding
			var mapEl = $('#map');
			mapEl.height($(window).height() - mapEl.offset().top - 10);
		},

		onClose: function() {
			// Unbind resize event
			$(window).off('resize', this.resize);
		}
	});

});