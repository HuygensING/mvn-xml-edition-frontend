define(['jquery', 'backbone', 'app/config', 'app/router'], function ($, Backbone, config) {
  var Search = Backbone.Model.extend({
    defaults: function () {
      return {
        isSearching: false,
        results: undefined,
        lastQuery: undefined
      };
    },
    initialize: function () {

    },
    query: function () {
      return this.get('lastQuery');
    },
    hasResults: function () {
      return this.get('results') && this.get('results').length;
    },
    noResults: function () {
      return !this.hasResults();
    },
    search: function (query) {
      if (query == this.lastQuery)
        return; // no need re-searching

      this.lastQuery = query;

      this.trigger('searching');
      this.set('isSearching', true);

      var _this = this;
      var promise = $.post(config.searchURL, $.param({ q: query }), 
        function (results) {
          _this.set('results', results)
          _this.set('isSearching', false);
        }, 'json'
      ).fail(function () {
        console.log("Something went wrong while searching; check the logs");
      });
      return promise;
    }
  });

  return new Search();
});