// Create the application object if it doesn't already exist
var App = App || new Backbone.Marionette.Application();

// Create the module
App.module("About", function(Mod, App, Backbone, Marionette, $, _) {

	var Router = Backbone.Marionette.AppRouter.extend({
		routes: {
			'about': 'displayAbout'
		},
		displayAbout: function() {
			console.log('Route: About');
			App.vent.trigger('About:Display');
		}
	});

	Mod.addInitializer(function(options) {
		console.log('About:initialize');
		var router = new Router();
	});

	App.vent.on('About:Display', function() {
		
	});

});