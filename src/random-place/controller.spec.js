import randomPlaceResponseMock from './api/mocks/random-place-response-mock';

import module from './module';
import controller from './controller';

describe(`${module.name} controller`, function() {
  let controllerInstance;

  let $rootScope;
  let $scope;
  let routeParamsMock = {};

  let RandomPlaceAPIDataServiceMock;
  let deferred;

  beforeEach(() => {
    RandomPlaceAPIDataServiceMock = jasmine.createSpyObj('RandomPlaceAPIDataService', ['query']);
  });

  beforeEach(() => {
    RandomPlaceAPIDataServiceMock.query.and.callFake(function() {
      deferred = createDeferred();
      return {$promise: deferred.promise}
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();

      controllerInstance = createController(controller, {}, {
        $routeParams: routeParamsMock,
        RandomPlaceAPIDataService: RandomPlaceAPIDataServiceMock
      }, false);
    });

    controllerInstance._scope.$digest();
  });


  it('should extend the scope with default values', function() {
    expect(controllerInstance.getRandomPlace).toEqual(jasmine.any(Function));
  });

  it('should query a list of items when controllerInstance.getRandomPlace() is called', function() {
    controllerInstance.getRandomPlace();

    deferred.resolve({
      data: randomPlaceResponseMock
    });

    expect(RandomPlaceAPIDataServiceMock.query).toHaveBeenCalled();
  });

});
