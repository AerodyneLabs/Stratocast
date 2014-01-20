App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

  Mod.Controller = Marionette.Controller.extend({

    forwardPrediction: function(step) {
      App.vent.trigger('ForwardPrediction:Display', step);
    },

    reversePrediction: function(step) {
      App.vent.trigger('ReversePrediction:Display', step);
    }

  });

  App.vent.on('ForwardPrediction:Display', function(step) {
    switch (step) {
      case 2:
        Backbone.history.navigate('pred/forward/2');
        App.content.show(Mod.wizardLayout);
        Mod.wizardLayout.body.show(Mod.leftSidebarLayout);
        Mod.leftSidebarLayout.sidebar.show(new Mod.views.FlightParametersEditor());
        break;
      case 3:
        Backbone.history.navigate('pred/forward/3');
        App.content.show(Mod.wizardLayout);
        Mod.wizardLayout.body.show(Mod.leftSidebarLayout);
        Mod.leftSidebarLayout.sidebar.show(new Mod.views.FlightTimeEditor());
        Mod.leftSidebarLayout.main.show(new Mod.views.FlightCalendarEditor());
        break;
      default:
        // Step One
        Backbone.history.navigate('pred/forward/1');
        App.content.show(Mod.wizardLayout);
        Mod.wizardLayout.body.show(Mod.leftSidebarLayout);
        Mod.leftSidebarLayout.sidebar.show(new Mod.views.FlightLocationEditor());
        Mod.leftSidebarLayout.main.show(new Mod.views.MapView());
    }
  });

  App.vent.on('ReversePrediction:Display', function(step) {
    switch (step) {
      default:
      // Display page
      Backbone.history.navigate('pred/reverse/1');
    }
  });

  App.vent.on('Prediction:Display', function(params, result) {
    Backbone.history.navigate('pred/results');
    App.content.show(Mod.wizardLayout);
    Mod.wizardLayout.body.show(Mod.leftSidebarLayout);
    //Mod.leftSidebarLayout.sidebar.show(new Mod.views.FlightLocationEditor());
    var map = new Mod.views.MapView();
    Mod.leftSidebarLayout.main.show(map);
    map.addJson(result);
  });

});