var App = App || new Backbone.Marionette.Application();

App.module("Landing", function(Mod, App, Backbone, Marionette, $, _) {

	/*
	var Controller = Backbone.Marionette.Controller.extend({
		initialize: function(options) {
			console.log('Landing:Controller:initialize')
		}
	});
	*/

	var Router = Backbone.Marionette.AppRouter.extend({
		routes: {
			'': 'displayHome'
		},
		displayHome: function() {
			console.log('Route: Home');
			App.vent.trigger('Landing:Display');
		}
	});

	var AppView = Backbone.Marionette.ItemView.extend({
		model: App.Application,
		template: '#app-view-template',
		tagName: 'div',
		className: 'application',
		events: {'click': 'itemClicked'},
		itemClicked: function() {
			console.log('Landing:ApplicationClicked:' + this.model.get('name'));
			App.vent.trigger(this.model.get('event'));
		}
	});

	var AppsView = Backbone.Marionette.CompositeView.extend({
		itemView: AppView,
		template: '#apps-view-template',
		tagName: 'div',
		className: 'applications'
	});

	App.vent.on('Landing:Display', function() {
		var layout = new App.PageLayout({id: 'home'});
		App.mainRegion.show(layout);
		var cols = new App.ColumnLayout();
		layout.content.show(cols);
		layout.header.show(Mod.TitleView);
		cols.left.show(Mod.TextView);
		cols.right.show(Mod.ApplicationsView);
		$('#home').show();
		$.mobile.changePage('#home', {changeHash:false, transition: 'none'});
	});

	Mod.addInitializer(function(options) {
		console.log('Landing:initialize');
		//Mod.controller = new Controller();
		var router = new Router();
	});

	Mod.on('start', function(options) {
		// Create the views
		console.log('Landing:Post-Start');
		Mod.TitleView = new App.TitleView();
		Mod.TitleView.title = 'Stratocast Webtools';
		Mod.TextView = new App.TextView();
		Mod.TextView.text = 'Welcome to the Stratocast Webtools designed to help plan high-altitude weather balloon missions to near-space. The tools to the right will allow you to conduct flight predictions and change parameters to give you the best opportunity for the mission you are planning.'
		Mod.ApplicationsView = new AppsView({
			collection: App.Applications
		});
	});

});