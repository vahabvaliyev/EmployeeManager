const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SRC_PATH = path.resolve(__dirname, 'src');

module.exports = {
    entry: path.join(SRC_PATH, 'index'),
    output: {
        filename: '[name].[contenthash].js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        modules: [SRC_PATH, 'node_modules'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
        }),
        new webpack.DefinePlugin({
            'process.env.INFRA_ENV': JSON.stringify('development')
        })
    ]
}