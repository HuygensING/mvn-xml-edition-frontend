import Backbone from "backbone"
import { dataStructure } from "../models/structure";
// import $ from'jquery'

const Folium = Backbone.Model.extend({
	defaults: {
		'text': undefined
	},

	// TODO: wordt htmlFile property op folium uit config.json
	url: function() {
		return '/docs/' + dataStructure.get('id') + "/" + this.get('htmlSource')
	},

	initialize: function () {
		// const id = parseInt(this.id) < 10 ? '0' + this.id : this.id; // 01, 02, 03
		// this.fetch({
		// 	dataType: 'html',
		// 	error: function (model, response, options) {
		// 		console.log("Error fetching folium", response)
		// 	}
		// });
	},
	parse: function (html) {		
		// Just the body
		html = html.replace(/<!DOCTYPE[\s\S]+<div class="body">/mg, '<div class="body">');
		html = html.replace(/<\/body>\s<\/html>/mg, '');
		// Remove external references to prevent these from loading
		html = html.replace(/<script src="[^"]+"><\/script>/mg, '');
		html = html.replace(/<(?:img|link)\s[^>]+>/g,'');

		Backbone.Events.trigger('folium:loaded:' + this.id, this);
		return { text: $(html).find('.right .text').html() };
	},
	lineNum: function(textId) {
		const parsedHtml = $(this.get('text'));
		const firstLine = parsedHtml.find(".textnum > a").filter(function(i, el) {
			return textId === $(el).text();
		}).map(function(i, el) {
			return $(el).parent().nextAll("l")[0];
		}).toArray()[0];
		return $(firstLine).attr("id");
	}
});


export const Folia = Backbone.Collection.extend({
	model: Folium,
	setPrevious: function (m) {
		const prev = this.indexOf(m) - 1;
		if (prev >= 0)
			this.setActive( this.at(prev) );
	},
	setNext: function (m) {
		const next = this.indexOf(m) + 1;
		if (next < this.length )
			this.setActive( this.at(next) );
	},
	setActive: function (m) {
		this.active = m;
		Backbone.Events.trigger('folium:select', m);
	}
});
