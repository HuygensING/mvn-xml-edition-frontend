define(['underscore', 'backbone'], function (_, Backbone) {
	return {
		rootElement: '#app',
		viewManagerRoot: '#main .view',
		urlPrefix: '/' + PROJECT_ID + '/',
		searchURL: 'http://api.mvn.huygens.knaw.nl/editions/' + PROJECT_ID +  '/search',
		headerURL: 'http://mvn.huygens.knaw.nl/?page_id=65'
	};
});