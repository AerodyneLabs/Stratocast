App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

  Mod.views.CalendarDayView = Marionette.ItemView.extend({
    template: 'calendarDayView',
    tagName: 'td',
    className: 'media',

    serializeData: function() {
      // Initialize the data JSON
      var data = {};

      // Ensure the model is defined
      if(this.model) {
        // Ensure the model has a timestamp
        if(this.model.timestamp) {
          // Create a js date object
          var time = new Date(this.model.timestamp);
          // Extract the day of month from timestamp
          this.model.dayOfMonth = time.getDate();
          // Extract the day of week from timestamp
          this.model.dayOfWeek = time.getDay();
        }

        // Convert the model to JSON
        data = this.model.toJSON();
      }

      // Return the data JSON
      return data;
    },

    attributes: function() {
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'];
      // Initialize the attribute hash
      var attr = {};
      // Add the day attribute if it exists in the model
      if(this.model.dayOfWeek) {
        attr = {
          'data-day': days[this.model.dayOfWeek]
        };
      }

      // Return the attribute hash
      return attr;
    }

  });

});