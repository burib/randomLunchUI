import './style.scss';

import config from './config';
import component from './component';

import apiModule from './../api/module';

export default angular.module(`${config.NAMESPACE}`, [
  'ngRoute',
  apiModule.name
])
  .component(`createPlace`, component);
