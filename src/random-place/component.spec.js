import module from './module';

describe(`${module.name} component`, function() {
  let compiledTemplate;
  let scope;
  let template = '<places-list></places-list>';

  beforeEach(angular.mock.module(module.name));

  beforeEach(function() {
    scope = {};

    compiledTemplate = createDirective(template, scope);
  });
});
