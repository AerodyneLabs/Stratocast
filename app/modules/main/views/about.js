App.module("Main", function(Main, App, Backbone, Marionette, $, _) {

  Main.views.AboutView = Marionette.CompositeView.extend({
    template: 'about',
    tagName: 'div'
  });

});