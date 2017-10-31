export default function(jwtInterceptorProvider, $httpProvider) {
  // Configure jwt injection for every request.
  jwtInterceptorProvider.tokenGetter = function(config, jwtHelper, $http, $location, store) {
    const token = store.get('token');
    const isTemplate = config.url.substr(config.url.length - 5) === '.html';
    let isExpired;
    let expiredDate;

    if (!token || isTemplate) {
      return null;
    }

    isExpired = jwtHelper.isTokenExpired(token);
    expiredDate = jwtHelper.getTokenExpirationDate(token);

    if (isExpired) {
      console.log(`[auth]: Token expired at ${expiredDate}.`);

      return $location.path('/logout');
    }

    return token;
  };

  $httpProvider.interceptors.push('jwtInterceptor');
  $httpProvider.interceptors.push('authHttpInterceptor');
};
