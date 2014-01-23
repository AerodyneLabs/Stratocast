App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

  Mod.Router = Marionette.AppRouter.extend({

    appRoutes: {
      'pred/forward(/:step)': 'forwardPrediction',
      'pred/reverse(/:step)': 'reversePrediction',
      'pred/quick(/:step)': 'quickPrediction',
      'pred/results': 'predictionResults'
    }

  });

});