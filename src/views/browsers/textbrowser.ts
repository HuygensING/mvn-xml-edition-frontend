import Backbone from "backbone";
import _ from "underscore";
import { dataStructure } from "../../models/structure"
import { BaseBrowser } from './base'

export const TextBrowser = Backbone.View.extend({
	el: '#text-browser',

	initialize: function () {
		_.extend(this, BaseBrowser)
		this.render()
	},

	render: function () {
		this.$('.inner').html(this.createHtml())

		this.renderCloseButton()

		return this
	},

	createHtml: function() {
		const texts = dataStructure.get('texts').sort((a,b) => a.tocIndex-b.tocIndex)

		const lis = texts.reduce((prev, curr) => {
			return `${prev}<li>
				<a
					title="${curr.get("first_line")}"
					href="/tekst/${curr.id}/regel/${curr.get('firstLineId')}"
				>
					${curr.id} ${curr.get("first_line")}
				</a>
			</li>`
		}, '')

		return `<ul>${lis}</ul>`
	},
})
