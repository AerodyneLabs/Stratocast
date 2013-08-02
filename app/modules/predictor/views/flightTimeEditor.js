App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

  Mod.views.FlightTimeEditor = Marionette.ItemView.extend({
    template: 'flightTimeEditor',
    model: Mod.FlightModel,
    tagName: 'form',
    events: {
      'click #next': 'next',
      'click #prev': 'prev'
    },

    next: function() {
      App.vent.trigger('ForwardPrediction:Display', 4);
    },

    prev: function() {
      App.vent.trigger('ForwardPrediction:Display', 2);
    }
  });

});