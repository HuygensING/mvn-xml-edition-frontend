const express = require('express')
const proxy = require('http-proxy-middleware')

const app = express()

app.use(express.static('public'))

app.use(
	'/docs',
	proxy({
		target: "http://test.mvn.huygens.knaw.nl",
		changeOrigin: true
	})
)

app.get('*', (req, res, next) => {
	res.sendFile(__dirname + '/public/index.html')
})

app.listen(5000)
