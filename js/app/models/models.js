define(['backbone', 'app/config'], function (Backbone, config) {
	var Models = {};
	// var App = require('/js/app/app');
	// console.log(App)

	Models.Folium = Backbone.Model.extend({
		defaults: {
			'text': undefined
		},
		// TODO: wordt htmlFile property op folium uit config.json
		url: function () { return '/docs/' + PROJECT_ID + "/" + this.get('htmlSource'); },
		initialize: function () {
			var id = parseInt(this.id) < 10 ? '0' + this.id : this.id; // 01, 02, 03
			this.set('image', config.urlPrefix + 'images/reduced/f' + id + '_small.jpg');
			this.fetch({
				dataType: 'html',
				error: function (model, response, options) {
					console.log("Error fetching folium", response)
				}
			});
		},
		parse: function (html) {		
			// Just the body
			html = html.replace(/<!DOCTYPE[\s\S]+<div class="body">/mg, '<div class="body">');
			html = html.replace(/<\/body>\s<\/html>/mg, '');
			// Remove external references to prevent these from loading
			html = html.replace(/<script src="[^"]+"><\/script>/mg, '');
			html = html.replace(/<(?:img|link)\s[^>]+>/g,'');

			Backbone.Events.trigger('folium:loaded:' + this.id, this);
			return { text: $(html).find('.right .text').html() };
		},
		lineNum: function(textId) {
			var parsedHtml = $(this.get('text'));
			var firstLine = parsedHtml.find(".textnum > a").filter(function(i, el) {
				return textId === $(el).text();
			}).map(function(i, el) {
				return $(el).parent().nextAll("l")[0];
			}).toArray()[0];
			return $(firstLine).attr("id");
		}
	});

	Models.Folio = Backbone.Collection.extend({ // should rename this Folia, or better: Pages
		model: Models.Folium,
		setPrevious: function (m) {
			var prev = this.indexOf(m) - 1;
			if (prev >= 0)
				this.setActive( this.at(prev) );
		},
		setNext: function (m) {
			var next = this.indexOf(m) + 1;
			if (next < this.length )
				this.setActive( this.at(next) );
		},
		setActive: function (m) {
			this.active = m;
			Backbone.Events.trigger('folium:select', m);
		}
	});

	Models.Text = Backbone.Model.extend({
		defaults: function () {
			return { folio: new Models.Folio() };
		}
	});

	Models.Texts = Backbone.Collection.extend({
		model: Models.Text,
		comparator: function(a, b) {
			var partsA = a.get("id").split(".");
			var partsB = b.get("id").split(".");
			var valA = (parseInt(partsA[0]) * 100) + (parseInt(partsA[1] || 0));
			var valB = (parseInt(partsB[0]) * 100) + (parseInt(partsB[1] || 0));
			return valA < valB ? -1 : 1;
		},
		initialize: function () {
			Backbone.Events.bind('text:previous', this.setPreviousText, this);
			Backbone.Events.bind('text:next', this.setNextText, this);
		},
		previousText: function (model) {
			var prev = this.indexOf(model) - 1;
			if (prev >= 0)
				return this.at(prev);
		},
		nextText: function (model) {
			var next = this.indexOf(model) + 1;
			if (next < this.length)
				return this.at(next);
		},
		setPreviousText: function (model) {
			var prev = this.previousText(model);
			Backbone.Events.trigger('text:update', prev);
		},
		setNextText: function (model) {
			var next = this.nextText(model);
			Backbone.Events.trigger('text:update', next)
		}
	});

	return Models;
});