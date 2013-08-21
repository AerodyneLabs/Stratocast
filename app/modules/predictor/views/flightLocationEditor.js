App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

  Mod.views.FlightLocationEditor = Marionette.ItemView.extend({
    template: 'flightLocationEditor',
    model: Mod.FlightModel,
    tagName: 'form',
    events: {
      'click #next': 'next',
      'click #search': 'search',
      'keypress': 'submitOnEnter'
    },
    ui: {
      location: '#location',
      icon: '#search-icon'
    },

    next: function() {
      App.vent.trigger('ForwardPrediction:Display', 2);
    },

    search: function() {
      this.geocodeLocation(this.ui.location.val());
    },

    submitOnEnter: function(e) {
      if(e.keyCode == 13) this.search();
    },

    geocodeLocation: function(query) {
      var url = 'http://open.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluub250229%2C25%3Do5-9u8ah0&location=';
      var options = '&thumbMaps=false';
      console.log(url + encodeURIComponent(query) + options);
      this.ui.icon.addClass('icon-spin');
      $.ajax(url + encodeURIComponent(query) + options, {
        success: this.geocodeHandler,
        error: this.geocodeError,
        complete: this.geocodeComplete
      });
    },

    geocodeHandler: function(data, status, jqXHR) {
      var lat = data.results[0].locations[0].latLng.lat;
      var lng = data.results[0].locations[0].latLng.lng;
      App.vent.trigger('Map:Center', lat, lng);
    },

    geocodeError: function(jqXHR, status, error) {
      console.log("Geocode Error: " + error);
    },

    geocodeComplete: function(jqXHR, status) {
      $('#search-icon').removeClass('icon-spin');
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