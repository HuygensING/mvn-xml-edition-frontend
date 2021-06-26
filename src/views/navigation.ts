import Backbone from "backbone"
import { displaySettings } from "../models/displaysettings"
import { search } from "../models/search"
import { router } from "../router"
import { FolioBrowser } from './browsers/foliobrowser'
import { TextBrowser } from './browsers/textbrowser'

export const NavigationView = Backbone.View.extend({
	el: '#views',

	events: {
		"click .folio-browser": "show_folio_browser",
		"click .text-browser": "show_text_browser",
		"click .search": "show_search",
		"click .view-options": "show_view_options",
		"click .export-options": "show_export_options",
		"click #view-options .afkortingen .oplossen": "toggle_afkortingen",
		"click #view-options .afkortingen .cursief": "toggle_afkortingen_cursief",
		"click #view-options .weergave-schrijfproces": "toggle_weergave_schrijfproces",
		"click #view-options li.nummering span.nummering": "toggle_nummering_switch",
		"click #view-options li.nummering .opties .regel": "toggle_regel_nummering",
		"click #view-options li.nummering .opties .vers": "toggle_vers_nummering",

		'keyup #search-view': 'ifEnterDoSearch',
		'click #search-view button': 'doSearch',

		'click #folio-browser .close': 'show_view_options',
		'click #text-browser .close': 'show_view_options'
	},

	initialize: function (options) {
		if (options.parent) this.parent = options.parent
		if (options.folio) this.folio = options.folio
		if (options.texts) this.texts = options.texts

		Backbone.Events.on('folium:select', this.show_view_options)

		this.render()
	},

	render: function () {
		this.hideViewOptions()
		this.hideTextBrowser()
		this.show_folio_browser()

		// console.log("Rendering", this.$('#view-options .weergave-schrijfproces').is('active'))
		const vo = this.$('#view-options');
		if (displaySettings.get('afkortingen-oplossen')) {
			vo.find('.afkortingen span.oplossen').addClass('active');
		}
		if (displaySettings.get('afkortingen-cursief')) {
			vo.find('.afkortingen span.cursief').addClass('active');
		}
		if (displaySettings.get('weergave-schrijfproces')) {
			vo.find('.weergave-schrijfproces').addClass('active');
			// console.log("Set", this.$('#view-options .weergave-schrijfproces').is('active'))
		}
		if (displaySettings.get('nummering')) {
			vo.find('li span.nummering').addClass('active');
		}
		if (displaySettings.get('nummering-type') == 'regel') {
			vo.find('li.nummering .opties .vers').removeClass('active');
			vo.find('li.nummering .opties .regel').addClass('active');
		} else if (displaySettings.get('nummering-type') == 'vers') {
			vo.find('li.nummering .opties .regel').removeClass('active');
			vo.find('li.nummering .opties .vers').addClass('active');
		}

		this.foliobrowser = new FolioBrowser({
			collection: this.folio
		});
		this.textbrowser = new TextBrowser({
			collection: this.texts
		});

		// const search = new SearchView();
		// this.$('#search-view .results').append(search.$el)
		// console.log(search.$el)

		if (window.location.pathname.match('zoeken')) this.show_search()

		const q = location.search.replace('?q=', '');
		if (q) {
			this.$('#search-view input').val(decodeURIComponent(q));
		}

		// this.$('#folio-browser .scroll-pane').jScrollPane();
		// console.log("Rendered", this.$('#view-options .weergave-schrijfproces').is('active'))
		return this;
	},

	// TABS

		// FOLIO BROWSER
	show_folio_browser: function (e) {
		this.hideAll()

		this.$('#tabs li').removeClass('active')
		this.$('.folio-browser').addClass('active')
		this.$('#folio-browser').show()
	},

	hideFolioBrowser: function () {
		this.$('li.folio-browser').removeClass('active');
		this.$('#folio-browser').hide();
	},
		// /FOLIO BROWSER

		// TEXT BROWSER
	show_text_browser: function (e) {
		this.hideAll()
		this.$('#tabs li').removeClass('active')
		this.$('.text-browser').addClass('active')
		this.$('#text-browser').show()
	},

	hideTextBrowser: function () {
		this.$('li.text-browser').removeClass('active')
		this.$('#text-browser').hide()
	},
		// /TEXT BROWSER

	show_search: function () {
		this.hideAll()
		this.$('#tabs li').removeClass('active')
		this.$('li.search').addClass('active')
		$('#search-view').show()
		router.navigate('/zoeken', { trigger: true })
	},

	hideSearch: function () {
		this.$('li.search').removeClass('active')
		$('#search-view').hide()
		return this;
	},

		// VIEW OPTIONS
	show_view_options: function (e) {
		this.hideAll()
		this.$('#view-options').show()
		this.$('#tabs li').removeClass('active')
		this.$('li.view-options').addClass('active')
	},

	hideViewOptions: function () {
		this.$('li.view-options').removeClass('active')
		this.$('#view-options').hide()
	},
		// \VIEW OPTIONS

		// EXPORT OPTIONS
	show_export_options: function (e) {
		this.hideAll()
		this.$('#tabs li').removeClass('active')
		this.$('.export-options').addClass('active')
		this.$('#export-options').show()
	},

	hideExportOptions: function () {
		this.$('#export-options').hide()
	},
		// \EXPORT OPTIONS

	// /TABS

	// VIEW OPTIONS SUB
	toggle_afkortingen: function (e) {
		$(e.currentTarget).toggleClass('active');
		const active = $(e.currentTarget).is('.active');
		displaySettings.set('afkortingen-oplossen', active);
	},

	toggle_nummering_switch: function (e) {
		$(e.currentTarget).toggleClass('active');
		const active = this.$('.nummering span.nummering').is('.active');
		displaySettings.set('nummering', active);
	},

	toggle_regel_nummering: function (e) {
		$(e.currentTarget).siblings().removeClass('active');
		$(e.currentTarget).addClass('active');
		displaySettings.set('nummering-type', 'regel');
	},

	toggle_vers_nummering: function (e) {
		$(e.currentTarget).siblings().removeClass('active');
		$(e.currentTarget).addClass('active');
		displaySettings.set('nummering-type', 'vers');
	},

	toggle_afkortingen_cursief: function (e) {
		$(e.currentTarget).toggleClass('active');
		const active = $(e.currentTarget).is('.active');
		displaySettings.set('afkortingen-cursief', active);
	},

	toggle_weergave_schrijfproces: function (e) {
		$(e.currentTarget).toggleClass('active');
		const active = $(e.currentTarget).is('.active');
		displaySettings.set('weergave-schrijfproces', active);
	},
	// /VIEW OPTIONS SUB


	ifEnterDoSearch: function (e) {
		if (e.which == 13) {
			this.doSearch(e);
		}
	},

	doSearch: function () {
		const searchText = this.$('#search-view input').val();
		this.show_search();
		router.navigate('/zoeken/?q=' +  encodeURIComponent(searchText), {trigger: true});
		search.search(searchText);
	},

	hideAll: function () {
		this.hideFolioBrowser()
		this.hideTextBrowser()
		this.hideSearch()
		this.hideExportOptions()
		this.hideViewOptions()
	},
})
