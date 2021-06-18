import Backbone from "backbone"
import { config } from "../config"
// import $ from'jquery'

// define(['jquery', 'backbone', 'app/config', 'app/router'], function ($, Backbone, config) {

const Search = Backbone.Model.extend({
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

    const _this = this;
    const promise = $.post(config.searchURL, $.param({ q: query }), 
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

export const search = new Search()
