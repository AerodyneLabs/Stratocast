App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

  Mod.views.FlightParametersEditor = Marionette.ItemView.extend({
    template: 'flightParametersEditor',
    model: Mod.FlightModel,
    tagName: 'form',
    events: {
      'click #next': 'next',
      'click #prev': 'prev'
    },

    onShow: function() {
      // Populate form with current data
      Backbone.Syphon.deserialize(this, Mod.currentPrediction.attributes);
    },

    next: function() {
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

      // Go to the next step
      App.vent.trigger('ForwardPrediction:Display', 3);
    },

    prev: function() {
      App.vent.trigger('ForwardPrediction:Display', 1);
    }
  });

});