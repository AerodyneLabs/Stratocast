App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

  Mod.views.FlightParametersEditor = Marionette.ItemView.extend({
    template: 'flightParametersEditor',
    model: Mod.FlightModel,
    tagName: 'form',
    events: {
      'click #next': 'next',
      'click #prev': 'prev',
      'change': 'change'
    },

    onShow: function() {
      // Populate form with current data
      Backbone.Syphon.deserialize(this, Mod.currentPrediction.attributes);
    },

    change: function() {
      // Serialize the form
      var data = Backbone.Syphon.serialize(this);
      // Store the data in the current model
      if(data.brand) Mod.currentPrediction.set({'brand':data.brand});
      if(data.size) Mod.currentPrediction.set({'size':data.size});
      if(data.mass) Mod.currentPrediction.set({'mass':data.mass});
      if(data.lift) Mod.currentPrediction.set({'lift':data.lift});
      if(data.drag) Mod.currentPrediction.set({'drag':data.drag});
      if(data.area) Mod.currentPrediction.set({'area':data.area});
      // Save the model
      Mod.currentPrediction.save();
    },

    next: function() {
      // Go to the next step
      if(this.type === 'reverse') {
        App.vent.trigger('ReversePrediction:Display', 3);
      } else {
        App.vent.trigger('ForwardPrediction:Display', 3);
      }
    },

    prev: function() {
      App.vent.trigger('ForwardPrediction:Display', 1);
    },

    initialize: function(options) {
      if(options) {
        this.type = options.type || 'forward';
      } else {
        this.type = 'forward';
      }
    }
  });

});