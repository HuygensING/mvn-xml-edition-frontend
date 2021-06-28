import _ from "underscore"
import { dataStructure } from "../../models/structure";
import { BaseText } from "./base"

export const FoliumView = BaseText.extend({
	collectionName: 'folio',
	modelName: 'Folium',
	className: 'folium',

	render: function () {
		// this.$el.html(
		// 	`<div id="folium-view">
		// 		<div id="folium">
		// 			<iframe style="border: 0; width: 100%; min-height: 600px"></iframe>
		// 		</div>
		// 		<div id="text">
		// 			<div class="nav">
		// 				<a href="" class="previous">&#9668; <span>1r</span></a>
		// 				<span class="folium">${this.modelName} <span class="nr">1v</span></span>
		// 				<a href="" class="next"><span>2r</span> &#9658;</a>
		// 			</div>
		// 			<div class="text">
		// 				${this.model.get('text')}
		// 			</div>
		// 		</div>
		// 	</div>`
		// )

		// this.$('#folium iframe').attr('src', this.model.get('facsimile'))
		// this.$('.folium span').text(this.model.get('id'))

		BaseText.prototype.render.apply(this)

		this.renderFolium()
		this.renderBelongsTo()

		// this.$el.toggleClass()

		if(dataStructure.get("text-linenum")) {
			setTimeout(
				this.lineJump.bind(this, dataStructure.get("text-linenum")),
				100
			)
			dataStructure.set("text-linenum", null)
		}

		return this
	},

	renderFolium: function() {
		this.$el.prepend(
			`<div id="folium">
				<iframe 
					src="${this.model.get('facsimile')}"
					style="border: 0; width: 100%; min-height: 600px"
				>
				</iframe>
			</div>`
		)
	},

	renderBelongsTo: function () {
		let tpl = ''

		const texts = this.model.get('texts')
		if (texts.length == 1) 
			tpl = `Dit folium bevat (een deel van) <a href="/tekst/${texts[0]}">tekst ${texts[0]}</a>.`
		else
			tpl = `Dit folium bevat (delen van) de teksten:<br/>${texts.map(t => ` <a href="/tekst/${t}">${t}</a> `).join('')}`

		this.$el.append(`<div class="belongs-to">${tpl}</div>`)
	},

	lineJump: function(id) {
		const ln = document.getElementById(id)
		if (ln != null) {
			$(window).scrollTop($(ln).offset().top)
		}
	},
})
