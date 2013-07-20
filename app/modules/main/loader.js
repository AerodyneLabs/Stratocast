App.module("Main", function(Main) {
	Main.prefix = 'main';
	Main.templatePath = 'modules/main/templates/'
	Main.views = {};
	Main.template = function(str) {
		return Main.prefix + '-' + str;
	};
});

var dependencies = [
	'modules/main/views/app',
	'modules/main/views/applist',
	'modules/main/views/body',
	'modules/main/controller'
];

define(dependencies, function() {
	App.module("Main", function(Main, Fleet, Backbone, Marionette, $, _) {
		App.addInitializer(function(options) {
			console.log('Main:Init');
			Marionette.ModuleHelper.loadModuleTemplates(App.Main, App.Main.show);
			Main.options = options;
		});
	});
});