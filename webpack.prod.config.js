var webpack = require('webpack'),
  webpackProduction = require('./webpack.base.config.js')('vendor.js', null, 'app.css'),
  OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
  UglifyJSPlugin = require('uglifyjs-webpack-plugin');

webpackProduction.storeStatsTo = 'webpackStatistics';
webpackProduction.plugins.push(new UglifyJSPlugin({uglifyOptions: {mangle: false}}));
webpackProduction.plugins.push(new OptimizeCssAssetsPlugin({
  assetNameRegExp: /app\.css$/g,
  cssProcessor: require('cssnano'),
  cssProcessorOptions: {
    discardComments: {
      removeAll: true
    }
  }
}));

webpackProduction.module.rules.pop(); // Remove coverage reporter

module.exports = webpackProduction;