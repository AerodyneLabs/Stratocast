App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

	Mod.PredictionModel = Backbone.Model.extend({
		defaults: {
			'launchTime': Date.now(),
			'brand': 'Kaymont',
			'size': 0.6,
			'mass': 1.8,
			'lift': 3.6
		}
	});

});