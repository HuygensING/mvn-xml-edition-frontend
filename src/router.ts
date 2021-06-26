import Backbone from "backbone";
import { config } from "./config";
import { dataStructure } from "./models/structure";
import { FoliumView } from './views/text/folium'
import { TextView } from './views/text/text'
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
		if (options && options.app) {
			this.app = options.app;
		}

		this.searchView = new SearchView();
	},

	start: function () {
		Backbone.history.start({
			pushState: true,
			// root: "/" + PROJECT_ID + "/"
			root: '/'
		})

		return this
	},

	// show: function (route) {
	// 	if (route === 'show_search') return this

	// 	new this.view(this.query)
	// 	console.log('showing')
	// 	this.query = {}; // clear for next view.

	// 	return this
	// },

	show_home: function () {
		this.show_folium('1r')
	},

	show_folium: function (id, num) {
		dataStructure.set('active-folium', id)
		dataStructure.set('text-linenum', num)

		this.show(new FoliumView({ id }))
	},

	show_text_folium: function (id, folium) {
		dataStructure.set('active-text', id)
		dataStructure.set('text-folium', folium)

		this.show(new TextView({ id, folium }))
	},

	show_text: function (id, num) {
		dataStructure.set('active-text', id)
		dataStructure.set('text-linenum', num)

		this.show(new TextView({ id }))
	},

	show_search: function (query) {
		this.show(this.searchView)
	},

	show: function(view) {
		$(config.viewManagerRoot).html(view.$el)
		$(config.viewManagerRoot).show()
	}
});

export const router = new AppRouter()
