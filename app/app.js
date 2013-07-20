// File: app.js
require.config({
	paths: {
		underscore: 'lib/underscore',
		jquery: 'lib/jquery-1.9.1',
		bootstrap: 'lib/bootstrap',
		backbone: 'lib/backbone',
		marionette: 'lib/backbone.marionette',
		handlebars: 'lib/handlebars',
		modulehelper: 'modules/modulehelper'
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
		},
		modulehelper: {
			deps: ['marionette']
		}
	}
});

require(['marionette', 'bootstrap', 'handlebars', 'modulehelper'], function(Marionette) {
	// Define the applications available
	var options = {
		applications: [
			{
				title: 'Forward Prediction',
				description: 'Run a detailed prediction from launch to landing.',
				icon: 'favicon.ico',
				event: 'ForwardPrediction:Display'
			}
		]
	};

	// Use handlebars instead of underscore templates
	Marionette.TemplateCache.prototype.compileTemplate = function(template) {
		return Handlebars.compile(template);
    };

	// Create Marionette Application
	window.App = new Marionette.Application();

	// Define application regions
	App.addRegions({
		header: '#header',
		content: '#content'
	});

	// Log events to console for debug
	App.vent.on('all', function(event) {
		console.log('Event: ' + event);
	});

	// Init history
	var router = new Marionette.AppRouter();
	Backbone.history.start();

	require(['modules/main/loader'], function() {
		App.start(options);
	});
});