// Create the application object if it doesn't already exist
var App = App || new Backbone.Marionette.Application();

// Create the main appliaction region
App.addRegions({
	mainRegion: "body"
});

// Define a generic page layout
App.PageLayout = Backbone.Marionette.Layout.extend({
	template: "#page-layout",
	tagName: 'div',
	attributes: {
		'data-role': 'page'
	},
	regions: {
		header: "#header",
		content: "#content",
		footer: "#footer",
		panel: "#panel"
	}
});

// Define a generic title view
App.TitleView = Backbone.Marionette.ItemView.extend({
	template: function(ser) {
		var title = ser.title;
		return _.template(
			'<%= data.title %>',
			{title : title},
			{variable: 'data'}
		);
	},
	serializeData: function() {
		return {title: this.title};
	},
	tagName: 'span'
});

// Log all events for debugging
App.vent.on('all', function(event, model) {
	console.log('Event - ' + event);
});

// Application startup
App.addInitializer(function(options) {
	App.vent.trigger('Mobile:Init');
});

App.Application = Backbone.Model.extend({});
var Applications = Backbone.Collection.extend({
	model: App.Application
});
App.Applications = new Applications();

// Start the application
$(document).ready(function() {
	console.log('Main:Starting');
	App.start();
	var router = new Backbone.Marionette.AppRouter();
	Backbone.history.start();
});