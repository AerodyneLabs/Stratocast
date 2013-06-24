exports.config =

	files:
		javascripts:
			joinTo:
				'app.js': /^app/
				'vendor.js': /^vendor/
			order:
				before: [
					'vendor/jquery-1.9.1.js',
					'vendor/underscore.js',
					'vendor/json2.js'
					'vendor/backbone.js',
					'vendor/backbone.marionette.js',
					'vendor/jqm-config.js',
					'vendor/jquery.mobile-1.3.1.js',
					'app/main.js'
				]
				after: [
				]

		stylesheets:
			joinTo:
				'app.css': /^(app|vendor)/
			order:
				before: [
					'vendor/jquery.mobile-1.3.1.css'
				]
				after: []

	conventions:
		assets: /assets(\/|\\)/

	modules:
		wrapper: false
		definition: false