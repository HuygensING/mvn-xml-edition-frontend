define(['underscore', 'backbone', 'text!/docs/config.json', 'app/models/models'],
	function (_, Backbone, structureJSON, Models) {
	var Model = Backbone.Model.extend({
		initialize: function () {
			this.parse(structureJSON);
		},
		parse: function (json) {
			data = JSON.parse(json);
			var folio = new Models.Folio(
				Object.keys(data.folio).map(function (k) {
					return {
						id: k,
						texts: data.folio[k]
					};
				})
			);
			this.set('folio', folio);

			//  add reference to text models for relevant folios
			var texts = new Models.Texts(
				Object.keys(data.texts).map(function (k) {
					return new Models.Text({
						id: k,
						first_line: data.first_lines[k],
						folio: data.texts[k].map(function (fid) {
							return folio.get(fid);
						})
					});
				})
			);	
			this.set('texts', texts);

		}
	});

	// should only be one such model, since
	// it's always the same data
	return new Model();
});