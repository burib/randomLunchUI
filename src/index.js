import 'font-awesome/css/font-awesome.css';
import 'bootstrap/scss/bootstrap.scss';

import topNavbarModule from './common/topnavbar/module';
import authModule from './common/auth/auth-module.js';
import loginModule from './common/login/login-module.js';
import logoutModule from './common/logout/logout-module.js';

import config from './config';

import placesListModule from './places/list/module';
import placesDetailModule from './places/detail/module';

const appDependencies = [
  'ngRoute',
  'ngCookies',
  topNavbarModule.name,
  authModule.name,
  loginModule.name,
  logoutModule.name,
  placesListModule.name,
  placesDetailModule.name
];


if (__USE_MOCKS__) {
  console.info('%c____USING FAKE SSO____', 'background: #222; color: #1ff1f5');
}

angular.module(`${config.NAMESPACE}`, appDependencies)
  .controller('appCtrl', function() {
    this.user = 'user';
  })
  .config(function($routeProvider, $locationProvider) {
    $routeProvider.otherwise({redirectTo: '/'});

    // This sets the url mode to html5 clean URLs.
    $locationProvider.html5Mode(true).hashPrefix('!');
  });
