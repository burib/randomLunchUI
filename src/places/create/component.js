import controller from './controller';
import template from './template.tpl.html';

export default {
  controller,
  bindings: {
    onSuccess: '&'
  },
  template: template
};
