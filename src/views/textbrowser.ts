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
			</ul>
			<div class="close">x</div>`
		)
		this.render()
	},
	render: function () {
		this.$('.inner').html(
			this.template({ texts: dataStructure.get('texts') })
		);
		return this;
	}
});
