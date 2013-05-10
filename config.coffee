exports.config =

	files:
		javascripts:
			joinTo:
				'app.js': /^app/
				'vendor.js': /^vendor/
			order:
				before: [
					'vendor/jquery-1.9.1.js',
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