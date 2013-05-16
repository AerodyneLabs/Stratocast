$(document).on("mobileinit", function() {
	// Disable jQM routing and component creation events
		// disable hash-routing
		$.mobile.hashListeningEnabled = false;
		// disable anchor control
		$.mobile.linkBindingEnabled = false;
		// disable ajax requests
		$.mobile.ajaxEnabled = false;
		// disable landing page
		//$.mobile.autoInitializePage = false;
		// we will handle caching and cleaning
		//$.mobile.page.prototype.options.domCache = false;

	// Fix compatibility issues
		// not supported by all browsers
		$.mobile.pushStateEnabled = false;
		// fix phonegap back button
		$.mobile.phonegapNavigationEnabled = true;
		// prevent datepicker conflict
		$.mobile.page.prototype.options.degradeInputs.date = true;

	// Remove page from DOM when it's being replaced
	$('div[data-role="page"]').on('pagehide', function(event, ui) {
		$(event.currentTarget).remove();
	});

	console.log('jQM Configured');
});