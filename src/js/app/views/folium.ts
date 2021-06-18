import Backbone from "backbone"
import _ from "underscore"
import { displaySettings } from "../models/displaysettings";
import { dataStructure } from "../models/structure";
import { viewManager } from "./manager";

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
				<div class="text">
				</div>
			</div>
		</div>
		<div id="sidebar">
			<div class="belongs-to"></div>
			<div class="annotations"></div>
		</div>
		</div>`
	),

	initialize: function (options) {
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
	changeFolium: function (model) {
		this.model = model;
		this.render();
		return this;
	},
	renderBelongsTo: function () {
		const tpl = _.template(
			`<% if (f.get('texts').length == 1) { %>
				Dit folium bevat (een deel van) <a href="/tekst/<%= f.get('texts')[0] %>">tekst <%= f.get('texts')[0] %></a>.
			<% } else { %>
				Dit folium bevat (delen van) de teksten:
				<% _.each(f.get('texts'), function (t) { %>
					<a href="/tekst/<%= String(t) %>"><%= t %></a>
				<% }); %>
			<% } %>`
		)

		this.$('.belongs-to').html(tpl({ f: this.model }));
		return this;
	},
	renderNummering: function (nummering) {
		this.$('#text .text').toggleClass(
			'nummering', displaySettings.get('nummering')
		);
		if (displaySettings.get('nummering')) {
			// console.log("Nummering type", displaySettings.get('nummering-type'));
			this.$('#text .text')
				.removeClass('regel vers')
				.addClass(displaySettings.get('nummering-type'))
		}
		return this;
	},
	renderPrevious: function () {
		var idx = this.model.collection.indexOf(this.model);
		var prev = this.model.collection.at(idx - 1)
		var a = this.$('.nav .previous');
		if (prev)
			a.show().attr('href', '/folium/' + prev.id)
				.find('span').text(this.model.collection.at(idx - 1).id);
		else a.hide();
		return this;
	},
	renderNext: function () {
		var idx = this.model.collection.indexOf(this.model);
		var next = this.model.collection.at(idx + 1);
		var a = this.$('.nav .next');
		if (next)
			a.show().attr('href', '/folium/' + next.id)
				.find('span').text(this.model.collection.at(idx + 1).id);
		else a.hide();
		return this;
	},
	renderAfkortingen: function () {
		// console.log("Setting akop ", displaySettings.get('afkortingen-oplossen'))
		this.$('.text').toggleClass(
			'solve', displaySettings.get('afkortingen-oplossen')
		);
		return this;
	},
	renderAfkortingenCursive: function () {
		this.$('.text').toggleClass(
			'cursive', displaySettings.get('afkortingen-cursief')
		);
		return this;
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
		var text = this.model.get('text');
		this.$('.text').html(text);
		return this;
	},
	renderAnnotations: function () {
		var self = this.$el;
		var lines = this.$('.text l');
		var annotations = self.find('.annotations').empty();
		var overlap = false;
		var prev_bottom = 0;
		lines.each(function () {
			var line = $(this);
			var notes = $(this).find('.noteright');

			notes.each(function () {
				var note = $(this);
				var top = note.offset().top;
				var height = note.outerHeight();

				if (top < prev_bottom) {
					if(!overlap) {
						overlap = true;
						note.css('margin-left', '120px');
					} else {
						overlap = false;
						note.css('margin-left', '0px');
					}
				}

				prev_bottom = top + height;
			});
		})
		return this;
	},
	repositionAnnotations: function() {
		var self = this.$el;
		var notes = self.find('.noteright');
		notes.each(function() {
			$(this).css({top: $(this).parents("l").offset().top - self.offset().top + 12});
		});
		return this;
	},
	lineJump: function(id) {
		var ln = null
		ln = document.getElementById(id);
		if(ln) {
			$(window).scrollTop($(ln).offset().top);
		}
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
		this.renderAnnotations()
		this.$el.toggleClass()

		setTimeout(function() { this.repositionAnnotations(); }.bind(this), 10)
		if(dataStructure.get("text-linenum")) {
			setTimeout(
				this.lineJump.bind(this, dataStructure.get("text-linenum")),
				100
			)
			dataStructure.set("text-linenum", null)
		}

		hideSpinner()

		return this
	}
});
