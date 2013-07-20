App.module("Main", function(Main, App, Backbone, Marionette, $, _) {
	Main.views.ApplistView = Marionette.CompositeView.extend({
		itemView: Main.views.AppView,
		template: 'applist',
		tagName: 'div',
		itemViewContainer: '#applist'
	});
});