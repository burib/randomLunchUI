import module from './module';
import dataService from './data-service';

describe(`${module.name} module`, function() {
  let service = dataService;
  let serviceInstance;
  let $resource;

  beforeEach(function() {
    angular.mock.module(module.name);

    inject(($injector) => {
      $resource = $injector.get('$resource');
    });

    serviceInstance = service($resource);
  });

  describe('query', function() {
    it('GET: should get a random place', () => {
      expect(true).toBe(true);
    });
  });
});