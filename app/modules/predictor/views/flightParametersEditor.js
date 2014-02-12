App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

  Mod.views.FlightParametersEditor = Marionette.ItemView.extend({
    template: 'flightParametersEditor',
    model: Mod.FlightModel,
    tagName: 'form',
    templateHelpers: function() {
      return App.helpers;
    },
    events: {
      'click #next': 'next',
      'click #prev': 'prev',
      'change': 'change'
    },

    onShow: function() {
      // Populate form with current data
      var temp = _.clone(Mod.currentPrediction.attributes);
      console.log(App.unitSystem);
      if(App.unitSystem === 'english') {
        console.log('english conversion');
        temp.mass = parseFloat(temp.mass) * 2.20462;
        temp.lift = parseFloat(temp.lift) * 2.20462;
        temp.area = parseFloat(temp.area) * 10.7639;
      }
      Backbone.Syphon.deserialize(this, temp);
    },

    change: function() {
      // Serialize the form
      var data = Backbone.Syphon.serialize(this);
      if(App.unitSystem === 'english') {
        data.mass = parseFloat(data.mass) * 0.453592;
        data.lift = parseFloat(data.lift) * 0.453592;
        data.area = parseFloat(data.area) / 10.7639;
      }
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