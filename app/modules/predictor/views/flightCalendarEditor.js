App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

	Mod.views.FlightCalendarEditor = Marionette.CompositeView.extend({
		template: 'flightCalendarEditor',
		tagName: 'div',
		id: 'calendar',
		itemView: Mod.views.CalendarDayView,
		
		appendHtml: function(compositeView, itemView, index) {
			// Default implementation
			// compositeView.$('tbody').append(itemView.el);
			if(index === 0) {
				// If first item, apply padding
			}
			if(false) {
				// If first day of week, create new row
			}
		}
	});

});