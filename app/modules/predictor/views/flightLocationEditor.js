App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

  Mod.views.FlightLocationEditor = Marionette.ItemView.extend({
    template: 'flightLocationEditor',
    model: Mod.FlightModel,
    tagName: 'form',
    events: {
      'click #next': 'next'
    },

    next: function() {
      App.vent.trigger('ForwardPrediction:Display', 2);
    },

    onShow: function() {
      App.vent.on('Map:Click', this.setLatLon);
    },

    onClose: function() {
      App.vent.off('Map:Click', this.setLatLon);
    },

    setLatLon: function(e) {
      var str = Math.round(e.latlng.lat*100)/100 + ', ' + Math.round(e.latlng.lng*100)/100;
      $('#location').val(str);
    }
  });

});