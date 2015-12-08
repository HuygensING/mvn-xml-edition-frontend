define([
	'backbone',
	'app/config',
	'app/app',
	'app/views/base',
	'app/models/structure',
	'app/models/displaysettings'],
	function (Backbone, config, App,
		BaseView, dataStructure, displaySettings) {

	var FoliumView = BaseView.extend({
		template: _.template( $('#folium-view-tmpl').html() ),
		belongs_to_tmpl: '#belongs-to-tmpl',
		initialize: function (options) {
			BaseView.prototype.initialize.apply(this, arguments);

			if (this.options.parent)
				this.parent = this.options.parent;

			if (options.id) {
				this.model = dataStructure.get('folio').get(options.id);
				var _this = this;
				if (!this.model.get('text')) {
					console.log("Waiting for text to load");
					this.model.once('change', function () {
						_this.render();  // re-render so we don't see an empty screen
					});
				}
			}

			// don't want to re-render entire view, so
			// I target specific attributes. As long as this
			// this list doesn't grow, I can live with it.
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

			this.belongs_to = _.template( $(this.belongs_to_tmpl).html() );

			if (this.model) {
				this.model.on('change', this.render, this);
				this.render();
			}
		},
		changeFolium: function (model) {
			this.model = model;
			this.render();
			return this;
		},
		renderBelongsTo: function () {
			this.$('.belongs-to').html(this.belongs_to({ f: this.model }));
			return this;
		},
		renderNummering: function (nummering) {
			this.$('#text .text').toggleClass(
				'nummering', displaySettings.get('nummering')
			);
			if (displaySettings.get('nummering')) {
				console.log("Nummering type", displaySettings.get('nummering-type'));
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
			console.log("Setting akop ", displaySettings.get('afkortingen-oplossen'))
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
			this.$el.html( this.template() );
			this.$('#folium iframe').attr('src', this.model.get('facsimile'));
			this.$('.folium span').text(this.model.get('id'));
			this.renderBelongsTo()
				.renderNummering()
				.renderPrevious()
				.renderNext()
				.renderText()
				.renderAfkortingen()
				.renderAfkortingenCursive()
				.renderSchrijfProces()
				.renderAnnotations();
			this.$el.toggleClass();

			setTimeout(function() { this.repositionAnnotations(); }.bind(this), 10);
			if(dataStructure.get("text-linenum")) {
				setTimeout(this.lineJump.bind(this, dataStructure.get("text-linenum")), 100);
				dataStructure.set("text-linenum", null);
			}
			return this;
		}
	});

	return FoliumView;
});