if (!global._babelPolyfill) {
  // Don't include if already included.
  require('babel-polyfill');
}

require('./detect.js')();
require('./polyfills.js');

require('angular/angular.min.js');
require('angular-resource/angular-resource.min.js');
require('angular-route/angular-route.min.js');
require('angular-cookies/angular-cookies.min.js');
require('angular-jwt/dist/angular-jwt.min.js');
require('angular-storage/dist/angular-storage.min.js');

if (__USE_MOCKS__) {
  console.info('%c____INCLUDING MOCKS____', 'background: #222; color: #1ff1f5;');

  require('angular-mocks'); // Only for mocks

}

