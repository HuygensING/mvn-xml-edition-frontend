import Backbone from "backbone"
import _ from "underscore";
import { dataStructure } from "../../models/structure"
import { BaseBrowser } from "./base";

export const FolioBrowser = Backbone.View.extend({
	el: '#folio-browser',

	initialize: function () {
		_.extend(this, BaseBrowser)
		this.render()
	},

	render: function () {
		const self = this
		let w = 0

		dataStructure.get('folio').each(function (f, idx) {
			const folium = new FoliumThumbnail({ model: f })
			self.$('.inner').append(folium.el)
			w += folium.$el.outerWidth(true)
		});

		// By default activate first one (store last user position?)
		this.$('.folium-thumbnail').first().addClass('active');

		// The selected folium has larger padding and margins,
		// so account for this
		w += this.$('.folium-thumbnail').first().outerWidth(true)
		w -= this.$('.folium-thumbnail').not('.active').first().outerWidth(true)

		// Set total width for jscrollpane
		this.$('.inner').css('width', w);

		this.renderCloseButton()

		return this;
	},

	// remove: function() {

	// 	Backbone.View.prototype.remove.apply(this, arguments);
	// }
})

const FoliumThumbnail = Backbone.View.extend({
	className: 'folium-thumbnail',
	initialize: function () {
		this.template = _.template( 
			`<a href="/folium/<%= folium %>"><img src="<%= image %>">
			<div class="folium"><%= folium.replace(/\d+/,'') %></div>
			<div class="circle <%= folium.replace(/\d+/,'') %>"><%= folium.replace(/[rv]/,'') %></div></a>`
		)

		dataStructure.on('change:active-folium', this.setActive, this)

		this.render();
	},

	render: function () {
		this.$el.html(this.template({
			image: this.model.get('thumbnail'),
			folium: this.model.id,
			index: this.model.collection.indexOf(this.model)+1
		}));
		return this;
	},

	setActive: function (_obj, id) {
		if (id === this.model.id)	this.$el.addClass('active')
		else 						this.$el.removeClass('active')
	},
});

