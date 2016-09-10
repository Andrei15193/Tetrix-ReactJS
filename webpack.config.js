const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    context: __dirname,
    devtool: "inline-sourcemap",
    entry: path.join(__dirname, "src", "index.jsx"),
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.html$/,
                loader: "html"
            }
        ]
    },
    output: {
        path: __dirname,
        publicPath: ".",
        filename: "app.min.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join("src", "index.html")
        }),
        new ExtractTextPlugin("app.min.css")
    ]
};