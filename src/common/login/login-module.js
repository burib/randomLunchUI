import './style.scss';
import loginComponent from './login-component';

import AuthModule from './../auth/auth-module';

export default angular.module('app.login', [
    'angular-storage',
    AuthModule.name
  ])
  .component('login', loginComponent)
  .config(function($routeProvider) {
    $routeProvider
      .when('/login', {
        data: {isPublic: true},
        template: '<login></login>',
        title: 'Login'
      });
  });
