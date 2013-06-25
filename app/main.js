require.config({
	paths: {
		backbone: '',
		underscore: '',
		jquery: '',
		marionette: ''
	},

	shim: {
		jquery: {
			exports: 'jQuery'
		},
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone'
		},
		marionette: {
			deps: ['jquery', 'underscore', 'backbone'],
			exports: 'Marionette'
		}
	}
});

require(['app',], function(App) {
	App.initialize();
});