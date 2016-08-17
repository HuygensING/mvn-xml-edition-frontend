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
			this.$('.inner').html(
				this.template({ texts: dataStructure.get('texts') })
			);
			return this;
		}
	});

	return TextBrowser;
});