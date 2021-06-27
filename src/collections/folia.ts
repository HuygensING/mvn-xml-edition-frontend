import Backbone from "backbone"
import { BaseModel } from './base'

const Folium = BaseModel.extend({
	getHref: function() {
		return `/folium/${this.id}`
	},
})


export const Folia = Backbone.Collection.extend({
	model: Folium,

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
})
