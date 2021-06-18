export const PROJECT_ID = 'BS'
export const SEARCH_ENV = 'test.'

// TODO should this work? retrieve menu from /:id/external?

// export async function createConfig() {
// 	// var id = PROJECT_ID.toLowerCase()

// 	// $.ajax("http://mvn.huygens.knaw.nl/" + id + "/external/", {
// 	// 	crossDomain: true,
// 	// 	complete: function(response) {
// 	// 		if (response.status >= 200 && response.status < 300) {
// 	// 			$("header .navigation").html(response.responseText)
// 	// 		}
// 	// 	}
// 	// })

// }

export const config = {
	rootSelector: '#app',
	viewManagerRoot: '#main .view',
	urlPrefix: '/' + PROJECT_ID + '/',
	searchURL: 'http://' + SEARCH_ENV + 'api.mvn.huygens.knaw.nl/editions/' + PROJECT_ID +  '/search',
	headerURL: 'http://mvn.huygens.knaw.nl/?page_id=65'
}
