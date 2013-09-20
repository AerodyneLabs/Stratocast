App.module("Main", function(Main) {
  Main.prefix = 'main';
  Main.templatePath = 'modules/main/templates/';
  Main.views = {};
  Main.template = function(str) {
    return Main.prefix + '-' + str;
  };
});

var dependencies = [
  'modules/main/views/about',
  'modules/main/views/app',
  'modules/main/views/applist',
  'modules/main/views/body',
  'modules/main/controller',
  'modules/main/router',
  'modules/main/main'
];

define(dependencies, function() {
  App.module("Main", function(Main, Fleet, Backbone, Marionette, $, _) {
    Main.addInitializer(function(options) {
      Marionette.ModuleHelper.loadModuleTemplates(App.Main, function() {
        Main.init(options);
      });
    });
  });
});