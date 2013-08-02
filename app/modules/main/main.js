App.module("Main", function(Main, App, Backbone, Marionette, $, _) {

  Main.init = function(options) {
    Main.controller = new Main.Controller();
    Main.router = new Main.Router({
      controller: Main.controller
    });

    // Create models and collections
    this.AppModel = Backbone.Model.extend({});
    this.AppCollection = Backbone.Collection.extend({
      model: this.AppModel
    });
    this.appCollection = new this.AppCollection(options.applications);

    // Create views
    this.bodyView = new this.views.BodyView();
    this.applistView = new this.views.ApplistView({
      collection: this.appCollection
    });

    Backbone.history.start();
  };

});