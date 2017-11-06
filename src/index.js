import 'font-awesome/css/font-awesome.css';
import 'bootstrap/scss/bootstrap.scss';
import './style.scss';

import topNavbarModule from './common/topnavbar/module';
import authModule from './common/auth/auth-module.js';
import loginModule from './common/login/login-module.js';
import logoutModule from './common/logout/logout-module.js';

import config from './config';

import placesListModule from './places/list/module';
import randomPlaceModule from './random-place/module';

const appDependencies = [
  'ngRoute',
  'ngCookies',
  topNavbarModule.name,
  authModule.name,
  loginModule.name,
  logoutModule.name,
  placesListModule.name,
  randomPlaceModule.name
];


if (__USE_MOCKS__) {
  console.info('%c____USING FAKE SSO____', 'background: #222; color: #1ff1f5');
}

angular.module(`${config.NAMESPACE}`, appDependencies)
  .controller('appCtrl', function() {
    this.user = 'user';
  })
  .config(function($routeProvider) {
    $routeProvider
      .when(`/`, {
        data: {isPublic: true},
        template: `
        <random-place></random-place>
        <places-list></places-list>
        <footer class="text-muted">
          <div class="container">
            <p>
              What and Where to eat today for lunch ! AWS Demo App.<br/>
              <strong>Authors:</strong> 
              <a href="https://www.linkedin.com/in/balazsburi/" target="_blank">
                <i class="fa fa-linkedin-square" aria-hidden="true"></i> Balázs Buri
              </a>, 
              <a href="https://www.linkedin.com/in/szilveszterfarkas/" target="_blank">
                <i class="fa fa-linkedin-square" aria-hidden="true"></i> Szilveszter Farkas.
              </a>
            </p>
            <p>
              <a href="https://github.com/burib/randomLunchUI" target="_blank"><i class="fa fa-github" aria-hidden="true"></i> randomLunchUI</a>  
              <a href="https://github.com/burib/randomLunchAPI" target="_blank"><i class="fa fa-github" aria-hidden="true"></i> randomLunchAPI</a>
            </p>
          </div>
        </footer>`,
        title: `${config.TITLE}`
      });
  })
  .config(function($routeProvider, $locationProvider) {
    $routeProvider.otherwise({redirectTo: '/'});

    // This sets the url mode to html5 clean URLs.
    $locationProvider.html5Mode(true).hashPrefix('!');
  });
