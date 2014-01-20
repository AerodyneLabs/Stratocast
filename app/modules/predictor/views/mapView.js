App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

	Mod.views.MapView = Marionette.ItemView.extend({
		template: 'mapView',
		tagName: 'div',
		className: 'map-wrapper',
		model: Mod.FlightModel,
		ui: {
			map: '#map'
		},

		initialize: function() {
			// Bind events for this
			_.bindAll(this, 'resize', 'centerMap');
			// Bind resize event to manage map size
			$(window).on('resize', this.resize);
		},

		onClick: function(e) {
			App.vent.trigger('Map:Click', e);
		},

		centerMap: function(lat, lon) {
			this.map.panTo(new L.LatLng(lat, lon));
		},

		onShow: function() {
			// TODO Map attribution
			var mapLayer = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg',{
				attribution: 'Map data &copy; OpenStreetMap, Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">',
				maxZoom: 18,
				subdomains: '1234'
			});
			var satLayer = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg',{
				attribution: '<br/>Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
				maxZoom: 18,
				subdomains: '1234'
			});
			var hybLayer = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.jpg',{
				attribution: 'Map data &copy; OpenStreetMap, Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">',
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

			// Add scale
			L.control.scale().addTo(this.map);

			// Bind events
			this.map.on('click', this.onClick);
			App.vent.on('Map:Center', this.centerMap);
		},

		resize: function() {
			// TODO bottom padding
			this.ui.map.height($(window).height() - this.ui.map.offset().top - 10);
		},

		onClose: function() {
			// Unbind events
			$(window).off('resize', this.resize);
			this.map.off('click', this.onClick);
			App.vent.off('Map:Center', this.centerMap);
		},

		addJson: function(data) {
			var json = L.geoJson(data);
			console.log(json.getBounds());
			this.map.fitBounds(json.getBounds());
			json.addTo(this.map);
		}
	});

});