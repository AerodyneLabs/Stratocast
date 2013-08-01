App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

	Mod.views.FlightCalendarEditor = Marionette.CompositeView.extend({
		template: 'flightCalendarEditor',
		tagName: 'div',
		id: 'calendar',
		events: {
			'click #next': 'next',
			'click #prev': 'prev'
		}
	});

});