exports.config =

	files:
		javascripts:
			joinTo:
				'app.js': /^app/
				'vendor.js': /^vendor/
			order:
				before: [
					'vendor/underscore.js',
					'vendor/json2.js'
					'vendor/jquery-1.9.1.js',
					'vendor/backbone.js',
					'vendor/backon.marionette.js',
					'vendor/jquery.mobile-1.3.1.js'
				]

		stylesheets:
			joinTo:
				'app.css': /^(app|vendor)/
			order:
				before: []
				after: []

	conventions:
		assets: /assets(\/|\\)/