define(['underscore', 'backbone', 'text!/docs/structure.json', 'app/models/models'],
	function (_, Backbone, structureJSON, Models) {
	var Model = Backbone.Model.extend({
		initialize: function () {
			this.parse(structureJSON);
		},
		parse: function (json) {
			data = JSON.parse(json);

			var folio = new Models.Folio(
				_.map(data[1].folio, function (f) {
					return {
						id: _.keys(f)[0],
						texts: _.values(f)[0]
					};
				})
			);
			this.set('folio', folio);

			//  add reference to text models for relevant folios
			var texts = new Models.Texts(
				_.map(data[0].texts, function (t) {
					return new Models.Text({
						id: _.keys(t)[0],
						folio: _.map(_.values(t)[0], function (fid) {
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