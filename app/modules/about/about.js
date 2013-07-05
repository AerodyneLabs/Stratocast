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
		var layout = new App.PageLayout({id: 'about'});
		App.mainRegion.show(layout);
		layout.header.show(Mod.titleView);
		layout.content.show(Mod.textView);
		layout.trigger('create');
		$('#about').trigger('create').show();
		$.mobile.changePage('#about', {changeHash:false, transition: 'none'});
	});

	Mod.addInitializer(function(options) {
		console.log('About:initialize');
		var router = new Router();
		Mod.titleView = new App.TitleView();
		Mod.titleView.title = 'Stratocast Webtools';
		Mod.textView = new App.TextView();
		Mod.textView.text = 'Stratocast was developed by <strong>Aerodyne Labs</strong> and <strong>Stratostar</strong>. Initial funding was provided by <strong>Taylor University</strong>.';
	});

});