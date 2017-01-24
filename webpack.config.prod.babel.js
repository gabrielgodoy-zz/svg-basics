import autoprefixer from 'autoprefixer';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
import ExtractTextPlugin from 'extract-text-webpack-plugin';
let path = require('path');

module.exports = {
  entry: ["babel-polyfill", "./assets/js/main.js"],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract(
        'style-loader', 'css-loader'),
    }, {
      test: /\.styl$/,
      loader: ExtractTextPlugin.extract(
        'style-loader', 'css-loader?modules!postcss-loader!stylus-loader'),
    }, {
      test: /\.pug$/,
      loader: 'pug-loader?pretty'
    }, {
      test: /\.html$/,
      loader: 'file-loader'
    }, {
      test: /\.(eot|otf|woff|woff2|ttf|svg)$/,
      loader: 'url-loader?limit=30000&name=[name].[ext]',
    }, {
      test: /\.(png|jpg)$/,
      loader: 'file-loader?name=[path][name].[ext]',
    }],
  },
  output: {
    filename: 'main.js',
    path: path.resolve('dist'),
  },
  postcss() {
    return [autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9'],
      remove: false
    })];
  },
  plugins: [
    new ExtractTextPlugin('main.css'),

    // Optimizes the order that the files are bundled
    new webpack.optimize.OccurenceOrderPlugin(),

    // Eliminates duplicated packages when generating bundle
    new webpack.optimize.DedupePlugin(),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.pug',
    }),
    new HtmlWebpackPlugin({
      filename: 'path.html',
      template: './pages/path.pug',
    }),
    new HtmlWebpackPlugin({
      filename: 'viewport-viewbox-aspect-ratio.html',
      template: './pages/viewport-viewbox-aspect-ratio.pug',
    }),
    new HtmlWebpackPlugin({
      filename: 'path-commands-table.html',
      template: './pages/path-commands-table.pug',
    }),
    new HtmlWebpackPlugin({
      filename: 'basic-shapes.html',
      template: './pages/basic-shapes.pug',
    }),
    new HtmlWebpackPlugin({
      filename: 'arcs-example.html',
      template: './pages/arcs-example.pug',
    }),
    new HtmlWebpackPlugin({
      filename: '404.html',
      template: './pages/404.pug',
    }),
  ],
  resolve: {
    extensions: ['', '.js', '.pug', '.styl']
  }
};
