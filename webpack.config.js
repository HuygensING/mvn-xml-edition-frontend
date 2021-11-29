const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	mode: 'development',

	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.ts$/,
				loader: "ts-loader",
			},
			{
				test: /\.styl$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader?url=false'
					},
					{
						loader: 'stylus-loader',
						options: {
							stylusOptions: {
								use: ["nib"]
							}
						}
					}
				]
			}
		]
	},

	resolve: {
		extensions: [".webpack.js", ".web.js", ".js", ".ts"],
	},

	devServer: {
		contentBase: path.resolve(process.cwd(), './static'),
		contentBasePublicPath: '/static',
		disableHostCheck: true,
		headers: {
			"Access-Control-Allow-Origin": "*"
		},
		historyApiFallback: {
			disableDotRule: true
		},
		host: 'localhost',
		hot: true,
		port: 4000,
		proxy: {
			'/docs': {
				target: 'http://test.mvn.huygens.knaw.nl',
				secure: false,
				changeOrigin: true,
			}
		},
		watchOptions: {
			ignored: /node_modules/
		}
	},

	entry: ['./src/index.ts'],

	output: {
		filename: 'js/[fullhash].main.js',
		chunkFilename: 'js/[id].chunk.js',
		path: __dirname + '/build-dev-server',
		publicPath: '/',
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'MVN',
			template: './src/index.html',
		})
	],

	externals: {
		'jquery': 'jQuery'
	}
}
