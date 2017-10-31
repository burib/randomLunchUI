import listReportsMockData from './../api/mocks/list-response-mock';

import module from './module';
import controller from './controller';

describe(`${module.name} controller`, function() {
  let controllerInstance;

  let $rootScope;
  let $scope;
  let routeParamsMock = {};

  let PlacesAPIDataServiceMock;
  let listDeferred;

  beforeEach(() => {
    PlacesAPIDataServiceMock = jasmine.createSpyObj('PlacesAPIDataService', ['query']);
  });

  beforeEach(() => {
    PlacesAPIDataServiceMock.query.and.callFake(function() {
      listDeferred = createDeferred();
      return {$promise: listDeferred.promise}
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();

      controllerInstance = createController(controller, {}, {
        $routeParams: routeParamsMock,
        PlacesAPIDataService: PlacesAPIDataServiceMock
      }, false);
    });

    listDeferred.resolve({
      data: listReportsMockData.data
    });

    controllerInstance._scope.$digest();
  });


  it('should extend the scope with default values', function() {
    expect(controllerInstance.text).toEqual(jasmine.any(Object));
  });

  it('should query a list of items immediately', function() {
    expect(PlacesAPIDataServiceMock.query).toHaveBeenCalled();
  });

});
