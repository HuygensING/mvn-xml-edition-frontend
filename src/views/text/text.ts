import Backbone from "backbone"
import _ from "underscore"

import { dataStructure } from "../../models/structure";
import { viewManager } from "../manager";
import { displaySettings } from '../../models/displaysettings'
import { BaseText } from './base'

export const TextView = Backbone.View.extend({
	template: _.template(
		`<div id="text-view">
			<div class="heading">
				<a href="" class="previous">&#9668; <span></span></a>
				<span class="tekst">Tekst <span class="nr"></span></span>
				<a href="" class="next"><span></span> &#9658;</a>
			</div>
			<div class="folio"></div>
		</div><!-- /#text-view -->`
	),

	initialize: function (options) {
		_.extend(this, BaseText)

		viewManager.register(this);

		this.options = options;

		this.folium_template = _.template(
			`<div class="folium folium-<%- folium %>">
				<div class="left">
					<h5>Folium <%= folium %></h5>
					<a class="select-folium" href="/folium/<%= folium %>">
						<img src="<%= image %>" alt="<%= folium %>">
						Bekijk folium <%= folium %>
					</a>
				</div>
				<div class="right text">
					<%= ""+ text %>
				</div>
				<div style="clear: both;"></div>
			</div>`
		)

		this.model = dataStructure.get('texts').get(options.id);
		const promises = Promise.all(
			this.model.get('folio')
				.map(folio =>
					folio.get('text') ?
						folio.get('text') :
						folio
							.fetch({
								dataType: 'html',
								error: function (_model, response, _options) {
									console.log("Error fetching folium", response)
								}
							})
				)
		)
		promises.then(() => this.render())

		displaySettings.on('change:afkortingen-oplossen',
			this.renderAfkortingen, this
		);
		displaySettings.on('change:afkortingen-cursief',
			this.renderAfkortingenCursive, this
		);
		displaySettings.on('change:weergave-schrijfproces',
			this.renderSchrijfProces, this
		);
		displaySettings.on('change:nummering',
			this.renderNummering, this
		);
		displaySettings.on('change:nummering-type',
			this.renderNummering, this
		);

		Backbone.Events.on('text:select', function (model) {
			this.model = model;
			this.render();
		}, this);

		this.render();
	},
	// get initialize() {
	// 	return this._initialize;
	// },
	// set initialize(value) {
	// 	this._initialize = value;
	// },
	renderAfkortingen: function () {
		this.$('.right.text').toggleClass(
			'solve', displaySettings.get('afkortingen-oplossen')
		);
		return this;
	},
	renderAfkortingenCursive: function () {
		this.$('.right.text').toggleClass(
			'cursive', displaySettings.get('afkortingen-cursief')
		);
		return this;
	},
	renderSchrijfProces: function () {
		if (displaySettings.get('weergave-schrijfproces')) {
			this.$('.subst').addClass('border');
			this.$('.del').show();
			this.$('.add').addClass('green');
		} else {
			this.$('.subst').removeClass('border');
			this.$('.del').hide();
			this.$('.add').removeClass('green');
		}
		return this;
	},
	renderNummering: function () {
		this.$('.right.text').toggleClass(
			'nummering', displaySettings.get('nummering')
		);
		if (displaySettings.get('nummering')) {
			console.log("Nummering type", displaySettings.get('nummering-type'));
			this.$('.right.text')
				.removeClass('regel vers')
				.addClass(displaySettings.get('nummering-type'))
		}
		return this;
	},
	renderPrevious: function () {
		const prev = this.model.collection.previousText(this.model)

		if (prev) {
			this.$('a.previous')
				.show()
				.attr('href', '/tekst/' + prev.id)
				.find('span').text(prev.id)
		} else {
			this.$('a.previous').hide();
		}

		return this;
	},
	renderNext: function () {
		const next = this.model.collection.nextText(this.model);
		if (next)
			this.$('a.next').show().attr('href', '/tekst/' + next.id)
				.find('span').text(next.id);
		else this.$('a.next').hide();
		return this;
	},

	/**
	 * Copy of ./folium.ts:renderAnnotations
	 */

	// renderAnnotations: function () {
	// 	// const self = this.$el;
	// 	const lines = this.$('.right.text l');
	// 	// const annotations = self.find('.annotations').empty();
	// 	// const overlap = false;
	// 	let prev_margin = 0;
	// 	let prev_bottom = 0;
	// 	lines.each(function () {
	// 		// const line = $(this);
	// 		const notes = $(this).find('.noteright');

	// 		notes.each(function () {
	// 			const note = $(this);
	// 			const top = note.offset().top;
	// 			const height = note.outerHeight();
	// 			if (top < prev_bottom) {
	// 				if(prev_margin === 0) {
	// 					note.css('margin-left', '120px');
	// 					prev_margin = 120;
	// 				} else {
	// 					note.css('margin-left', '0px');
	// 					prev_margin = 0;
	// 				}
	// 			} else {
	// 				note.css('margin-left', '0px');
	// 				prev_margin = 0;
	// 			}

	// 			prev_bottom = top + height;
	// 		});
	// 	})
	// 	return this;
	// },
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
	render: function () {
		this.$el.html(this.template());

		// const folio = this.model.get('folio'), self = this;
		const self = this;
		this.$('.heading .tekst span').text(this.model.get('id'));

		this.$('.folio').empty();

		_.each(this.model.get('folio'), function (f) {
			self.$('.folio').append( self.folium_template({
				folium: f.id,
				image: f.get('thumbnail'),
				text: f.get('text') || ''
			}) );
		});

		this.renderPrevious()
		this.renderNext()
		this.renderAfkortingen()
		this.renderAfkortingenCursive()
		this.renderSchrijfProces()
		this.renderNummering();

		setTimeout(this.renderAnnotations.bind(this), 100);

		if(dataStructure.get("text-linenum")) {
			setTimeout(this.lineJump.bind(this, dataStructure.get("text-linenum"), "line"), 100);
			dataStructure.set("text-linenum", null);
		}
		if(dataStructure.get("text-folium")) {
			setTimeout(this.lineJump.bind(this, dataStructure.get("text-folium"), "folium"), 100);
			dataStructure.set("text-folium", null);
		}

		return this;
	}
});
