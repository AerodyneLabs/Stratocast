App.module("Main", function(Main, App, Backbone, Marionette, $, _) {

	this.Router = Marionette.AppRouter.extend({

		appRoutes: {
			'': 'homePage',
			'about': 'aboutPage',
			'contact': 'contactPage'
		}

	})

});