var App = App || new Backbone.Marionette.Application();

App.addRegions({
	mainRegion: "body"
});

PageLayout = Backbone.Marionette.Layout.extend({
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
var pageLayout = new PageLayout();
pageLayout.render();

App.vent.on('all', function(event, model) {
	console.log('DEBUG: Event - ' + event);
});

App.addInitializer(function(options) {
	App.mainRegion.show(pageLayout);
	App.vent.trigger('Mobile:Init');
	$.mobile.initializePage();
});

$(document).ready(function() {
	console.log('Starting Marionette...');
	App.start();
})