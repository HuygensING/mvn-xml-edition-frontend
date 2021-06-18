import Backbone from 'backbone';
import { PROJECT_ID } from '../config'
import { Folia } from './folia';
import { Texts, Text } from './texts';

const DataStructure = Backbone.Model.extend({
	url: () => `/docs/${PROJECT_ID}/config.json`,

	parse: function (data) {
		if (Object.keys(data).length === 0) return {}
		// console.log('PARSING', json)
		// const data = JSON.parse(json);
		// console.log(data)
		
		// TODO add { parse: true } ?
		var folio = new Folia(
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
		// this.set('folio', folio);

		//  add reference to text models for relevant folios
		var texts = new Texts(
			Object.keys(data.texts).map(function (k) {
				return new Text({
					id: k,
					first_line: data.texts[k].head,
					firstLineId: data.texts[k].firstLineId,
					folio: data.texts[k].folia.map(function (fid) {
						return folio.get(fid);
					})
				});
			})
		);
		// this.set('texts', texts);

		// this.set('subtitle', data.edition.subtitle);
		// this.set('title', data.edition.title);
		// this.set('signatuur', data.edition.signatuur);

		return {
			folio,
			texts,
			...data.edition
			// subtitle: data.edition.subtitle,
			// title: data.edition.title,
			// signatuur: data.edition.signatuur,
		}
	},
	// get parse() {
	// 	return this._parse;
	// },
	// set parse(value) {
	// 	this._parse = value;
	// },
})

export const dataStructure = new DataStructure({}, { parse: true })
