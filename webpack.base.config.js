var path = require('path'),
  webpack = require('webpack'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = function(vendorJsFilename, appJsFilename, appCssFilename, distFolderName = 'dist/', cwd = process.cwd()) {
  var publicPath = process.env.ASSETS_HOST ? '' : '../../',
    distFolderName = path.join(cwd, distFolderName);

  return {
    context: path.join(cwd, 'src'),
    entry: {
      vendor: './../vendor/index.js',
      app: './index.js'
    },
    output: {
      path: distFolderName,
      filename: appJsFilename ? 'assets/js/' + appJsFilename : 'assets/js/[name].js'
    },
    resolve: {
      modules: ['node_modules', 'bower_components'],
      descriptionFiles: ['package.json', 'bower.json'],
      alias: {

      }
    },
    module: {
      rules: [
        {
          test: /.*\.(gif|png|jpe?g|ico)$/i,
          use: [
            {
              loader: 'file-loader?name=assets/img/[name]-[hash].[ext]'
            }
          ]
        },
        {
          test: /\.(css|scss)$/,
          loader: ExtractTextPlugin.extract({
            use: [
              {loader: 'css-loader?modules&importLoaders=1&localIdentName=[local]'},
              {loader: 'resolve-url-loader'},
              {loader: 'postcss-loader', options: {sourceMap: true}},
              {loader: 'sass-loader?sourceMap'}
            ],
            publicPath: publicPath
          })
        },
        {
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['es2015', 'stage-3'],
                plugins: ['syntax-async-functions','transform-regenerator']
              }
            }
          ],
          include: [
            path.join(cwd, 'src')
          ]
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader'
            }
          ]
        },
        {
          test: /\.(otf|eot|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [
            {
              loader: 'file-loader?name=assets/font/[name]-[hash].[ext]'
            }
          ]
        },
        {
          test: /\.js$/,
          include: path.join(cwd, 'src'),
          exclude: /(node_modules|\.spec\.js|\.e2e\.js|\.mock\.js|\.conf\.js|tests.js)/,
          loader: 'istanbul-instrumenter-loader',
          enforce: 'post',
          options: {
            esModules: true
          }
        }
      ]
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'assets/js/' + vendorJsFilename
      }),
      new ExtractTextPlugin({
        filename: 'assets/css/' + appCssFilename,
        disable: false,
        allChunks: true
      }),
      new DashboardPlugin(),
      new webpack.DefinePlugin({
        __USE_MOCKS__: process.env.USE_MOCKS
      }),
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
    ],
    devServer: {
      contentBase: path.join(cwd, '/src'),
      compress: true,
      historyApiFallback: true,
      clientLogLevel: 'info', // None, error, warning or info ( default )
      port: 1337
    }
  };
};