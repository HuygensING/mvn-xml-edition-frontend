define([
	'backbone',
	'app/models/structure',
	'app/config',
	'app/app',
	'app/router',
	'app/views/navigation',
	'app/views/folium',
	'app/views/text',
	'app/views/search'
	], function (Backbone,
		dataStructure,
		config,
		App,
		router,
		NavigationView, FoliumView, TextView, SearchView) {

	var AppView = Backbone.View.extend({
		initialize: function () {
			var app = this;

			$('#spinner').hide();

			if (this.options.folio) {
				this.folio = this.options.folio;
			} else {
				this.folio = dataStructure.get('folio');
			}

			if (this.options.texts) {
				this.texts = this.options.texts;
			} else {
				this.texts = dataStructure.get('texts');
			}

			this.navigation = new NavigationView({
				parent: this,
				folio: this.folio,
				texts: this.texts
			});

			// $('body').on('keyup', function (e) {
			// 	if (e.keyCode == 37) {
			// 		app.folio.setPrevious(app.folium.model);
			// 	} else if (e.keyCode == 39) {
			// 		app.folio.setNext(app.folium.model);
			// 	}
			// });
			this.render();
			this.router = router;
		},
		setFolium: function (id) {
			var model = this.folio.get(id);
			this.selected_folium = model;
			Backbone.Events.trigger('folium:select', model);
			this.showFolium();
		},
		showFolium: function () {
			this.text.$el.hide();
			this.search.$el.hide();
			this.folium.$el.show();
		},
		setText: function (id) {
			var model = this.texts.get(id);
			this.selected_text = model;
			Backbone.Events.trigger('text:select', model);
			this.showText();
		},
		showText: function () {
			this.folium.$el.hide();
			this.search.$el.hide();
			this.text.$el.show();
		},
		showSearch: function () { // navigate back
			this.folium.$el.hide();
			this.text.$el.hide();
			this.search.$el.show();
			this.search.focus();
		},
		hideSearch: function (urlBeforeSearch) {
			// if (this.router) this.router.navigate(urlBeforeSearch);
			// if (this.search) this.search.$el.hide();
		},
		render: function () {
			var self = this;
			return this;
		}
	});

	return AppView;
});