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
    PlacesAPIDataServiceMock = jasmine.createSpyObj('PlacesAPIDataService', ['post']);
  });

  beforeEach(() => {
    PlacesAPIDataServiceMock.post.and.callFake(function() {
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

    controllerInstance._scope.$digest();
  });


  it('should extend the scope with default values', function() {
    expect(controllerInstance.isFormVisible).toEqual(jasmine.any(Boolean));
    expect(controllerInstance.isFormSubmitted).toEqual(jasmine.any(Boolean));
    expect(controllerInstance.showErrors).toEqual(jasmine.any(Boolean));
    expect(controllerInstance.toggleFormVisibility).toEqual(jasmine.any(Function));
    expect(controllerInstance.validateForm).toEqual(jasmine.any(Function));
    expect(controllerInstance.submitForm).toEqual(jasmine.any(Function));
  });

  xit('should POST to an endpoint when submitForm is called', function() {
    controllerInstance.userForm = {
      $valid: true,
      apiKey: {
        $modelValue: '123'
      },
      place: {
        $modelValue: 'Burrito Brothers'
      }
    };
    controllerInstance.submitForm();
    listDeferred.resolve({
      id: 12,
      title: 'Burrito Brothers'
    });
    expect(PlacesAPIDataServiceMock.post).toHaveBeenCalled();
  });

});
