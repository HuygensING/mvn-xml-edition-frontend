define(['backbone', 'app/config', 'app/app', 'app/router', 'app/models/structure'],
	function (Backbone, config, App, AppRouter, dataStructure) {

	var TextBrowser = Backbone.View.extend({
		el: '#text-browser',
		tmpl: '#text-browser-tmpl',
		initialize: function () {
			this.template = _.template($(this.tmpl).html());
			this.render();
		},
		render: function () {
		  var texts = dataStructure.get('texts')
		  var columnHeight = texts.size()\3
		  console.log("texts.size()=",texts.size())
		  console.log("columnHeight=",columnHeight)
			this.$('.inner').html(
				this.template({ texts: texts, columnHeight: columnHeight})
			);
			return this;
		}
	});

	return TextBrowser;
});