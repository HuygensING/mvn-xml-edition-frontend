import Backbone from "backbone";
import { dataStructure } from "../models/structure";
import { Folia } from "./folia";

export const Text = Backbone.Model.extend({
	url: function() {
		return '/docs/' + dataStructure.get('id') + "/" + this.get('htmlSource')
	},

	defaults: function () {
		return { folio: new Folia() };
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

		// Backbone.Events.trigger('folium:loaded:' + this.id, this);

		return { text: $(html).find('.right .text').html() };
	},
});

export const Texts = Backbone.Collection.extend({
	model: Text,
	comparator: (a, b) => a.get('tocIndex') - b.get('tocIndex'),
	initialize: function () {
		Backbone.Events.bind('text:previous', this.setPreviousText, this);
		Backbone.Events.bind('text:next', this.setNextText, this);
	},
	previousText: function (model) {
		const prev = this.indexOf(model) - 1;
		if (prev >= 0)
			return this.at(prev);
	},
	nextText: function (model) {
		const next = this.indexOf(model) + 1;
		if (next < this.length)
			return this.at(next);
	},
	setPreviousText: function (model) {
		const prev = this.previousText(model);
		Backbone.Events.trigger('text:update', prev);
	},
	setNextText: function (model) {
		const next = this.nextText(model);
		Backbone.Events.trigger('text:update', next)
	}
});
