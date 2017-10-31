function isPlainObject(arg) {
  return (arg && typeof arg === 'object' && !(arg instanceof Array));
}

function createScope(scope, currentSpec) {
  if (!scope) {
    return getNewRootscope(currentSpec);
  }

  if (scope && isPlainObject(scope)) {
    return angular.extend(getNewRootscope(currentSpec), scope);
  }

  return scope;
}

function getInjector(currentSpec) {
  angular.mock.inject(function(_$rootScope_) {});

  return currentSpec.$injector;
}

function getInvoke(currentSpec) {
  return getInjector(currentSpec).invoke;
}

function getNewRootscope(currentSpec) {
  return getInjector(currentSpec).get('$rootScope').$new();
}

function getCreateControllerFn(currentSpec) {

  return function(controllerName, scope, locals, bindings) {
    var invoke = getInvoke(currentSpec);

    return invoke(controllerFactory)(controllerName);

    function controllerFactory($controller) {
      return function(controllerName) {
        var localScope = createScope(scope, currentSpec);
        var controller = $controller(controllerName, angular.extend({$scope: localScope}, locals || {}), bindings);
        controller._scope = localScope;

        if (controller.$onInit) {
          controller.$onInit();
        }

        return controller;
      };
    }
  };
}

function provideMock($provide, mockName, mockMethods) {
  var mock = mockMethods ? jasmine.createSpyObj(mockName, mockMethods) : jasmine.createSpy(mockName);

  $provide.value(mockName, mock);

  return mock;
}

function getCreateDirectiveFn(currentSpec) {
  return function(template, scope, locals) {
    var invoke = getInvoke(currentSpec);

    return invoke(compileTemplateFactory)(template);

    function compileTemplateFactory($compile) {
      return function(template) {
        var localScope = createScope(scope, currentSpec);
        var compiledTemplate = $compile(template)(angular.extend(localScope, locals || {}));

        localScope.$digest();

        return compiledTemplate;
      };
    }
  };
}

function getCreateDeferred(currentSpec) {
  return function() {
    var q = getInjector(currentSpec).get('$q');
    var deferred = q.defer();

    deferred.promise.catch(function(error) {
      return q.reject(error);
    }).catch(function(error) {
      return 'An error occurred';
    });

    return deferred;
  };
}

beforeEach(function() {
  window.createController = getCreateControllerFn(this);
  window.createDirective = getCreateDirectiveFn(this);
  window.createDeferred = getCreateDeferred(this);
  window.provideMock = provideMock;
});