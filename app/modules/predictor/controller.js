App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

  Mod.Controller = Marionette.Controller.extend({

    forwardPrediction: function(step) {
      App.vent.trigger('ForwardPrediction:Display', step);
    },

    reversePrediction: function(step) {
      App.vent.trigger('ReversePrediction:Display', step);
    },

    quickPrediction: function(step) {
      App.vent.trigger('QuickPrediction:Display', step);
    },

    predictionResults: function() {
      App.vent.trigger('Prediction:Display');
    },

    balloonCalculator: function() {
      App.vent.trigger('BalloonCalculator:Display');
    }

  });

  App.vent.on('ForwardPrediction:Display', function(step) {
    switch (step) {
      case 2:
        Backbone.history.navigate('pred/forward/2');
        App.content.show(Mod.wizardLayout);
        Mod.wizardLayout.body.show(Mod.leftSidebarLayout);
        Mod.leftSidebarLayout.sidebar.show(new Mod.views.FlightParametersEditor());
        Mod.leftSidebarLayout.main.show(new Mod.views.BalloonCalculatorView({
          model: Mod.currentPrediction
        }));
        break;
      case 3:
        Backbone.history.navigate('pred/forward/3');
        App.content.show(Mod.wizardLayout);
        Mod.wizardLayout.body.show(Mod.leftSidebarLayout);
        Mod.leftSidebarLayout.sidebar.show(new Mod.views.FlightTimeEditor({type:'forward'}));
        //Mod.leftSidebarLayout.main.show(new Mod.views.FlightCalendarEditor());
        break;
      default:
        // Step One
        Backbone.history.navigate('pred/forward/1');
        App.content.show(Mod.wizardLayout);
        Mod.wizardLayout.body.show(Mod.leftSidebarLayout);
        Mod.leftSidebarLayout.sidebar.show(new Mod.views.FlightLocationEditor({type:'forward'}));
        Mod.leftSidebarLayout.main.show(new Mod.views.MapView());
    }
  });

  App.vent.on('QuickPrediction:Display', function(step) {
    switch (step) {
      case 2:
        // Set model parameters
        Mod.currentPrediction.set({
          'brand': 'Kaymont',
          'size': '800g',
          'mass': '1.5',
          'lift': '2',
          'drag': 1.5,
          'area': 0.6
        });
        Mod.currentPrediction.save();
        
        Backbone.history.navigate('pred/quick/2');
        App.content.show(Mod.wizardLayout);
        Mod.wizardLayout.body.show(Mod.leftSidebarLayout);
        Mod.leftSidebarLayout.sidebar.show(new Mod.views.FlightTimeEditor({type:'quick'}));
        //Mod.leftSidebarLayout.main.show(new Mod.views.FlightCalendarEditor());
        break;
      default:
        // Step 1
        Backbone.history.navigate('pred/quick/1');
        App.content.show(Mod.wizardLayout);
        Mod.wizardLayout.body.show(Mod.leftSidebarLayout);
        Mod.leftSidebarLayout.sidebar.show(new Mod.views.FlightLocationEditor({type:'quick'}));
        Mod.leftSidebarLayout.main.show(new Mod.views.MapView());
    }
  });

  App.vent.on('ReversePrediction:Display', function(step) {
    switch (step) {
      case 2:
        Backbone.history.navigate('pred/reverse/2');
        App.content.show(Mod.wizardLayout);
        Mod.wizardLayout.body.show(Mod.leftSidebarLayout);
        Mod.leftSidebarLayout.sidebar.show(new Mod.views.FlightParametersEditor({type:'reverse'}));
        Mod.leftSidebarLayout.main.show(new Mod.views.BalloonCalculatorView({
          model: Mod.currentPrediction
        }));
        break;
      case 3:
        Backbone.history.navigate('pred/reverse/3');
        App.content.show(Mod.wizardLayout);
        Mod.wizardLayout.body.show(Mod.leftSidebarLayout);
        Mod.leftSidebarLayout.sidebar.show(new Mod.views.FlightTimeEditor({type:'reverse'}));
        //Mod.leftSidebarLayout.main.show(new Mod.views.FlightCalendarEditor());
        break;
      default:
        // Display page
        Backbone.history.navigate('pred/reverse/1');
        App.content.show(Mod.wizardLayout);
        Mod.wizardLayout.body.show(Mod.leftSidebarLayout);
        Mod.leftSidebarLayout.sidebar.show(new Mod.views.FlightLocationEditor({type:'reverse'}));
        Mod.leftSidebarLayout.main.show(new Mod.views.MapView());
    }
  });

  App.vent.on('Prediction:Display', function(params, result) {
    Backbone.history.navigate('pred/results');
    App.content.show(Mod.wizardLayout);
    Mod.wizardLayout.body.show(Mod.leftSidebarLayout);
    var model = new Mod.PredictionModel(result);
    Mod.leftSidebarLayout.sidebar.show(new Mod.views.PredictionResultsView({model: model}));
    var map = new Mod.views.MapView();
    Mod.leftSidebarLayout.main.show(map);
    map.addJson(result);
  });

  App.vent.on('HistoricalPrediction:Display', function() {
    alert("Sorry, historical prediction will be implemented soon!");
  });

});