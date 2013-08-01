App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

	Mod.views.FlightLocationEditor = Marionette.ItemView.extend({
		template: 'flightLocationEditor',
		model: Mod.FlightModel,
		tagName: 'form',
		events: {
			'click #next': 'next'
		},

		next: function() {
			App.vent.trigger('ForwardPrediction:Display', 2);
		}
	});

});