import { config } from './config'
import { dataStructure } from './models/structure'
import { router } from './router'

import './stylus/index.styl'
import { NavigationView } from './views/navigation'

document.addEventListener("DOMContentLoaded", async function() {
	$('#navigation').load(config.headerURL)

	try {
		await dataStructure.fetch()
	} catch (error) {
		console.error('[DataStructure] Failed to fetch model')
		return
	}

	new NavigationView()
	router.start()

	$(config.rootSelector).on('click', 'a:not([target])', function(e) {
		e.preventDefault()
		router.navigate($(e.currentTarget).attr('href'), { trigger: true })
	})

	$("#title-tag").html(dataStructure.get('title'));
	$("#title-tag").attr('href', 'http://mvn.huygens.knaw.nl/' + dataStructure.get('id'));

	$('.MVNReeks .left').html(dataStructure.get('subtitle'));
	$("#signature-tag").html(dataStructure.get('signatuur'));
	$("title").html(dataStructure.get('title'));
	$('header').css({opacity: "1"});

	$('body').prepend(`<div style="color: white; text-transform: uppercase; font-weight: bold; padding: 5px; text-align: center; transform: rotate(30deg); position: fixed; width: 285px; right: -97px; z-index: 9999; top: 18px; letter-spacing: 0.1em; background: #de0f0f; box-shadow: 0 0 12px black;`)
})

// requirejs.config({
// 	baseUrl: '/js',
// 	paths: {
// 		'jquery': '/js/lib/jquery.min',
// 		'underscore': '/js/lib/underscore-min',
// 		'backbone': '/js/lib/backbone-min',
// 		'async': '/js/lib/async.min',
// 		'domready': '/js/lib/domReady',
// 		'text': '/js/lib/text'
// 		// 'html': '../../../html'
// 	},
// 	shim: {
// 		'backbone': {
// 			deps: ['underscore', 'jquery'],
// 			exports: 'Backbone'
// 		},
// 		'underscore': {
// 			exports: '_'
// 		},
// 		'lib/jquery.mousewheel': ['jquery'],
// 		'lib/jquery.jscrollpane': ['jquery'],
// 		// backbone-fetch-cache caches model fetches,
// 		// which in this case is A-OK, because they're
// 		// all static HTML files, anyway
// 		'lib/backbone.fetch-cache.min': ['backbone']
// 	}
// });

// require([
// 	'domready',
// 	'app/models/structure',
// 	'app/app',
// 	'app/config',
// 	'lib/jquery.mousewheel',
// 	'lib/jquery.jscrollpane',
// 	'lib/backbone.fetch-cache.min'
//  ], function(domready, dataStructure, App, config) {
// 	return domready(function() {
// 		const positionSpinner = function () {
// 			$('#spinner').css({
// 				position: 'absolute',
// 				width: $(window).width() + 'px',
// 				height: ($(window).height() - $('#main').offset().top) + 'px',
// 				top: ($('#main').offset().top) + 'px',
// 				left: '0px'
// 			});
// 		}
// 		positionSpinner();
// 		$(window).resize(positionSpinner);
// 		$('#spinner').hide();

// 		$('#navigation').load(config.headerURL);

// 		App.run(config.rootElement);
// 		return App;
// 	});
// });
