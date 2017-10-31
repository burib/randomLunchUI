export default function($q, $location, authService, store) {
  return {
    responseError: function(rejection) {
      const errorConfig = rejection.config || {};
      const errorData = rejection.data || {};
      const errorStatus = rejection.status || errorData.code;
      const statusIgnoreList = errorConfig.ignoreStatuses || [];
      const isStatusIgnored = statusIgnoreList.indexOf(errorStatus) > -1;
      const errorActions = {
        401: () => {
          authService.redirectToLogin();
        },
        403: () => {
          console.warn('NO_ACCESS');
        }
      };

      if(errorActions[errorStatus] && !isStatusIgnored) {
        errorActions[errorStatus]();
      }

      return $q.reject(rejection);
    },
    request: (config) => {
      config.headers = config.headers || {};

      if (store.get('token')) {
        config.headers.Authorization = `${store.get('token')}`;
      };

      return config;
    }
  };
};
