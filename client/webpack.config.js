const webpack = require('webpack');
const path = require('path');
const loaders = require('./webpack.loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || '8888';


loaders.push({
// global css
  test: /\.css$/,
  exclude: /[/\\]src[/\\]/,
    // include: /[\/\\](globalStyles)[\/\\]/,
  loaders: [
    'style-loader?sourceMap',
    'css-loader'
  ]
},
// global scss
  {
    test: /\.scss$/,
  // exclude: /[\/\\]src[\/\\]/,
    include: /[/\\](globalStyles)[/\\]/,
    loaders: [
      'style-loader?sourceMap',
      'css-loader',
      'sass-loader'
    ]
  },
  // local scss modules
  {
    test: /\.scss$/,
    include: /[/\\](components)[/\\]/,
    loaders: [
      'style-loader?sourceMap',
      'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
      'postcss-loader',
      'sass-loader'
    ]
  },
  // {
  //   test: /\.js$/,
  //   // test: /mapbox-gl.+\.js$/,
  //   include: path.resolve(__dirname, 'node_modules/webworkify/index.js'),
  //   loader: 'worker-loader!babel-loader'
  // },
  {
    test: /mapbox-gl.+\.js$/,
    loader: 'transform-loader/cacheable?brfs'
  }
);

// local css modules
// loaders.push({
//   test: /\.css$/,
//   exclude: /[\/\\](node_modules|bower_components|public)[\/\\]/,
//   loaders: [
//     'style?sourceMap',
//     'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
//   ]
// });

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './src/index.jsx' // your app's entry point
  ],
  devtool: process.env.WEBPACK_DEVTOOL || 'cheap-module-source-map',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      // 'mapbox-gl/js/mapbox-gl.js': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js'),
      // webworkify: 'webworkify',
      // 'mapbox-gl.js': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
      // 'mapbox-gl': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
      'mapbox-gl$': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },
  module: {
    loaders
  },
  devServer: {
    contentBase: './public',
    noInfo: true,
    hot: true,
    inline: true,
    historyApiFallback: true,
    port: PORT,
    host: HOST
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/template.html'
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Tether: 'tether',
      'window.Tether': 'tether'
    })
  ]
};
