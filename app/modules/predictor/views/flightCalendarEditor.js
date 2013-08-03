App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

  Mod.views.FlightCalendarEditor = Marionette.CompositeView.extend({
    template: 'flightCalendarEditor',
    tagName: 'div',
    id: 'calendar',
    itemView: Mod.views.CalendarDayView,
    ui: {
      row: 'tr:last',
      tbody: 'tbody'
    },

    appendHtml: function(compositeView, itemView, index) {
      // Default implementation
      // compositeView.$('tbody').append(itemView.el);
      if (index === 0) {
        // If first item, apply padding
        for(var i = 0; i < itemView.model.dayOfWeek; i++) {
          compositeView.ui.row.append('<td class="media unused"></td>');
        }
      }
      if (itemView.model.dayOfWeek === 0) {
        // If first day of week, create new row
        compositeView.ui.tbody.append('<tr></tr>');
      }
      // Append ui element
      compositeView.ui.row.append(itemView.el);
    }
  });

});