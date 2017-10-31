import authService from './auth-service';
import authHttpInterceptor from './auth-http-interceptor';
import authConfig from './auth-config';

export default angular.module('app.auth',
  [
    'angular-jwt',
    'angular-storage',
    'ngRoute',
    'ngCookies',
    'ngResource'
  ])
  .factory('authService', authService)
  .factory('authHttpInterceptor', authHttpInterceptor)
  .config(authConfig)
  .run(function(authService) {
    authService.init();
  });
