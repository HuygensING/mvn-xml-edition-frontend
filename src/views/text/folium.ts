import Backbone from "backbone"
import _ from "underscore"
import { displaySettings } from "../../models/displaysettings";
import { dataStructure } from "../../models/structure";
import { viewManager } from "../manager";
import { BaseText } from "./base";

function showSpinner() {
	$('#spinner').css({
		display: 'grid',
		height: (window.innerHeight - $('#main').offset().top) + 'px',
		top: ($('#main').offset().top) + 'px',
		width: window.innerWidth + 'px',
	})
}

function hideSpinner() {
	$('#spinner').css({ display: 'none' })
}


export const FoliumView = Backbone.View.extend({
	template: _.template(
		`<div id="folium-view">
			<div id="folium">
				<iframe style="border: 0; width: 100%; min-height: 600px"></iframe>
			</div>
			<div id="text">
				<div class="nav">
					<a href="" class="previous">&#9668; <span>1r</span></a>
					<span class="folium">Folium <span class="nr">1v</span></span>
					<a href="" class="next"><span>2r</span> &#9658;</a>
				</div>
				<div class="text"></div>
			</div>
		</div>
		<div id="sidebar">
			<div class="belongs-to"></div>
			<div class="annotations"></div>
		</div>
		</div>`
	),

	initialize: function (options) {
		_.extend(this, BaseText)

		viewManager.register(this)

		if (options.parent) this.parent = options.parent

		if (options.id) {
			this.model = dataStructure.get('folio').get(options.id);

			// Model has been fetched, so render instantly
			if (this.model.get('text')) {
				this.render()

			// Show the spinner, fetch the model and render when done
			} else {
				showSpinner()

				// this.model.once('change', () => this.render())
				this.model
					.fetch({
						dataType: 'html',
						error: function (_model, response, _options) {
							console.log("Error fetching folium", response)
						}
					})
					.then(() => this.render())
			}
		}

		displaySettings.on('change:afkortingen-oplossen', this.renderAfkortingen, this)
		displaySettings.on('change:afkortingen-cursief', this.renderAfkortingenCursive, this)
		displaySettings.on('change:weergave-schrijfproces', this.renderSchrijfProces, this)
		displaySettings.on('change:nummering', this.renderNummering, this)
		displaySettings.on('change:nummering-type', this.renderNummering, this)
	},

	render: function () {
		this.$el.html( this.template() )

		this.$('#folium iframe').attr('src', this.model.get('facsimile'))
		this.$('.folium span').text(this.model.get('id'))

		this.renderBelongsTo()
		this.renderNummering()
		this.renderPrevious()
		this.renderNext()
		this.renderText()
		this.renderAfkortingen()
		this.renderAfkortingenCursive()
		this.renderSchrijfProces()

		setTimeout(() => this.renderAnnotations(), 0)

		this.$el.toggleClass()

		// TODO when/why is this needed?
		// setTimeout(() => this.repositionAnnotations(), 1000)


		if(dataStructure.get("text-linenum")) {
			setTimeout(
				this.lineJump.bind(this, dataStructure.get("text-linenum")),
				100
			)
			dataStructure.set("text-linenum", null)
		}

		hideSpinner()

		return this
	},

	changeFolium: function (model) {
		this.model = model;
		this.render();
		return this;
	},

	renderBelongsTo: function () {
		let tpl = ''
		const texts = this.model.get('texts')
		if (texts.length == 1) 
			tpl = `Dit folium bevat (een deel van) <a href="/tekst/${texts[0]}">tekst ${texts[0]}</a>.`
		else
			tpl = `Dit folium bevat (delen van) de teksten: ${texts.map(t => ` <a href="/tekst/${t}">${t}</a> `).join('')}`

		this.$('.belongs-to').html(tpl)
	},

	renderNummering: function (nummering) {
		const text = this.$('#text .text')

		text.toggleClass('nummering', displaySettings.get('nummering'))

		if (displaySettings.get('nummering')) {
			text
				.removeClass('regel vers')
				.addClass(displaySettings.get('nummering-type'))
		}
	},

	renderPrevious: function () {
		const idx = this.model.collection.indexOf(this.model)
		const prev = this.model.collection.at(idx - 1)
		const a = this.$('.nav .previous')

		if (prev) {
			a
				.show()
				.attr('href', '/folium/' + prev.id)
				.find('span')
				.text(this.model.collection.at(idx - 1).id);
		} else {
			a.hide()
		}
	},

	renderNext: function () {
		const idx = this.model.collection.indexOf(this.model);
		const next = this.model.collection.at(idx + 1);
		const a = this.$('.nav .next');
		if (next)
			a.show().attr('href', '/folium/' + next.id)
				.find('span').text(this.model.collection.at(idx + 1).id);
		else a.hide();
	},

	renderAfkortingen: function () {
		this.$('.text')
			.toggleClass(
				'solve', displaySettings.get('afkortingen-oplossen')
			)
	},

	renderAfkortingenCursive: function () {
		this.$('.text')
			.toggleClass(
				'cursive', displaySettings.get('afkortingen-cursief')
			)
	},

	renderSchrijfProces: function () {
		if (displaySettings.get('weergave-schrijfproces')) {
			this.$('.subst').addClass('border');
			this.$('.del').show();
			this.$('.add').addClass('green');
			this.$('.rubric').addClass('black');
		} else {
			this.$('.subst').removeClass('border');
			this.$('.del').hide();
			this.$('.add').removeClass('green');
			this.$('.rubric').removeClass('black');
		}
		return this;
	},

	renderText: function () {
		const text = this.model.get('text');
		this.$('.text').html(text);
		return this;
	},

	lineJump: function(id) {
		const ln = document.getElementById(id)
		if (ln != null) {
			$(window).scrollTop($(ln).offset().top)
		}
	},
})


	// repositionAnnotations: function() {
	// 	const self = this.$el
	// 	const notes = self.find('.noteright')
	// 	notes.each(function() {
	// 		const parents = $(this).parents("l")
	// 		const offset = parents?.offset()
	// 		if (offset == null) return
	// 		const top = offset.top - self.offset().top + 12
	// 		$(this).css({ top })
	// 	});
	// 	return this
	// },
