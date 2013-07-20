App.module("Main", function(Main, App, Backbone, Marionette, $, _) {
	Main.views.AppView = Marionette.ItemView.extend({
		template: 'app',
		model: Main.AppModel,
		tagName: 'li',
		className: 'media',
		events: {'click': 'appClicked'},
		appClicked: function() {
			App.vent.trigger(this.model.get('event'));
		}
	});
});