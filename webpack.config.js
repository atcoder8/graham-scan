const HtmlWebpackPlugin = require("html-webpack-plugin");
const ghpages = require("gh-pages");
const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: "css-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    devtool: "source-map",
    devServer: {
        static: "./docs",
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: "body",
            filename: "index.html",
            template: "./src/index.html",
            title: "Graham scan",
        }),
    ],
    output: {
        filename: "js/[name].bundle.js",
        path: path.resolve(__dirname, "docs"),
        clean: true,
    },
    optimization: {
        runtimeChunk: "single",
    },
};
