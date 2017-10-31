import './style.scss';
import logoutComponent from './logout-component';

import AuthModule from './../auth/auth-module';

export default angular.module('app.logout', [
    'angular-storage',
    AuthModule.name
  ])
  .component('logout', logoutComponent)
  .config(function($routeProvider) {
    $routeProvider
      .when('/logout', {
        data: {isPublic: true},
        template: '<logout></logout>',
        title: 'Logout'
      });
  });
