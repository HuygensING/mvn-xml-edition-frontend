import Backbone from "backbone";
import { dataStructure } from "./models/structure";
import { FoliumView } from './views/text/folium'
import { TextView } from './views/text/text'
import { SearchView } from './views/search'

const AppRouter = Backbone.Router.extend({
	currentView: null,

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

	initialize: function(options) {
		if (options && options.app) {
			this.app = options.app;
		}

		this.searchView = new SearchView();
	},

	start: function() {
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

	show_home: function() {
		this.show_folium('1r')
	},

	show_folium: function(modelId, num) {
		dataStructure.set('active-folium', modelId)
		dataStructure.set('text-linenum', num)

		this.show(new FoliumView({ modelId }))
	},

	show_text_folium: function(modelId, folium) {
		dataStructure.set('active-text', modelId)
		dataStructure.set('text-folium', folium)

		this.show(new TextView({ modelId, folium }))
	},

	show_text: function(modelId, num) {
		dataStructure.set('active-text', modelId)
		dataStructure.set('text-linenum', num)

		this.show(new TextView({ modelId }))
	},

	show_search: function() {
		this.show(this.searchView)
	},

	show: function(view) {
		if (this.currentView != null) this.currentView.remove()
		$('#main .view').html(view.$el)
		$('#main .view').show()
		this.currentView = view
	}
});

export const router = new AppRouter()
