define([
	'backbone',
	'app/config',
	'app/views/manager',
	'app/models/structure',
	'app/views/folium',
	'app/views/text',
	'app/views/search'
	], function (
		Backbone,
		config,
		viewManager,
		dataStructure,
		FoliumView,
		TextView,
		SearchView
	) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			'folium/:id': 'show_folium',
			'tekst/:id': 'show_text',
			'tekst/:id/:folium': 'show_text_folium',
			'zoeken': 'show_search',
			'zoeken/': 'show_search',
			'': 'show_home'
		},
		initialize: function (options) {
			if (options && options.app)
				this.app = options.app;

			this.on('route', this.show, this);
		},
		start: function () {
			Backbone.history.start({
				pushState: true
			});
			return this;
		},

		show: function () {
			viewManager.clear();
			var view = new this.view(this.query);
			viewManager.show(view);
			this.query = {}; // clear for next view.

			return this;
		},
		show_home: function () {
			this.show_folium('1r');
		},
		show_folium: function (id) {
			this.view = FoliumView;
			this.query = {
				id: id
			};
			dataStructure.set('active-folium', id);
		},
		show_text_folium: function (id, folium) {
			this.view = TextView;
			this.query = {
				id: id,
				folium: folium
			}
			dataStructure.set('active-text', id);
		},
		show_text: function (id) {
			this.view = TextView;
			this.query = {
				id: id
			};
			dataStructure.set('active-text', id);
		},
		show_search: function (query) {
			this.view = SearchView;
			this.query = {};
			if (query)
				this.query = query;
		}
	});

	return new AppRouter();
});