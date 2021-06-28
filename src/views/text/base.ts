import Backbone from "backbone"
import { displaySettings } from "../../models/displaysettings"
import { dataStructure } from "../../models/structure"

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

export const BaseText = Backbone.View.extend({
	id: 'text-container',

	initialize: function (options) {
		if (options.modelId) {
			this.model = dataStructure.get(this.collectionName).get(options.modelId);

			// Model has been fetched, so render instantly
			if (this.model.get('text')) {
				this.render()

			// Show the spinner, fetch the model and render when done
			} else {
				showSpinner()

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

		displaySettings.on('change:afkortingen-oplossen', this.toggleAfkortingen, this)
		displaySettings.on('change:afkortingen-cursief', this.toggleAfkortingenCursief, this)
		displaySettings.on('change:weergave-schrijfproces', this.toggleSchrijfProces, this)
		displaySettings.on('change:nummering change:nummering-type', this.toggleNummering, this)
	},

	remove() {
		displaySettings.off('change:afkortingen-oplossen', this.toggleAfkortingen, this)
		displaySettings.off('change:afkortingen-cursief', this.toggleAfkortingenCursief, this)
		displaySettings.off('change:weergave-schrijfproces', this.toggleSchrijfProces, this)
		displaySettings.off('change:nummering change:nummering-type', this.toggleNummering, this)

		Backbone.View.prototype.remove.apply(this)
	},

	render: function() {
		this.$el.html(
			`<div class="heading">
				<a href="" class="previous">&#9668; <span></span></a>
				<span class="tekst">${this.modelName} <span class="nr">${this.model.get('id')}</span></span>
				<a href="" class="next"><span></span> &#9658;</a>
			</div>
			<div class="text">
				${this.model.get('text')}
			</div>`
		)

		this.renderPrevious()
		this.renderNext()

		this.toggleNummering()
		this.toggleSchrijfProces()
		this.toggleAfkortingen()
		this.toggleAfkortingenCursief()

		setTimeout(() => this.renderAnnotations(), 0)

		hideSpinner()
	},

	renderPrevious: function () {
		const prev = this.model.getPrevious()

		if (prev) {
			this.$('a.previous')
				.show()
				.attr('href', prev.getHref())
				.find('span')
				.text(prev.id)
		} else {
			this.$('a.previous').hide();
		}
	},

	renderNext: function () {
		const next = this.model.getNext()

		if (next) {
			this.$('a.next')
				.show()
				.attr('href', next.getHref())
				.find('span')
				.text(next.id);
		} else {
			this.$('a.next').hide();
		}
	},


	renderAnnotations: function () {
		let overlap = false
		let prev_bottom = 0

		this.$('.noteright').each(function (i, note) {
			note = $(note)
			const top = note.offset().top
			const height = note.outerHeight()

			if (top < prev_bottom) {
				if (!overlap) {
					overlap = true;
					note.css('margin-left', '160px');
				} else {
					overlap = false;
					note.css('margin-left', '0px');
				}
			} else if (overlap) {
				overlap = false
			}

			prev_bottom = top + height;
		});
	},

	toggleAfkortingen: function () {
		this.$('.text')
			.toggleClass('solve', displaySettings.get('afkortingen-oplossen'))
	},

	toggleAfkortingenCursief: function () {
		this.$('.text')
			.toggleClass('cursive', displaySettings.get('afkortingen-cursief'))
	},

	toggleNummering: function (nummering) {
		const text = this.$('.text')

		text.toggleClass('nummering', displaySettings.get('nummering'))

		if (displaySettings.get('nummering')) {
			text
				.removeClass('regel vers')
				.addClass(displaySettings.get('nummering-type'))
		}
	},

	toggleSchrijfProces: function () {
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
	},
})
