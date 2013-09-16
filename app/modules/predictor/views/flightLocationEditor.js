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

    /**
     * Go to the next step of the application
     */
    next: function() {
      App.vent.trigger('ForwardPrediction:Display', 2);
    },

    /**
     * Perform the geocode search
     */
    search: function() {
      this.geocodeLocation(this.ui.location.val());
    },

    /**
     * Allow submiting the form with the enter key
     * @param  {KeyboardEvent} e The keypress event
     */
    submitOnEnter: function(e) {
      // Was enter pressed
      if (e.keyCode == 13) {
        // Perform the search
        this.search();
        // Prevent further action
        return false;
      }
    },

    /**
     * Perform the geocode lookup
     * @param  {String} query Search string
     */
    geocodeLocation: function(query) {
      var url = 'http://open.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluub250229%2C25%3Do5-9u8ah0&location=';
      var options = '&thumbMaps=false';

      // Spin the icon for status indication
      this.ui.icon.addClass('icon-spin');

      // Perform the query with ajax
      $.ajax(url + encodeURIComponent(query) + options, {
        success: this.geocodeHandler,
        error: this.geocodeError,
        complete: this.geocodeComplete
      });
    },

    /**
     * Handle the geocode results
     * @param  {JSON} data   Geocode results
     * @param  {String} status Status string
     * @param  {jqXHR} jqXHR  Request object
     */
    geocodeHandler: function(data, status, jqXHR) {
      // Parse lat/lng from first result
      var lat = data.results[0].locations[0].latLng.lat;
      var lng = data.results[0].locations[0].latLng.lng;
      // Update map with new coordinates
      App.vent.trigger('Map:Center', lat, lng);
      // Update model with new coordinates
      this.updateModel(lat, lng);
    },

    /**
     * Handle geocode error
     * @param  {jqXHR} jqXHR  Request object
     * @param  {String} status Status string
     * @param  {String} error  Error message
     */
    geocodeError: function(jqXHR, status, error) {
      console.log("Geocode Error: " + error);
    },

    /**
     * Complete the geocode lookup
     * @param  {jqXHR} jqXHR  Request object
     * @param  {String} status Status string
     */
    geocodeComplete: function(jqXHR, status) {
      // Stop the spin animation
      this.ui.icon.removeClass('icon-spin');
    },

    /**
     * The view has been shown
     */
    onShow: function() {
      // Add event listener
      App.vent.on('Map:Click', this.setLatLon);
      // Populate with current parameters
      var lat = Mod.currentPrediction.get('latitude');
      var lng = Mod.currentPrediction.get('longitude');
      var str = Math.round(lat * 1000) / 1000 + ', ' + Math.round(lng * 1000) / 1000;
      this.ui.location.val(str);
      setTimeout(function() {
        App.vent.trigger('Map:Center', lat, lng);
      }, 500);
    },

    /**
     * The view has been closed
     */
    onClose: function() {
      // Remove event listener
      App.vent.off('Map:Click', this.setLatLon);
    },

    /**
     * Respond to map event by setting location string
     */
    setLatLon: function(e) {
      var str = Math.round(e.latlng.lat * 1000) / 1000 + ', ' + Math.round(e.latlng.lng * 1000) / 1000;
      this.ui.location.val(str);
      this.updateModel(e.latlng.lat, e.latlng.lng);
    },

    /**
     * Store the current location in the current model
     * @param  {Number} lat Current latitude
     * @param  {Number} lon Current longitude
     */
    updateModel: function(lat, lon) {
      Mod.currentPrediction.set({
        'latitude': lat,
        'longitude': lon
      });
      Mod.currentPrediction.save();
    },

    initialize: function() {
      _.bindAll(this, 'setLatLon', 'geocodeHandler', 'geocodeComplete', 'geocodeError');
    }
  });

});