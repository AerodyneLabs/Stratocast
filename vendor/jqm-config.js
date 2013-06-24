$(document).on("mobileinit", function() {
	// Disable jQM routing and component creation events
	$.mobile.hashListeningEnabled = false;	// disable hash-routing
	$.mobile.linkBindingEnabled = false;	// disable anchor control
	$.mobile.ajaxEnabled = false;	// disable ajax requests

	// Fix compatibility issues
	$.mobile.pushStateEnabled = false;	// not supported by all browsers
	$.mobile.phonegapNavigationEnabled = true;	// fix phonegap back button
	$.mobile.page.prototype.options.degradeInputs.date = true;	// prevent datepicker conflict

	// Remove page from DOM when it's being replaced
	$('div[data-role="page"]').on('pagehide', function(event, ui) {
		$(event.currentTarget).remove();
	});

	console.log('jQM Configured');
});