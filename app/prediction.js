// Create the application object if it doesn't already exist
var App = App || new Backbone.Marionette.Application();

// Create the module
App.module("Landing", function(Mod, App, Backbone, Marionette, $, _) {

	Mod.addInitializer(function(options) {
		console.log('Prediction:initialize');
		App.Applications.add(
			{
				icon: 'F',
				name: 'Forward Prediction',
				description: 'Predict the path of the balloon from the launch site',
				event: 'Prediction:StartForward'
			}, {at: 0}
		);
		App.Applications.add(
			{
				icon: 'R',
				name: 'Reverse Prediction',
				description: 'Predict the path of the balloon to the landing site',
				event: 'Prediction:StartReverse'
			}, {at: 1}
		);
	});

	App.vent.on('Prediction:Display', function() {
		// blah
	});

});