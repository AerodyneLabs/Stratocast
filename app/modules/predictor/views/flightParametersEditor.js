App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

  Mod.views.FlightParametersEditor = Marionette.ItemView.extend({
    template: 'flightParametersEditor',
    model: Mod.FlightModel,
    tagName: 'form',
    events: {
      'click #next': 'next',
      'click #prev': 'prev'
    },

    next: function() {
      App.vent.trigger('ForwardPrediction:Display', 3);
    },

    prev: function() {
      App.vent.trigger('ForwardPrediction:Display', 1);
    }
  });

});