// File: app.js
require.config({
	paths: {
		underscore: 'lib/underscore',
		jquery: 'lib/jquery-1.9.1',
		bootstrap: 'lib/bootstrap',
		backbone: 'lib/backbone',
		marionette: 'lib/backbone.marionette',
		handlebars: 'lib/handlebars'
	},

	shim: {
		underscore: {
			exports: '_'
		},
		jquery: {
			exports: 'jQuery'
		},
		bootstrap: {
			deps: ['jquery'],
			exports: 'Bootstrap'
		},
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		marionette: {
			deps: ['backbone'],
			exports: 'Marionette'
		}
	}
});

require(['marionette', 'bootstrap','handlebars'], function(Marionette) {
	// Create Marionette Application
	window.App = new Marionette.Application();

	// Log events to console for debug
	App.vent.on('all', function(event) {
		console.log('Event: ' + event);
	});

	require(['modules/main'], function() {
		App.vent.trigger('require');
		App.start();
	});
});