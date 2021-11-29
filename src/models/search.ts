import Backbone from "backbone"
import { config } from "../config"

const Search = Backbone.Model.extend({
  defaults: function () {
    return {
      isSearching: false,
      results: undefined,
      lastQuery: undefined
    };
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
    if (query == this.lastQuery) return // no need re-searching

    this.lastQuery = query

    this.trigger('searching')
    this.set('isSearching', true)

    const _this = this;
    const promise = $.post(config.searchURL, $.param({ q: query }), 
      function (results) {
        _this.set({
          results: results,
          isSearching: false,
        })
      }, 'json'
    ).fail(function () {
      console.error("[Search] Something went wrong while searching; check the logs");
      _this.trigger('search:error')
      _this.set({
        results: null,
        isSearching: false,
      })
    });
    return promise;
  }
});

export const search = new Search()
