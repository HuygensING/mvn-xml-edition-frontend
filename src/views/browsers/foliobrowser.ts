import Backbone from "backbone"
import _ from "underscore"
import { dataStructure } from "../../models/structure"
import { BaseBrowser } from "./base"

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
		this.$('.inner').css('width', w)

		this.renderCloseButton()

		return this
	},
})

const FoliumThumbnail = Backbone.View.extend({
	className: 'folium-thumbnail',

	initialize: function () {
		dataStructure.on('change:active-folium', this.setActive, this)
		this.render()
	},

	render: function () {
		const { id } = this.model

		// Split the folium ID in the number and an 'r' or 'v' for recto/verso
		// 2v => ['2', 'v'], 6ar => ['6a', 'r']
		const [num, rv] = id.split(/(r|v)$/)

		// Don't continue if an r or v isn't found
		if (rv == null) {
			console.error('[FoliumThumbnail] folium ID doesn\'t end with recto or verso')
			return ''
		}

		this.$el.html(
			`<a href="/folium/${id}">
				<img src="${this.model.get('thumbnail')}">
				<div class="folium">
					${rv}
				</div>
				<div class="circle ${rv}">
					${num}
				</div>
			</a>`
		)

		return this
	},

	setActive: function (_obj, id) {
		if (id === this.model.id)	this.$el.addClass('active')
		else 						this.$el.removeClass('active')
	},
})

