// Create the application object if it doesn't already exist
var App = App || new Backbone.Marionette.Application();

// Create the module
App.module("Ascent", function(Mod, App, Backbone, Marionette, $, _) {

	var Router = Backbone.Marionette.AppRouter.extend({
		routes: {
			'ascent': 'displayAscent'
		},
		displayAscent: function() {
			console.log('Route: Ascent');
			App.vent.trigger('Ascent:Display');
		}
	});

	Mod.addInitializer(function(options) {
		console.log('Ascent:initialize');
		App.Applications.add(
			{
				icon: 'A',
				name: 'Ascent Calculator',
				description: 'Blah blah blah',
				event: 'Ascent:Display'
			}, [{at: 2}]
		);
		var router = new Router();
	});

	App.vent.on('Ascent:Display', function() {
		
	});

});