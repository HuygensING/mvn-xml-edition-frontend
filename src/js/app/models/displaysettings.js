define(['underscore', 'backbone'], function (_, Backbone) {
	var DisplaySettings = Backbone.Model.extend({
		defaults: function () {
			return {
				"afkortingen-oplossen": false,
				"afkortingen-cursief": false,
				"weergave-schrijfproces": true,
				"nummering": true,
				"nummering-type": "vers"
			};
		},
		initialize: function () {
			var _this = this;
			this.on('change', function () {
				console.log("Changed settings: ", _this.changedAttributes());
			});
		}
	});

	return new DisplaySettings();
});