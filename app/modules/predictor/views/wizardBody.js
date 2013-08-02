App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {
  Mod.views.WizardLayout = Marionette.Layout.extend({
    template: 'wizardBody',
    tagName: 'div',
    regions: {
      title: '#title',
      progress: '#progress',
      body: '#body'
    }
  });
});