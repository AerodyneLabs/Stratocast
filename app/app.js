// File: app.js
require.config({
  paths: {
    underscore: [
      '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
      'lib/underscore'
    ],
    jquery: [
      '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min',
      'lib/jquery-1.9.1'
    ],
    bootstrap: [
      '//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min',
      'lib/boostrap'
    ],
    backbone: [
      //'//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min',
      '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone',
      'lib/backbone'
    ],
    syphon: [
      '//cdnjs.cloudflare.com/ajax/libs/backbone.syphon/0.4.1/backbone.syphon.min',
      'lib/backbone.syphon.min'
    ],
    localStorage: [
      '//cdnjs.cloudflare.com/ajax/libs/backbone-localstorage.js/1.1.0/backbone.localStorage-min',
      'lib/backbone.localStorage-min'
    ],
    marionette: [
      '//cdnjs.cloudflare.com/ajax/libs/backbone.marionette/1.4.1-bundled/backbone.marionette.min',
      'lib/backbone.marionette'
    ],
    handlebars: [
      '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min',
      'lib/handlebars'
    ],
    leaflet: [
      '//cdn.leafletjs.com/leaflet-0.7.2/leaflet',
      'lib/leaflet'
    ],
    d3: [
      '//cdnjs.cloudflare.com/ajax/libs/d3/3.4.0/d3.v3.min',
      'lib/d3.min'
    ],
    modulehelper: 'modules/modulehelper'
  },

  shim: {
    underscore: {
      exports: '_'
    },
    jquery: {
      exports: 'jQuery'
    },
    bootstrap: {
      deps: ['jquery'],
      exports: 'Bootstrap'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    syphon: {
      deps: ['backbone']
    },
    localStorage: {
      deps: ['backbone']
    },
    marionette: {
      deps: ['backbone'],
      exports: 'Marionette'
    },
    leaflet: {
      exports: 'L'
    },
    d3: {
      exports: 'd3'
    },
    modulehelper: {
      deps: ['marionette']
    }
  }
});

require(['marionette', 'bootstrap', 'syphon', 'localStorage', 'handlebars', 'leaflet', 'modulehelper'], function(Marionette) {
  // Define the applications available
  var options = {
    applications: [{
      title: 'Forward Prediction',
      description: 'Run a detailed prediction to find the landing site.',
      icon: 'fa fa-play',
      event: 'ForwardPrediction:Display'
    }, {
      title: 'Reverse Prediction',
      description: 'Run a detailed prediction to find the launch site.',
      icon: 'fa fa-play',
      iconClass: 'fa-flip-horizontal',
      event: 'ReversePrediction:Display'
    }, {
      title: 'Quick Prediction',
      description: 'Run a simple prediction.',
      icon: 'fa fa-fast-forward',
      event: 'QuickPrediction:Display'
    }, {
      title: 'Balloon Calculator',
      description: 'Compare different ascent rates and burst altitudes.',
      icon: 'fa fa-wrench',
      event: 'BalloonCalculator:Display'
    }] /*{
      title: 'Historical Prediction',
      description: 'Run a prediction for a date in the past.',
      icon: 'fa fa-clock-o',
      event: 'HistoricalPrediction:Display'
    }]*/
  };

  // Use handlebars instead of underscore templates
  Marionette.TemplateCache.prototype.compileTemplate = function(template) {
    return Handlebars.compile(template);
  };

  // Create Marionette Application
  window.App = new Marionette.Application();

  // Define application regions
  App.addRegions({
    header: '#header',
    content: '#content'
  });

  // Log events to console for debug
  App.vent.on('all', function(event) {
    console.log('Event: ' + event);
  });

  require(['modules/predictor/loader'], function() {
    require(['modules/main/loader'], function() {
      App.start(options);
    });
  });
});