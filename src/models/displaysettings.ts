import Backbone from "backbone";

const DisplaySettings = Backbone.Model.extend({
	defaults: function () {
		return {
			"afkortingen-oplossen": false,
			"afkortingen-cursief": false,
			"weergave-schrijfproces": true,
			"nummering": true,
			"nummering-type": "vers"
		}
	},
	// initialize: function () {
	// 	const _this = this;
	// 	this.on('change', function () {
	// 		console.log("Changed settings: ", _this.changedAttributes());
	// 	});
	// }
})

export const displaySettings = new DisplaySettings();
