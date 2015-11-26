define(['backbone', 'app/config', 'app/app', 'app/router', 'app/models/structure'],
	function (Backbone, config, App, AppRouter, dataStructure) {

	var FolioBrowser = Backbone.View.extend({
		el: '#folio-browser',
		initialize: function () {
			this.render();
		},
		render: function () {
			var self = this, w = 0;

			dataStructure.get('folio').each(function (f, idx) {
				var folium = new FoliumThumbnail({ model: f });
				self.$('.inner').append(folium.el);
				w += folium.$el.outerWidth(true);
			});

			// By default activate first one (store last user position?)
			this.$('.folium-thumbnail').first().addClass('active');

			// The selected folium has larger padding and margins,
			// so account for this
			w += this.$('.folium-thumbnail').first().outerWidth(true);
			w -= this.$('.folium-thumbnail').not('.active').first().outerWidth(true);

			// Set total width for jscrollpane
			this.$('.inner').css('width', w);

			$('<div>').text('x').addClass('close').appendTo(this.$el);

			return this;
		}
	});

	var FoliumThumbnail = Backbone.View.extend({
		className: 'folium-thumbnail',
		tmpl: '#folium-thumbnail-tmpl',
		initialize: function () {
			this.template = _.template( $(this.tmpl).html() );
			dataStructure.on('change:active-folium', this.renderActive, this);
			this.render();
		},
		renderActive: function (obj, id) {
			if (id === this.model.id)
				this.$el.addClass('active');
			else
				this.$el.removeClass('active');
		},
		render: function () {
			this.$el.html(this.template({
				image: this.model.get('image'),
				folium: this.model.id,
				index: this.model.collection.indexOf(this.model)+1
			}));
			return this;
		}
	});

	return FolioBrowser;
});