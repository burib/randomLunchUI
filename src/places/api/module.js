import config from './config';

import dataService, {
  API_RESOURCE_LIST_PATH,
  API_RESOURCE_DETAIL_PATH
} from './data-service';

import listResponseMock from './mocks/list-response-mock';

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
              console.log('%cReturning data with' + delay + ' ms delay for ' + url, 'background: #222; color: #fff');
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

      $httpBackend.whenRoute('GET', API_RESOURCE_DETAIL_PATH.replace('/:action', ''))
        .respond(function(method, url, data, headers, params) {
          const detailId = params.id;
          const detail = listResponseMock.data.items.find((obj) => obj.id == detailId);
          let response;

          console.log('%c GET DETAILS :: ' + url, 'background: #222; color: #77dd77', detail);

          if (detail) {
            response = [200, {data: detail}];
          } else {
            response = [404, {}];
          }

          return response;
        });

      $httpBackend.whenRoute('GET', API_RESOURCE_LIST_PATH)
        .respond(function(method, url, data, headers, params) {
          console.log('%c GET LIST :: ' + url, 'background: #222; color: #77dd77');

          headers.delay = 1500;


          return [200, {...listResponseMock}];
        });
    }
  });
