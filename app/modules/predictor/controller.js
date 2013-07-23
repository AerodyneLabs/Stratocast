App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

	Mod.Controller = Marionette.Controller.extend({

		forwardPrediction: function(step) {
			App.vent.trigger('ForwardPrediction:Display', step);
		},

		reversePrediction: function(step) {
			App.vent.trigger('ReversePrediction:Display', step);
		}

	});

	App.vent.on('ForwardPrediction:Display', function(step) {
		switch(step) {
			default:
				App.content.show(Mod.wizardLayout);
				Mod.wizardLayout.body.show(Mod.leftSidebarLayout);
				Backbone.history.navigate('pred/forward/1');
		}
	});

	App.vent.on('ReversePrediction:Display', function(step) {
		switch(step) {
			default:
				// Display page
				Backbone.history.navigate('pred/reverse/1');
		}
	});

});