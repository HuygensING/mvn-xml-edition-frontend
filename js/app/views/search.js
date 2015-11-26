define([
	'underscore',
	'backbone',
	'app/config',
	'app/views/base',
	'app/models/search'
	],
	function (_, Backbone, config, BaseView, search) {

	var SearchView = BaseView.extend({
		template: _.template( $('#search-tmpl').html() ),
		id: 'search-results',
		results_tmpl: '#results-tmpl',
		initialize: function (options) {
			BaseView.prototype.initialize.apply(this, arguments);

			this.results_template = _.template( $(this.results_tmpl).html() );
			
			search.on('searching', this.showSpinner, this);
			search.on('change', this.render, this);

			this.render();


			var q = window.location.search.replace('?q=', '');
			if (q)
				search.search(decodeURIComponent(q));
		},
		focus: function () {
			this.$('input').focus();
		},
		showSpinner: function () {
			this.$('.no-search, .results, .error').hide();
			this.$('.spinner').show();
		},
		hideSpinner: function () {
			this.$('.spinner').hide();
		},
		renderFailure: function (x) {
			this.$('.spinner, .results, .no-search').hide();
			this.$('.error').html(x)
			this.$('.error').show();
		},
		renderResults: function () {
			var results = search.get('results');

			this.hideSpinner();
			this.$('.no-search, .error').hide();
			this.$('div.results').show()
				.find('.number-of-results').show()
				.find('.num').text(results.length);
			this.$('table')
				.html( this.results_template({ results: results }) )
				.show();
			return this;
		},
		render: function () {
			this.$el.html( this.template() );

			// by default only show "Not searched yet" message
			this.$('.error, .results, .spinner').hide();

			if (search.get('isSearching')) {
				this.showSpinner();
			} else if (search.get('results') === undefined) {
				this.$('.number-of-results').hide();
				this.$('.no-search').show();
			} else {
				this.renderResults();
			}
			return this;
		}
	});

	return SearchView;
});