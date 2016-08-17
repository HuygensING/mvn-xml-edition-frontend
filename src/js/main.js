requirejs.config({
	baseUrl: '/js',
	paths: {
		'jquery': '/js/lib/jquery.min',
		'underscore': '/js/lib/underscore-min',
		'backbone': '/js/lib/backbone-min',
		'async': '/js/lib/async.min',
		'domready': '/js/lib/domReady',
		'text': '/js/lib/text'
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
