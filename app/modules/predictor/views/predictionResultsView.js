App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

  Mod.views.PredictionResultsView = Marionette.ItemView.extend({
    template: 'predictionResultsView',
    tagName: 'div',
    templateHelpers: function() {
      return App.helpers;
    },

    onShow: function() {},

    initialize: function(options) {
      //_.bind(this.templateHelpers.convertDistance, this.unit);
      this.listenTo(App.vent, 'UnitSwitch', function(system) {
        this.render();
      });
    }
  });

});