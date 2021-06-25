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

		this.$('.inner').html('<ul></ul>')

		this.renderList()

		this.renderCloseButton()

		return this
	},

	renderList(value) {
		value = value == null ? value : value.toLowerCase()

		const lis = this.texts
			.map(curr => {
				if (
					value == null ||
					value.length === 0 ||
					curr._filterValue.indexOf(value) > -1
				) {
					return `<li>
						<a
							title="${curr.get("first_line")}"
							href="/tekst/${curr.id}/regel/${curr.get('firstLineId')}"
						>
							${curr._value}
						</a>
					</li>`
				}
				return ''
			})
			.join('')

		this.$el.find('ul').html(lis)
	}
})
