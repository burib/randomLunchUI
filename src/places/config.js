import config from './../config';

export default {
  NAMESPACE: `${config.NAMESPACE}.places`,
  TITLE: 'Places',
  API: {
    basePath: '/api',
    version: 'v1',
    prefix: 'rnd'
  }
};
