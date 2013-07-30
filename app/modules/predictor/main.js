App.module("Predictor", function(Mod, App, Backbone, Marionette, $, _) {

	Mod.init = function(options) {
		Mod.controller = new Mod.Controller();
		Mod.router = new Mod.Router({
			controller: Mod.controller
		});

		// Create models and collections
		Mod.locationEditor = new Mod.views.FlightLocationEditor();

		// Create views
		Mod.wizardLayout = new Mod.views.WizardLayout();
		Mod.leftSidebarLayout = new Mod.views.LeftSidebarLayout();
	};

});