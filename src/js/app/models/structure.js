define(['underscore', 'backbone', 'text!/docs/' + PROJECT_ID + '/config.json', 'app/models/models'],
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
						texts: data.folio[k].texts,
						htmlSource: data.folio[k].htmlSource,
						thumbnail: data.folio[k].thumbnail,
						facsimile: data.folio[k].facsimile
					};
				})
			);
			this.set('folio', folio);

			//  add reference to text models for relevant folios
			var texts = new Models.Texts(
				Object.keys(data.texts).map(function (k) {
					return new Models.Text({
						id: k,
						first_line: data.texts[k].head,
						firstLineId: data.texts[k].firstLineId,
						folio: data.texts[k].folia.map(function (fid) {
							return folio.get(fid);
						})
					});
				})
			);
			this.set('texts', texts);

			this.set('subtitle', data.edition.subtitle);
			this.set('title', data.edition.title);
			this.set('signatuur', data.edition.signatuur);
		}
	});

	// should only be one such model, since
	// it's always the same data
	return new Model();
});
