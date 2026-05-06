const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
	entry: "./src/index.ts",
	mode: "production",
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: "ts-loader",
				exclude: /node_modules/
			},
			{
				test: /\.module\.css$/i,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							modules: {
								localIdentName: "[local]__[hash:base64:5]"
							}
						}
					}
				]
			},
			{
				test: /\.css$/i,
				exclude: /\.module\.css$/i,
				use: [MiniCssExtractPlugin.loader, "css-loader"]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "plugin.css"
		})
	],
	optimization: {
		minimizer: ["...", new CssMinimizerPlugin()]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	output: {
		filename: "plugin.js",
		path: path.resolve(__dirname, "dist")
	}
};
