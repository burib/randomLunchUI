var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
var git = require('git-rev');
var GIT_COMMIT_HASH = '';
var pkg = require('./package.json');

git.short(function(str) {
  GIT_COMMIT_HASH = str;
});

function getFileCheckSum(filePath) {
  try {
    var fileContent = fs.readFileSync(filePath, 'utf8');

    return crypto
      .createHash('sha1')
      .update(fileContent)
      .digest('hex');
  } catch (err) {
    console.error(err);
    return 'NO-HASH';
  }
}

module.exports = function(grunt) {
  var webpackProduction = require(path.join(process.cwd(), './webpack.prod.config.js'));
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('git-changelog');

  grunt.initConfig({
    clean: {
      production: [webpackProduction.output.path],
      renamedAssets: [
        webpackProduction.output.path + 'assets/js/app.js',
        webpackProduction.output.path + 'assets/js/app.js.map',
        webpackProduction.output.path + 'assets/js/vendor.js',
        webpackProduction.output.path + 'assets/js/vendor.js.map',
        webpackProduction.output.path + 'assets/css/app.css',
        webpackProduction.output.path + 'assets/css/app.css.map'
      ]
    },
    copy: {
      production: {
        files: [
          {
            src: 'src/index.html',
            dest: webpackProduction.output.path + 'index.html'
          },
          {
            src: 'src/favicon.ico',
            dest: webpackProduction.output.path + 'favicon.ico'
          },
          {
            expand: true,
            cwd: webpackProduction.output.path,
            src: ['*/js/*.js'],
            dest: webpackProduction.output.path + 'assets/js',
            rename: function(dest, src) {
              var fileHash = getFileCheckSum(webpackProduction.output.path + src);

              return path.join(dest, path.basename(src, '.js') + '-' + fileHash + '.js');
            }
          },
          {
            expand: true,
            cwd: webpackProduction.output.path,
            src: ['*/js/*.map'],
            dest: webpackProduction.output.path + 'assets/js',
            rename: function(dest, src) {
              var fileHash = getFileCheckSum(webpackProduction.output.path + src.replace('.map', ''));

              return path.join(dest, path.basename(src, '.js.map') + '-' + fileHash + '.js.map');
            }
          },
          {
            expand: true,
            cwd: webpackProduction.output.path,
            src: ['*/css/*.css'],
            dest: webpackProduction.output.path + 'assets/css',
            rename: function(dest, src) {
              var fileHash = getFileCheckSum(webpackProduction.output.path + src);

              return path.join(dest, path.basename(src, '.css') + '-' + fileHash + '.css');
            }
          },
          {
            expand: true,
            cwd: webpackProduction.output.path,
            src: ['*/css/*.map'],
            dest: webpackProduction.output.path + 'assets/css',
            rename: function(dest, src) {
              var fileHash = getFileCheckSum(webpackProduction.output.path + src.replace('.map', ''));

              return path.join(dest, path.basename(src, '.css.map') + '-' + fileHash + '.css.map');
            }
          }
        ],
        options: {
          noProcess: ['**/*.{png,gif,jpg,ico,ttf,otf,woff,svg,js,css}'],
          process: contentProcessor
        }
      }
    },
    git_changelog: {
      minimal: {
        options: {
          app_name: pkg.name,
          repo_url: pkg.repository
        }
      }
    },
    webpack: {
      production: webpackProduction
    }
  });

  grunt.registerTask('default', ['clean:production', 'webpack:production', 'copy:production', 'clean:renamedAssets']);
  grunt.registerTask('changelog', ['git_changelog:minimal']);

  function contentProcessor(content) {
    var replacedContent = content;
    var stats = getStats();
    var ASSETS_HOST = process.env.ASSETS_HOST || '';
    var builtAt = new Date().toISOString().replace('T', ' ').split('.')[0];

    replacedContent = replacedContent.replace(/app\.js/g, 'app-' + stats.appJsHash + '.js');
    replacedContent = replacedContent.replace(/app\.css/g, 'app-' + stats.appCssHash + '.css');
    replacedContent = replacedContent.replace(/vendor\.js/g, 'vendor-' + stats.vendorJsHash + '.js');

    replacedContent = replacedContent.replace(/assets\//g, ASSETS_HOST + 'assets/');

    replacedContent = replacedContent.replace(/##PROJECT_NAME##/g, pkg.name);
    replacedContent = replacedContent.replace(/##GIT_COMMIT_HASH##/g, GIT_COMMIT_HASH);
    replacedContent = replacedContent.replace(/##BUILT_AT##/g, builtAt);

    return replacedContent;
  }

  function getStats() {
    var appJSFilePath = webpackProduction.output.path + 'assets/js/app.js';
    var appCssFilePath = webpackProduction.output.path + 'assets/css/app.css';
    var vendorJSFilePath = webpackProduction.output.path + 'assets/js/vendor.js';
    var appJsHash = getFileCheckSum(appJSFilePath);
    var vendorJsHash = getFileCheckSum(vendorJSFilePath);
    var appCssHash = getFileCheckSum(appCssFilePath);

    return {
      appJSFilePath: appJSFilePath,
      appCssFilePath: appCssFilePath,
      vendorJSFilePath: vendorJSFilePath,
      appJsHash: appJsHash,
      vendorJsHash: vendorJsHash,
      appCssHash: appCssHash
    };
  }
};