import './style.scss';

import config from './config';
import component from './component';

import apiModule from './../api/module';

export default angular.module(`${config.NAMESPACE}`, [
  'ngRoute',
  apiModule.name
])
  .component(`placesList`, component)
  .config(function($routeProvider) {
    $routeProvider
      .when(`${config.ROUTE.href}`, {
        data: {isPublic: true},
        template: `<places-list></places-list>`,
        title: `${config.TITLE}`
      });
  });
