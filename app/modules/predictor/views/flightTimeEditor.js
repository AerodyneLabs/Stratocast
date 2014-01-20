App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

  Mod.views.FlightTimeEditor = Marionette.ItemView.extend({
    template: 'flightTimeEditor',
    model: Mod.FlightModel,
    tagName: 'form',
    events: {
      'click #next': 'next',
      'click #prev': 'prev'
    },

    onShow: function() {
      // Populate form with current data
      var data = {};
      var params = Mod.currentPrediction.attributes;
      if(params) {
        if(params.time) {
          var date = new Date(params.time);
          // TODO Zero padding
          data.date = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
          data.time = date.getHours() + ":" + date.getMinutes();
        }
      }
      Backbone.Syphon.deserialize(this, data);
    },

    next: function() {
      // Serialize the form
      var data = Backbone.Syphon.serialize(this);
      // Store the data in the current model
      if(data.date) {
        if(data.time) {
          var timeString = data.date + " " + data.time;
          var timestamp = Date.parse(timeString);
          console.log(timeString + " - " + timestamp);
          if(isNaN(timestamp) === false) Mod.currentPrediction.set({'time': timestamp});
        }
      }
      // Save the model
      Mod.currentPrediction.save();
      
      // Go to the next step
      App.vent.trigger('ForwardPrediction:Display', 4);
    },

    prev: function() {
      App.vent.trigger('ForwardPrediction:Display', 2);
    }
  });

});