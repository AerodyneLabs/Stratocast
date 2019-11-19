App.module("Main", function(Main, App, Backbone, Marionette, $, _) {

  Main.views.BodyView = Marionette.Layout.extend({
    template: 'body',
    tagName: 'div',
    className: 'row',
    regions: {
      left: '#leftCol',
      right: '#rightCol'
    }
  });

});