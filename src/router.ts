// define([
// 	'backbone',
// 	'app/config',
// 	'app/views/manager',
// 	'app/models/structure',
// 	'app/views/folium',
// 	'app/views/text',
// 	'app/views/search'
// 	], function (
// 		Backbone,
// 		config,
// 		viewManager,
// 		dataStructure,
// 		FoliumView,
// 		TextView,
// 		SearchView

import Backbone from "backbone";
import { dataStructure } from "./models/structure";
import { viewManager } from './views/manager'
import { FoliumView } from './views/folium'
import { TextView } from './views/text'
import { SearchView } from './views/search'

const AppRouter = Backbone.Router.extend({
	routes: {
		'folium/:id': 'show_folium',
		'folium/:id/regel/:num': 'show_folium',
		'tekst/:id': 'show_text',
		'tekst/:id/regel/': 'show_text',
		'tekst/:id/regel/:num': 'show_text',
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
			pushState: true,
			// root: "/" + PROJECT_ID + "/"
			root: '/'
		});
		return this
	},

	show: function () {
		viewManager.clear();
		const view = new this.view(this.query);
		viewManager.show(view);
		this.query = {}; // clear for next view.

		return this;
	},
	show_home: function () {
		this.show_folium('1r');
	},
	show_folium: function (id, num) {
		this.view = FoliumView;
		this.query = {
			id: id
		};
		// console.log("show_folium", id, num);
		dataStructure.set('active-folium', id);
		dataStructure.set('text-linenum', num);
	},
	show_text_folium: function (id, folium) {
		this.view = TextView;
		this.query = {
			id: id,
			folium: folium
		}
		// console.log("show_text_folium", id, folium);

		dataStructure.set('active-text', id);
		dataStructure.set('text-folium', folium);
	},
	show_text: function (id, num) {
		this.view = TextView;
		this.query = { id }
		dataStructure.set('active-text', id);
		dataStructure.set('text-linenum', num);
	},
	show_search: function (query) {
		this.view = SearchView;
		this.query = {};
		if (query)
			this.query = query;
	}
});

export const router = new AppRouter()
