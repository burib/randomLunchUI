import './style.scss';

import config from './config';
import component from './component';

export default angular.module(`${config.NAMESPACE}`, [
  'ngRoute'
])
  .component(`placesDetail`, component)
  .config(function($routeProvider) {
    $routeProvider
      .when(`${config.ROUTE.href}`, {
        template: `<places-detail></places-detail>`,
        title: `${config.TITLE}`
      });
  });
