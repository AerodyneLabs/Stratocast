var HomeView = Backbone.View.extend({
	template: _.template($('#home').html()),

	render: function(event) {
		$(this.el).html(this.template());
		return this;
	}
});

var AboutView = Backbone.View.extend({
	template: _.template($('#about').html()),

	render: function(event) {
		$(this.el).html(this.template());
		return this;
	}
});

var AppRouter = Backbone.Router.extend({
	routes: {
		"": "home",
		"about": "about"
	},

	initialize: function() {
		$('.back').on('click', function(event) {
			window.history.back();
			return false;
		});
		this.firstPage = true;
	},

	home: function() {
		console.log('#home');
		this.changePage(new HomeView());
	},

	about: function() {
		console.log('#about');
		this.changePage(new AboutView());
	},

	changePage: function(page) {
		$(page.el).attr('data-role', 'page');
		page.render();
		$('body').append($(page.el));
		var transition = $.mobile.defaultPageTransition;
		if(this.firstPage) {
			transition = 'none';
			this.firstPage = false;
		}
		$.mobile.changePage($(page.el), {changeHash:false, transition: transition});
	}
});

$(document).ready(function() {
	console.log('Ready');
	app = new AppRouter();
	Backbone.history.start();
})