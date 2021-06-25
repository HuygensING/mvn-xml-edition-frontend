import Backbone from "backbone";
import _ from "underscore";
import { dataStructure } from "../../models/structure"
import { BaseBrowser } from './base'

export const TextBrowser = Backbone.View.extend({
	el: '#text-browser',

	initialize: function () {
		_.extend(this, BaseBrowser)
		this.texts = dataStructure.get('texts')
			.map(text => {
				text._value = `${text.id} ${text.get("first_line")}`
				text._filterValue = text._value.toLowerCase()
				return text
			})
			.sort((a,b) => a.tocIndex-b.tocIndex)

		this.render()
	},

	events: {
		'keyup #text-browser-filter input': 'handleInputChange'
	},

	handleInputChange: function(ev) {
		this.renderList(ev.currentTarget.value)
	},

	render: function () {
		// Render texts filter
		$('<div id="text-browser-filter">')
			.html('<input type="text" placeholder="Filter text titels" />')
			.appendTo(this.$el)

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

	renderList(value) {
		value = value == null ? value : value.toLowerCase()

		console.log(this.texts.length)
		const lis = this.texts
			.reduce((prev, curr) => {
				if (
					value == null ||
					value.length === 0 ||
					curr._filterValue.indexOf(value) > -1
				) {
					return `${prev}<li>
						<a
							title="${curr.get("first_line")}"
							href="/tekst/${curr.id}/regel/${curr.get('firstLineId')}"
						>
							${curr._value}
						</a>
					</li>`
				}
				return prev
			}, '')

		this.$el.find('ul').html(lis)

		// Backbone.Events.trigger('reinitjsp', lis)

		// this.// this.$('#-browser').show()
		// this.// 	.find('.scroll-pane').jScrollPane();
		// console.log(this.$('.scroll-pane'))
		// console.log(this.$('ul > li').length)
		// setTimeout(() => { this.$('.scroll-pane').reinitialise()
		// }, 0);
	}
})
