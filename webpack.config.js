var webpackConfig = require('./webpack.base.config.js')('vendor.js', 'app.js', 'app.css');

module.exports = webpackConfig;