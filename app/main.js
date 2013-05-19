MyApp = new Backbone.Marionette.Application();

MyApp.addRegions({
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
		footer: "#footer"
	}
});
var pageLayout = new PageLayout();
pageLayout.render();

TitleView = Backbone.Marionette.ItemView.extend({
	template: function(serialized) {
		var title = serialized.title;
		return _.template('<%= args.title %>', {
			title: title
		}, {variable: 'args'});
	}
});

MyApp.addInitializer(function(options) {
	Backbone.history.start();
	MyApp.mainRegion.show(pageLayout);
	$.mobile.initializePage();
});

$(document).ready(function() {
	console.log('Starting Marionette...');
	MyApp.start();
})