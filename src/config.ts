export const PROJECT_ID = window.location.pathname.split('/')[1]
// export const PROJECT_ID = 'MVN-BRUSSEL-KB-II-116'
// export const PROJECT_ID = 'HBSR'
// export const PROJECT_ID = 'SERRURE'
// export const PROJECT_ID = 'BS'

// const SEARCH_ENV = 'test.'

// TODO should this work? retrieve menu from /:id/external?

export async function createConfig() {
	const id = PROJECT_ID.toLowerCase()

	$.ajax("http://mvn.huygens.knaw.nl/" + id + "/external/", {
		crossDomain: true,
		complete: function(response) {
			if (response.status >= 200 && response.status < 300) {
				$("header .navigation").html(response.responseText)
			}
		}
	})

}

export const config = {
	rootSelector: '#app',
	// urlPrefix: '/' + PROJECT_ID + '/',
// 	searchURL: 'http://' + SEARCH_ENV + 'api.mvn.huygens.knaw.nl/editions/' + PROJECT_ID +  '/search',
	searchURL: '/api/editions/' + PROJECT_ID +  '/search',
	headerURL: 'http://mvn.huygens.knaw.nl/?page_id=65'
}
