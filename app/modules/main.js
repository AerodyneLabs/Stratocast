App.module("Main", function(Main) {

	App.addInitializer(function() {
		console.log('main:init');
	});

});

/*
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

// define a generic two column layout
App.ColumnLayout = Backbone.Marionette.Layout.extend({
	template: '#column-layout',
	regions: {
		left: '#col-left',
		right: '#col-right'
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

// Define a generic text view
App.TextView = Backbone.Marionette.ItemView.extend({
	template: function(ser) {
		var text = ser.text;
		return _.template(
			'<%= data.text %>',
			{text : text},
			{variable: 'data'}
		);
	},
	serializeData: function() {
		return {text: this.text};
	},
	tagName: 'p'
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

App.fixGeometry = function() {
	var winHeight = $(window).innerHeight();
	var headHeight = $('[data-role="header"]').outerHeight();
	var footHeight = $('[data-role="footer"]').outerHeight();
	var content = $('[data-role="content"]');
	var padHeight = content.outerHeight() - content.height();
	if(headHeight != null && footHeight != null) {
		var contentHeight = winHeight - headHeight - footHeight - padHeight - 14;
		content.height(contentHeight);
	}
};

$(window).bind('orientationchange resize pageshow', App.fixGeometry);

// Start the application
$(document).ready(function() {
	console.log('Main:Starting');
	App.start();
	var router = new Backbone.Marionette.AppRouter();
	Backbone.history.start();
});
*/