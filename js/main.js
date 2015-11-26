requirejs.config({
	baseUrl: '/js',
	paths: {
		'jquery': 'http://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min',
		'underscore': 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
		'backbone': 'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
		'async': 'http://cdnjs.cloudflare.com/ajax/libs/async/1.22/async.min',
		'domready': 'http://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady',
		'text': 'http://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.5/text'
		// 'html': '../../../html'
	},
	shim: {
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'underscore': {
			exports: '_'
		},
		'lib/jquery.mousewheel': ['jquery'],
		'lib/jquery.jscrollpane': ['jquery'],
		// backbone-fetch-cache caches model fetches,
		// which in this case is A-OK, because they're
		// all static HTML files, anyway
		'lib/backbone.fetch-cache.min': ['backbone']
	}
});

require([
	'domready',
	'app/models/structure',
	'app/app',
	'app/config',
	'lib/jquery.mousewheel',
	'lib/jquery.jscrollpane',
	'lib/backbone.fetch-cache.min'
 ], function(domready, dataStructure, App, config) {
	return domready(function() {
		var positionSpinner = function () {
			$('#spinner').css({
				position: 'absolute',
				width: $(window).width() + 'px',
				height: ($(window).height() - $('#main').offset().top) + 'px',
				top: ($('#main').offset().top) + 'px',
				left: '0px'
			});
		}
		positionSpinner();
		$(window).resize(positionSpinner);
		$('#spinner').hide();

		$('#navigation').load(config.headerURL);

		App.run(config.rootElement);
		return App;
	});
});

// $(document).ready(function(){

//   $("#critical").click(function(){
//     $(".subst").addClass("border");
//     $(".del").show();
//     $(".add").addClass("green");
//   });
//   $("#notcritical").click(function(){
//     $(".subst").removeClass("border");
//     $(".del").hide();
//     $(".add").removeClass("green");
//   });

// });
