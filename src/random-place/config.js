import config from './../config';

export default {
  NAMESPACE: `${config.NAMESPACE}.random-place`,
  TITLE: 'RandomPlace',
  API: {
    basePath: '/api',
    version: 'v1',
    prefix: 'rnd'
  },
  ROUTE: {
    href: '/randomlunch'
  }
};
