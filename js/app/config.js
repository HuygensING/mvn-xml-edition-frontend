define(['underscore', 'backbone'], function (_, Backbone) {
	return {
		rootElement: '#app',
		viewManagerRoot: '#main .view',
		urlPrefix: '/' + PROJECT_ID + '/',
		// TODO wordt: http://api.mvn.huygens.knaw.nl/edition/[Project ID]/search (nu)
		searchURL: 'http://search.vvevm.mvn.huygens.knaw.nl/search',
		headerURL: 'http://mvn.huygens.knaw.nl/?page_id=65'
	};
});