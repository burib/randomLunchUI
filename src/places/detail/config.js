import config from './../config';

export default {
  NAMESPACE: `${config.NAMESPACE}.detail`,
  TITLE: `${config.TITLE} Detail`,
  ROUTE: {
    href: '/places/:id'
  }
};
