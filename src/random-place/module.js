import './style.scss';

import config from './config';
import component from './component';

import apiModule from './api/module';

export default angular.module(`${config.NAMESPACE}`, [
  'ngRoute',
  apiModule.name
])
  .component(`randomPlace`, component)
  .config(function($routeProvider) {
    $routeProvider
      .when(`${config.ROUTE.href}`, {
        data: {isPublic: true},
        template: `<random-place></random-place>`,
        title: `${config.TITLE}`
      });
  });
