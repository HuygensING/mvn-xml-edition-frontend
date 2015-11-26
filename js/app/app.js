define(
	[	'underscore',
		'backbone',
		'app/config',
		'app/router',
		'app/models/structure',
		'app/models/models',
		'app/views/app'],
	function (
		_, Backbone, config, router,
		dataStructure, Models, AppView) {

	var App = {
		run: function (el) {
			var _this = this;
			var app = new AppView({ el: el });

			this.router = router.start();
			$(el).on('click', 'a:not([target])', function(e) {
				e.preventDefault();
				return router.navigate($(e.currentTarget).attr('href'), {
					trigger: true
				});
			});
			
			$('#spinner').hide();
			return this;
		}
	};

	return App;
});
