App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

  Mod.views.FlightTimeEditor = Marionette.ItemView.extend({
    template: 'flightTimeEditor',
    model: Mod.FlightModel,
    tagName: 'form',
    events: {
      'click #next': 'next',
      'click #prev': 'prev'
    },
    ui: {
      runningModal: '#runningModal',
      errorModal: '#errorModal'
    },

    onShow: function() {
      // Populate form with current data
      var data = {};
      var params = Mod.currentPrediction.attributes;
      if(params) {
        if(params.time) {
          var date = new Date(params.time);
          // TODO Zero padding
          data.date = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
          data.time = date.getHours() + ":" + date.getMinutes();
        }
      }
      Backbone.Syphon.deserialize(this, data);
    },

    next: function() {
      // Serialize the form
      var data = Backbone.Syphon.serialize(this);
      // Store the data in the current model
      if(data.date) {
        if(data.time) {
          var timeString = data.date + " " + data.time;
          var timestamp = Date.parse(timeString);
          if(isNaN(timestamp) === false) Mod.currentPrediction.set({'time': timestamp});
        }
      }
      // Save the model
      Mod.currentPrediction.save();
      
      // Generate the query string
      var params = Mod.currentPrediction.attributes;
      var queryString = "loc=" + params.latitude + "," + params.longitude;
      if(params.time) queryString += "&time=" + params.time;
      queryString += "&balloon[type]=" + params.brand + " " + params.size;
      queryString += "&balloon[totalLift]=" + (parseFloat(params.mass) + parseFloat(params.lift));
      queryString += "&parachute[area]=" + params.area;
      queryString += "&parachute[drag]=" + params.drag;
      queryString += "&mass=" + params.mass;
      queryString += "&direction=" + this.type;

      // Run the prediction
      this.showRunningDialog(true);
      $.ajax("/api/prediction?" + queryString, {
        dataType: 'json',
        success: this.predictionSuccess,
        error: this.predictionError
      });
      
    },

    prev: function() {
      App.vent.trigger('ForwardPrediction:Display', 2);
    },

    predictionSuccess: function(data, status, jqXHR) {
      console.log("Prediction results: " + status);
      window.results = data;
      this.showRunningDialog(false, function() {
        App.vent.trigger('Prediction:Display', Mod.currentPrediction.attributes, data);
      });
    },

    predictionError: function(jqXHR, status, error) {
      console.log("Prediction Error: " + status);
      console.error(error);
      this.showRunningDialog(false, function() {
        this.showErrorDialog(true);
      });
    },

    showRunningDialog: function(show, next) {
      if(show) {
        this.ui.runningModal.modal('show');
      } else {
        this.ui.runningModal.modal('hide');
        if(next) {
          this.ui.runningModal.on('hidden.bs.modal', function() {
            next();
          });
        }
      }
    },

    showErrorDialog: function(show, next) {
      if(show) {
        this.ui.errorModal.modal('show');
      } else {
        this.ui.errorModal.modal('hide');
        if(next) {
          this.ui.errorModal.on('hidden.bs.modal', function() {
            next();
          });
        }
      }
    },

    initialize: function(options) {
      _.bindAll(this, 'predictionError', 'predictionSuccess');
      if(options) {
        this.type = options.type || 'forward';
      } else {
        this.type = 'forward';
      }
    }
  });

});