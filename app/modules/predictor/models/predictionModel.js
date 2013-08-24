App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

	Mod.PredictionModel = Backbone.Model.extend({
		defaults: {
			'launchTime': Date.now(),
			'brand': 'Kaymont',
			'size': '800g',
			'mass': '1.5',
			'lift': '2'
		}
	});

});