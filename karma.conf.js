module.exports = function(config) {
  var webpackConfig = require('./webpack.config.js');
  var path = require('path');
  var entryVendorFiles;

  // We include jquery to have better selectors for testing
  var jquery = path.resolve('./node_modules/jquery/dist/jquery.min.js');
  var testFiles;
  var preProcessors = {};
  var babelPolyfill = path.resolve('./node_modules/babel-polyfill/dist/polyfill.min.js');

  delete webpackConfig.entry.app;

  entryVendorFiles = path.resolve(webpackConfig.context, webpackConfig.entry.vendor);
  testFiles = '**/*.spec.js';

  preProcessors[entryVendorFiles] = ['webpack'];
  preProcessors[testFiles] = ['webpack'];
  preProcessors['tests.js'] = ['webpack'];

  webpackConfig.plugins.shift(); // Remove commonChunk plugin for tests

  config.set({
    basePath: 'src/',
    frameworks: ['jasmine'],
    files: [babelPolyfill, jquery, entryVendorFiles, 'tests.js', testFiles],
    browsers: ['ChromeHeadless'],
    preprocessors: preProcessors,
    webpack: webpackConfig,
    webpackMiddleware: {
      historyApiFallback: true,
      quiet: false,
      noInfo: true,
      stats: {
        // Config for minimal console.log mess.
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
      }
    },
    singleRun: true,
    autoWatch: true,
    colors: true,
    reporters: ['progress', 'coverage-istanbul'],
    coverageIstanbulReporter: {
      reports: ['lcov', 'html', 'text-summary'],
      dir: config.coveragePath || '__coverage__',
      thresholds: config.coverageThresholds || {
        statements: 50,
        lines: 50,
        branches: 50,
        functions: 50
      }
    },
    plugins: [
      require('karma-jasmine'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-chrome-launcher'),
      require('karma-jasmine'),
      require('karma-webpack')
    ]
  });
};