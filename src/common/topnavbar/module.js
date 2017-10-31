import './style.scss';

import config from './config';
import component from './component';

export default angular.module(`${config.NAMESPACE}`, [
  'ngRoute'
])
  .component(`topNavbar`, component);
