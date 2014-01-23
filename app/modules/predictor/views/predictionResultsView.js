App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

  Mod.views.PredictionResultsView = Marionette.ItemView.extend({
    template: 'predictionResultsView',
    tagName: 'div',
    templateHelpers: {
      convertDistance: function(data) {
        var value = data || 0.0;
        var unit = 'm';
        if(App.unitSystem === 'english') {

        } else {
          // Convert unit system
          // default is already in metric
          
          // Idealize order of magnitude
          if(Math.abs(value) >= 5000) {
            value = value / 5000;
            unit = 'km';
          }
        }
        
        return value + ' ' + unit;
      },
      convertMass: function(data) {
        var value = data || 0.0;
        var unit = 'kg';
        if(App.unitSystem === 'english') {

        } else {
          // Convert unit system
          // default is already in metric
          
          // Idealize order of magnitude
          if(value <= 1) {
            value = value * 1000;
            unit = 'g';
          }
        }

        return value + ' ' + unit;
      }
    },

    onShow: function() {},

    initialize: function(options) {
      //_.bind(this.templateHelpers.convertDistance, this.unit);
    }
  });

});