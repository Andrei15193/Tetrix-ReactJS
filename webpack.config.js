const IS_PRODUCTION = (process.argv.indexOf('-p') !== -1);

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    context: __dirname,
    devtool: (IS_PRODUCTION ? null : "inline-sourcemap"),
    entry: path.join(__dirname, "src", "index.jsx"),
    resolve: {
        extensions: ["", ".js", ".jsx"],
        alias: {
            common: path.resolve(__dirname, "src"),
            tetrix: path.resolve(__dirname, "src", "tetrix", "app")
        }
    },
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
                loader: "style-loader!css-loader?camelCase&modules=true&localIdentName=[name]__[local]___[hash:base64:5]"
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
        (IS_PRODUCTION ?
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify("production")
                }
            }) : null),
        (IS_PRODUCTION ? new webpack.optimize.UglifyJsPlugin() : null),
        new HtmlWebpackPlugin({
            template: path.join("src", "index.html")
        })
    ].filter(plugin => plugin != null)
};