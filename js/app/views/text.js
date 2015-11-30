define(['jquery', 'backbone', 'app/config', 'app/models/displaysettings', 'app/models/structure', 'app/app', 'app/views/base'], function ($, Backbone, config, displaySettings, dataStructure, App, BaseView) {

	var TextView = BaseView.extend({
		template: _.template( $('#text-view-tmpl').html() ),
		folium_tmpl: '#folium-in-text-tmpl',
		initialize: function (options) {
			BaseView.prototype.initialize.apply(this, arguments);

			this.options = options;

			this.folium_template = _.template( $(this.folium_tmpl).html() );

			this.model = dataStructure.get('texts').get(options.id);
			this.model.on('change', this.render, this);
			
			displaySettings.on('change:afkortingen-oplossen',
				this.renderAfkortingen, this
			);
			displaySettings.on('change:afkortingen-cursief',
				this.renderAfkortingenCursive, this
			)
			displaySettings.on('change:weergave-schrijfproces',
				this.renderSchrijfProces, this
			)
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
			var prev = this.model.collection.previousText(this.model);
			if (prev)
				this.$('a.previous').show().attr('href', '/tekst/' + prev.id)
					.find('span').text(prev.id);
			else this.$('a.previous').hide();
			return this;
		},
		renderNext: function () {
			var next = this.model.collection.nextText(this.model);
			if (next)
				this.$('a.next').show().attr('href', '/tekst/' + next.id)
					.find('span').text(next.id);
			else this.$('a.next').hide();
			return this;
		},
		renderAnnotations: function () {
			var self = this.$el;
			var lines = this.$('.right.text l');
			console.log("Lines!", lines, this.$el.html());
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
						overlap = true;
						note.css('margin-left', '120px');
					}

					prev_bottom = top + height;
				});
			})
			return this;
		},	
		render: function () {
			this.$el.html(this.template());

			var folio = this.model.get('folio'), self = this;
			this.$('.heading .tekst span').text(this.model.get('id'));

			this.$('.folio').empty();
			_.each(this.model.get('folio'), function (f) {
				self.$('.folio').append( self.folium_template({
					folium: f.id,
					image: f.get('image'),
					text: f.get('text') || 'foo'
				}) );
			});

			this.renderAnnotations()
				.renderPrevious()
				.renderNext()
				.renderAfkortingen()
				.renderAfkortingenCursive()
				.renderSchrijfProces()
				.renderNummering();

			return this;
		}
	});

	return TextView;
});