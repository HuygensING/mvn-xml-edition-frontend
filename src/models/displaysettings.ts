import Backbone from "backbone";

export enum NummeringType {
	Off,
	Line,
	Verse
}

const DisplaySettings = Backbone.Model.extend({
	defaults: function () {
		return {
			"afkortingen-oplossen": false,
			"afkortingen-cursief": false,
			"weergave-schrijfproces": true,
			"nummering-type": NummeringType.Line
		}
	},

	toggleNummeringType: function() {
		if (this.get('nummering-type') === NummeringType.Off) 
			this.set('nummering-type', NummeringType.Line)

		else if (this.get('nummering-type') === NummeringType.Line)
			this.set('nummering-type', NummeringType.Verse)

		else if (this.get('nummering-type') === NummeringType.Verse)
			this.set('nummering-type', NummeringType.Off)
	},
})

export const displaySettings = new DisplaySettings();
