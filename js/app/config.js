define(['underscore', 'backbone'], function (_, Backbone) {
	return {
		rootElement: '#app',
		viewManagerRoot: '#main .view',
		dataSource: '/structure.json',
		urlPrefix: '/',
		searchURL: 'http://search.vvevm.mvn.huygens.knaw.nl/search',
		headerURL: 'http://mvn.huygens.knaw.nl/?page_id=65'
	};
});