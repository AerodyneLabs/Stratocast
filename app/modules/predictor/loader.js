App.module("Predictor", function(Mod) {
  Mod.prefix = 'predictor';
  Mod.templatePath = 'modules/predictor/templates/';
  Mod.views = {};
  Mod.template = function(str) {
    return Mod.prefix + '-' + str;
  };
});

var dependencies = [
  'modules/predictor/models/predictionModel',
  'modules/predictor/views/mapView',
  'modules/predictor/views/balloonCalculatorView',
  'modules/predictor/views/predictionResultsView',
  'modules/predictor/views/calendarDayView',
  'modules/predictor/views/flightLocationEditor',
  'modules/predictor/views/flightParametersEditor',
  'modules/predictor/views/flightTimeEditor',
  'modules/predictor/views/flightCalendarEditor',
  'modules/predictor/views/wizardBody',
  'modules/predictor/views/leftSidebar',
  'modules/predictor/controller',
  'modules/predictor/router',
  'modules/predictor/main'
];

define(dependencies, function() {
  App.module("Predictor", function(Mod, Fleet, Backbone, Marionette, $, _) {
    Mod.addInitializer(function(options) {
      Marionette.ModuleHelper.loadModuleTemplates(App.Predictor, function() {
        Mod.init(options);
      });
    });
  });
});