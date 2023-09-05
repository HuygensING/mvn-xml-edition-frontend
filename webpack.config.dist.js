const path = require('path')
const baseConfig = require('./webpack.config')

module.exports = () => {
	delete baseConfig.devServer

	baseConfig.mode = "production"

	baseConfig.output.path = path.resolve(process.cwd(), './public')

	return baseConfig
}
