import Backbone from "backbone";
import { search } from '../models/search'
import _ from "underscore";

const results_template = _.template(
	`<%	_.each(results, function (result) { %>
		<tr>
			<td class="t"><a href="/tekst/<%= result.textNum %>">Tekst <%= result.textNum %></a></td>
			<td class="l"><a href="/folium/<%= result.folio %>/regel/<%= result.id %>">Versregel <%= result.lineNum %></a></td>
			<td class="f"><a href="/folium/<%= result.folio %>">Folium <%= result.folio %></a></td>
			<td class="description"><a href="/folium/<%= result.folio %>/regel/<%= result.id %>"><%= result.kwic[0] %></a></td></tr>
	<% }) %>`
)

export const SearchView = Backbone.View.extend({
	id: 'search-results',

	initialize: function () {
		search.on('searching', this.showSpinner, this);
		search.on('change:results', () => { this.renderResults() }, this);
		search.on('search:error', () => { this.renderFailure('Er is een fout opgetreden bij het zoeken') }, this);

		this.render()

		const q = window.location.search.replace('?q=', '');
		if (q) search.search(decodeURIComponent(q))
	},

	render: function () {
		this.$el.html(
			`<div class="spinner"><img src="/static/img/ajax-loader.gif"> Aan het zoeken...</div>
			<div class="results">
				<div class="number-of-results"><span class="num"></span> resultaten</div>
			</div>
			<table class="results"></table>
			<p class="no-search">Geen zoekopdracht opgegeven.</p>
			<p class="error"></p>`
		)

		// by default only show "Not searched yet" message
		this.$('.error, .results, .spinner').hide()

		if (search.get('isSearching')) {
			this.showSpinner()
		} else if (search.get('results') === undefined) {
			this.$('.number-of-results').hide()
			this.$('.no-search').show()
		}

		return this
	},

	focus: function () {
		this.$('input').focus();
	},

	showSpinner: function () {
		console.log('show spinner')
		this.$('.no-search, .results, .error').hide();
		this.$('.spinner').show();
	},

	hideSpinner: function () {
		console.log('hide spinner')
		this.$('.spinner').hide();
	},

	renderFailure: function (x) {
		this.$('.spinner, .results, .no-search').hide();
		this.$('.error').html(x)
		this.$('.error').show();
	},

	renderResults: function () {
		const results = search.get('results')
		if (results == null) return this

		this.hideSpinner()

		this.$('.no-search, .error').hide()

		this.$('div.results').show()
			.find('.number-of-results').show()
			.find('.num')
			.text(results.length)

		this.$('table.results')
			.html( results_template({ results: results }) )
			.show()

		return this
	},
})
