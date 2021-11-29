import Backbone from "backbone";
import { BaseModel } from "./base";

export const Text = BaseModel.extend({
	getHref: function() {
		return `/tekst/${this.id}`
	}
});

export const Texts = Backbone.Collection.extend({
	model: Text,

	comparator: (a, b) => a.get('tocIndex') - b.get('tocIndex'),

	initialize: function () {
		Backbone.Events.bind('text:previous', this.setPreviousText, this);
		Backbone.Events.bind('text:next', this.setNextText, this);
	},

	previous: function (model) {
		const prev = this.indexOf(model) - 1;
		if (prev >= 0)
			return this.at(prev);
	},

	next: function (model) {
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
