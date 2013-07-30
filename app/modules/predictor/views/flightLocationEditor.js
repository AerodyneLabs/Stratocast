App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

	Mod.views.FlightLocationEditor = Marionette.ItemView.extend({
		template: 'flightLocationEditor',
		model: Mod.FlightModel,
		tagName: 'form'
	});

});