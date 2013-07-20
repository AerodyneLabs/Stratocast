App.module("Main", function(Main, App, Backbone, Marionette, $, _) {
	
	this.AppModel = Backbone.Model.extend({});
	this.AppCollection = Backbone.Collection.extend({
		model: this.AppModel
	});

	this.show = function() {
		this.appCollection = new this.AppCollection(this.options.applications);

		this.bodyView = new this.views.BodyView();
		this.applistView = new this.views.ApplistView({
			collection: this.appCollection
		});

		App.content.show(this.bodyView);
		this.bodyView.right.show(this.applistView);
	};

	this.onTemplatesLoaded = function() {
		this.show();
	};

});