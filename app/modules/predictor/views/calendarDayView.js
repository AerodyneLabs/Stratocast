App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

	Mod.views.CalendarDayView = Marionette.ItemView.extend({
		template: 'calendarDayView',
		tagName: 'td',
		className: 'media'
	});

});