import Backbone from "backbone";
import { dataStructure } from "../models/structure";

export const BaseModel = Backbone.Model.extend({
	// TODO: wordt htmlFile property op folium uit config.json
	url: function() {
		return '/docs/' + dataStructure.get('id') + "/" + this.get('htmlSource')
	},

	parse: function (html) {		
		// Just the body
		html = html.replace(/<!DOCTYPE[\s\S]+<div class="body">/mg, '<div class="body">');
		html = html.replace(/<\/body>\s<\/html>/mg, '')
		// Remove external references to prevent these from loading
		html = html.replace(/<script src="[^"]+"><\/script>/mg, '')
		html = html.replace(/<(?:img|link)\s[^>]+>/g,'')

		// Browser validator doesn't accept self closing unknown tags and
		// turns it into a block element. Expand it here with a closing tag,
		// to make it (more) predictable
		html = html.replace(/<linegroup_(start|end)\/>/g, "<linegroup_$1></linegroup_$1>")

		// TODO remove?
		Backbone.Events.trigger('folium:loaded:' + this.id, this);

		return { text: $(html).find('.right .text').html() };
	},

	getPrevious: function() {
		const index = this.collection.indexOf(this) - 1
		return (index > -1) ? this.collection.at(index) : null
	},

	getNext: function() {
		const index = this.collection.indexOf(this) + 1
		return (index <= this.collection.length) ? this.collection.at(index) : null
	},
})
