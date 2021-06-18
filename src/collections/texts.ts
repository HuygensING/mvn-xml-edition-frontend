import Backbone from "backbone";
import { Folia } from "./folia";

export const Text = Backbone.Model.extend({
	defaults: function () {
		return { folio: new Folia() };
	}
});

export const Texts = Backbone.Collection.extend({
	model: Text,
	comparator: function(a, b) {
		const partsA = a.get("id").split(".");
		const partsB = b.get("id").split(".");
		const valA = (parseInt(partsA[0]) * 100) + (parseInt(partsA[1] || 0));
		const valB = (parseInt(partsB[0]) * 100) + (parseInt(partsB[1] || 0));
		return valA < valB ? -1 : 1;
	},
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
