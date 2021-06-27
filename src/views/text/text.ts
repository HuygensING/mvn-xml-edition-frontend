import _ from "underscore"
import { dataStructure } from "../../models/structure"
import { BaseText } from "./base"

export const TextView = BaseText.extend({
	collectionName: 'texts',
	modelName: 'Tekst',
	className: 'tekst',

	render: function () {
		BaseText.prototype.render.apply(this)

		this.renderFacsimileThumbs()

		if(dataStructure.get("text-linenum")) {
			setTimeout(this.lineJump.bind(this, dataStructure.get("text-linenum"), "line"), 100);
			dataStructure.set("text-linenum", null);
		}

		if(dataStructure.get("text-folium")) {
			setTimeout(this.lineJump.bind(this, dataStructure.get("text-folium"), "folium"), 100);
			dataStructure.set("text-folium", null);
		}

		return this
	},

	/**
	 * Add facsimile thumbnails to the links to folia
	 */
	renderFacsimileThumbs: function() {
		this.$('.folionr a').each((index, el) => {
			const href = el.getAttribute('href')
			const foliumId = href.replace(/^folium\//, '')
			const folium = dataStructure.get('folio').get(foliumId)

			$(el).replaceWith(`
				<a class="select-folium" href="${href}">
					<img src="${folium.get('thumbnail')}" alt="${foliumId}">
					Bekijk folium ${foliumId}
				</a>
			`)
		})

		let prevElement
		this.$('.folionr').toArray().forEach((el, i) => {
			if (i !== 0 && hasOverlap(prevElement, el)) {
				const diff = prevElement.getBoundingClientRect().bottom - el.getBoundingClientRect().top
				el.style.marginTop = `${diff}px`
			}
			prevElement = el
		})
	},

	lineJump: function(id, mode) {
		let ln = null
		if(mode === "line") {
			ln = document.getElementById(id);
		} else {
			ln = document.querySelector(".folium.folium-" + id);
		}
		if(ln) {
			$(window).scrollTop($(ln).offset().top);
		}
	},
})

function hasOverlap(el1, el2) {
	const rect1 = el1.getBoundingClientRect()
	const rect2 = el2.getBoundingClientRect()

	return !(
		rect1.right < rect2.left || 
		rect1.left > rect2.right || 
		rect1.bottom < rect2.top || 
		rect1.top > rect2.bottom
	)
}
