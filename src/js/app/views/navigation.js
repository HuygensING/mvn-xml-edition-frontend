define([
	'backbone',
	'app/config',
	'app/app',
	'app/router',
	'app/models/search',
	'app/models/displaysettings',
	'app/views/textbrowser',
	'app/views/foliobrowser'],
	function (Backbone, config, App, router, search, displaySettings, TextBrowser, FolioBrowser) {

		var NavigationView = Backbone.View.extend({
		el: '#views',
		events: {
			"click .folio-browser": "show_folio_browser",
			"click .text-browser": "show_text_browser",
			"click .search": "show_search",
			"click .view-options": "show_view_options",
			"click .search": "show_search",
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
		initialize: function () {
			if (this.options.parent)
				this.parent = this.options.parent;
			if (this.options.folio)
				this.folio = this.options.folio;
			if (this.options.texts)
				this.texts = this.options.texts;

			var self = this;
			Backbone.Events.on('folium:select', self.show_view_options.bind(self));

			this.render();
		},
		show_folio_browser: function (e) {
			this.$('#tabs li').removeClass('active')
			this.$('.folio-browser').addClass('active');
			this.showFolioBrowser();
//			router.navigate("/folium/1r", { trigger: true });

		},
		show_text_browser: function (e) {
			this.$('#tabs li').removeClass('active');
			this.$('.text-browser').addClass('active');
			this.showTextBrowser();
//			router.navigate("/tekst/1", { trigger: true });

		},
		show_search: function () {
			this.$('#tabs li').removeClass('active');
			this.$('.search').addClass('active');
			this.showSearch();
		},
		show_view_options: function (e) {
			this.$('#tabs li').removeClass('active');
			this.$('.view-options').addClass('active');
			this.showViewOptions();
		},
		show_export_options: function (e) {
			this.$('#tabs li').removeClass('active');
			this.$('.export-options').addClass('active');
			this.showExportOptions();
		},
		toggle_afkortingen: function (e) {
			$(e.currentTarget).toggleClass('active');
			var active = $(e.currentTarget).is('.active');
			displaySettings.set('afkortingen-oplossen', active);
		},
		toggle_nummering_switch: function (e) {
			$(e.currentTarget).toggleClass('active');
			var active = this.$('.nummering span.nummering').is('.active');
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
			var active = $(e.currentTarget).is('.active');
			displaySettings.set('afkortingen-cursief', active);
		},
		toggle_weergave_schrijfproces: function (e) {
			$(e.currentTarget).toggleClass('active');
			var active = $(e.currentTarget).is('.active');
			displaySettings.set('weergave-schrijfproces', active);
		},
		showFolioBrowser: function () {
			this.hideTextBrowser().hideExportOptions().hideSearch().hideViewOptions();
			this.$('li.folio-browser').addClass('active');
			this.$('#search-view').hide();
			this.$('#folio-browser').show()
				.find('.scroll-pane').jScrollPane();
			// jscrollpane requires a reinit because it can't deal
			// with two scroll panes on the same page, somehow

			return this;
		},
		hideFolioBrowser: function () {
			this.$('li.folio-browser').removeClass('active');
			this.$('#folio-browser').hide();
			return this;
		},
		showTextBrowser: function () {
			this.hideFolioBrowser().hideExportOptions().hideSearch().hideViewOptions();
			this.$('li.text-browser').addClass('active');
			this.$('#search-view').hide();
			this.$('#text-browser').show()
				.find('.scroll-pane').jScrollPane();		
			return this;
		},
		hideTextBrowser: function () {
			this.$('li.text-browser').removeClass('active');
			this.$('#text-browser').hide();
			return this;
		},
		ifEnterDoSearch: function (e) {
			if (e.which == 13) {
				this.doSearch(e);
			}
		},
		doSearch: function () {
			var searchText = this.$('#search-view input').val();
			this.showSearch();
			router.navigate('/zoeken/?q=' +  encodeURIComponent(searchText), {trigger: true});
			search.search(searchText);
		},
		showSearch: function () {
			this.hideAll();
			this.$('li.search').addClass('active');
			$('#search-view').show();
			router.navigate('/zoeken', { trigger: true });

			return this;
		},
		hideSearch: function () {
			this.$('li.search').removeClass('active');
			$('#search-view').hide();
			return this;
		},
		showExportOptions: function () {
			this.hideAll().$('#export-options').show();
			return this;
		},
		hideExportOptions: function () {
			this.$('#export-options').hide();
			return this;
		},
		showViewOptions: function () {
			this.hideFolioBrowser().hideTextBrowser().hideSearch().hideExportOptions();
			this.$('li.view-options').addClass('active');
			this.$('#view-options').show();
			console.log("Show VO", this.$('#view-options .weergave-schrijfproces').is('active'))

			return this;
		},
		hideViewOptions: function () {
			this.$('li.view-options').removeClass('active');
			this.$('#view-options').hide();
			return this;
		},
		hideAll: function () {
			this.hideFolioBrowser()
				.hideTextBrowser()
				.hideSearch()
				.hideExportOptions()
				.hideViewOptions();
			return this;
		},
		render: function () {
			this.hideViewOptions().hideTextBrowser().showFolioBrowser();

			console.log("Rendering", this.$('#view-options .weergave-schrijfproces').is('active'))
			var vo = this.$('#view-options');
			if (displaySettings.get('afkortingen-oplossen')) {
				vo.find('.afkortingen span.oplossen').addClass('active');
			}
			if (displaySettings.get('afkortingen-cursief')) {
				vo.find('.afkortingen span.cursief').addClass('active');
			}
			if (displaySettings.get('weergave-schrijfproces')) {
				vo.find('.weergave-schrijfproces').addClass('active');
				console.log("Set", this.$('#view-options .weergave-schrijfproces').is('active'))
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

			if (window.location.pathname.match('zoeken'))
				this.showSearch();
				var q = location.search.replace('?q=', '');
				if (q)
					this.$('#search-view input').val(decodeURIComponent(q));

			this.$('#folio-browser .scroll-pane').jScrollPane();
			console.log("Rendered", this.$('#view-options .weergave-schrijfproces').is('active'))

			return this;
		}
	});

	return NavigationView;
});