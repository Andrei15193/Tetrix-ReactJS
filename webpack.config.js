const path = require("path");
const webpack = require("webpack");
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
                loader: "style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]"
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
        })
    ]
};