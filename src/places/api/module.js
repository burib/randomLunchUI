import config from './config';
import uuid from 'uuid';

import dataService, {
  API_RESOURCE_PATH
} from './data-service';

import placesResponseMock from './mocks/list-response-mock';

const dependencies = [
  'ngResource'
];

if (__USE_MOCKS__) {
  dependencies.push('ngMockE2E');
}

export default angular.module(`${config.NAMESPACE}`, dependencies)
  .factory(`${config.TITLE.split(' ').join('')}DataService`, dataService)
  .config(function($provide) {
    if (__USE_MOCKS__) {
      $provide.decorator('$httpBackend', function($delegate) {
        var proxy = function(method, url, data, callback, headers) {
          var interceptor = function() {
            var _this = this;
            var _arguments = arguments;
            var delay = headers.delay || 1000;
            setTimeout(function() {
              console.log('%cReturning data with ' + delay + ' ms delay for ' + url, 'background: #222; color: #fff');
              callback.apply(_this, _arguments);
            }, delay);
          };

          return $delegate.call(this, method, url, data, interceptor, headers);
        };

        for(var key in $delegate) {
          proxy[key] = $delegate[key];
        }

        return proxy;
      });
    }
  })
  .run(function($httpBackend) {
    if(__USE_MOCKS__) {
      const dataServiceName = `${config.TITLE.split(' ').join('')}DataService`;
      console.log('%c[MOCK] ' + config.TITLE + ' Mocks Enabled for ' + dataServiceName, 'background: #77dd77; color: #000');

      $httpBackend.whenRoute('GET', API_RESOURCE_PATH)
        .respond(function(method, url, data, headers, params) {
          console.log('%c GET LIST :: ' + url, 'background: #222; color: #77dd77');

          headers.delay = 1000;


          return [200, {...placesResponseMock}];
        });

      $httpBackend.whenRoute('POST', API_RESOURCE_PATH)
        .respond(function(method, url, data, headers, params) {
          const postedData = JSON.parse(data);
          console.log('%c ADD NEW PLACE :: ' + url, 'background: #222; color: #77dd77');
          console.log('POSTED DATA ', postedData);

          headers.delay = 1000;

          return [
            200,
            {
              id: uuid.v4(),
              title: postedData.title
            }
          ];
        });
    }
  });
