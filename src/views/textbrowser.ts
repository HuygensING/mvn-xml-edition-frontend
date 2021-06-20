import Backbone from "backbone";
import _ from "underscore";
import { dataStructure } from "../models/structure";

export const TextBrowser = Backbone.View.extend({
	el: '#text-browser',
	initialize: function () {
		this.template = _.template(
			`<ul>
				<% texts.sort(function(a,b){return a.tocIndex-b.tocIndex}).each(function (t, idx) {
					%><li><a title="<%= t.get("first_line") %>" href="/tekst/<%= t.id %>/regel/<%= t.get('firstLineId') %>"><%= t.id %> <%= t.get("first_line") %></a></li><% if ((1+idx) % 5 == 0) { %></ul><ul><% } %><%
				}); %>
			</ul>`
		)

		this.render()
	},
	render: function () {
		this.$('.inner').html(
			this.template({ texts: dataStructure.get('texts') })
		);

		$('<div>')
			.addClass('close')
			.html(
				`<svg viewbox="0 0 40 40">
					<path class="close-x" d="M 10,10 L 30,30 M 30,10 L 10,30" />
				</svg>`
			)
			.appendTo(this.$el)

		return this;
	}
});
