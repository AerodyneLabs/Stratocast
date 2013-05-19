var App = App || new Backbone.Marionette.Application();

App.module("Name", function(Mod, App, Backbone, Marionette, $, _) {
	
	Mod.addInitializer(function(options) {
		console.log('Router starting...');
		Mod.router = new Router();
		Backbone.history.start();
	});

	var Router = Backbone.Marionette.AppRouter.extend({
		initialize: function(options) {

		},

		routes: {

		}
	});

});
