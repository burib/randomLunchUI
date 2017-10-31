import module from './module';

xdescribe(`${module.name} component`, function() {
  let compiledTemplate;
  let scope;
  let template = '<subscriptions-detail></subscriptions-detail>';

  beforeEach(angular.mock.module(module.name));

  beforeEach(function() {
    scope = {};

    compiledTemplate = createDirective(template, scope);
  });
});
