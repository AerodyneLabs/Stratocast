App.module("Main", function(Main, App, Backbone, Marionette, $, _) {

  Main.Controller = Marionette.Controller.extend({

    homePage: function() {
      App.vent.trigger('HomePage:Display');
    },

    aboutPage: function() {
      App.vent.trigger('AboutPage:Display');
    },

    contactPage: function() {
      App.vent.trigger('ContactPage:Display');
    }

  });

  App.vent.on('HomePage:Display', function() {
    App.content.show(Main.bodyView);
    Main.bodyView.right.show(Main.applistView);
    Backbone.history.navigate('');
  });

  App.vent.on('AboutPage:Display', function() {
    App.content.show(new Main.views.AboutView());
    Backbone.history.navigate('about');
  });

  App.vent.on('ContactPage:Display', function() {
    Backbone.history.navigate('contact');
  });

});