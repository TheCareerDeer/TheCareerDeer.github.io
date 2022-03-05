const path = require('path')

module.exports = {
	mode: "development",
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "."),
		filename: "bundle.js"
	},
	watch: true,
},

module: {
	rules: [
	{
		test: /\.js$/,
		enforce: 'pre',
		use: ['source-map-loader']
	} ]
}