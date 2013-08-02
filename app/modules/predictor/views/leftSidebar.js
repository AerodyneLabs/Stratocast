App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {
  Mod.views.LeftSidebarLayout = Marionette.Layout.extend({
    template: 'leftSidebar',
    tagName: 'div',
    regions: {
      sidebar: '#sidebar',
      main: '#main'
    }
  });
});