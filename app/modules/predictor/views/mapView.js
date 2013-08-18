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
			// TODO Map attribution
			var mapLayer = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg',{
				attribution: 'Map data &copy;',
				maxZoom: 18,
				subdomains: '1234'
			});
			var satLayer = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg',{
				attribution: 'Map data &copy;',
				maxZoom: 18,
				subdomains: '1234'
			});
			var hybLayer = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.jpg',{
				attribution: 'Map data &copy;',
				maxZoom: 18,
				subdomains: '1234'
			});
			var hybGroup = L.layerGroup([satLayer, hybLayer]);
			var baseMaps = {
				"Map": mapLayer,
				"Hybrid": hybGroup
			};
			this.resize();
			this.map = L.map('map', {
				layers: [mapLayer],
				center: new L.LatLng(42, -94),
				zoom: 10
			});
			L.control.layers(baseMaps).addTo(this.map);
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