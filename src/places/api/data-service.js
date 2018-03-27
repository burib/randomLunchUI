import config from './../config';

export const API_BASE_PATH = `${config.API.basePath}`;
export const API_FULL_PATH = `${API_BASE_PATH}/${config.API.prefix}/${config.API.version}`;

export const API_RESOURCE_PATH = `${API_FULL_PATH}/places`;

export default function($resource) {
  const places = $resource(
    API_RESOURCE_PATH,
    {
      id: '@id'
    },
    {
      get: {method: 'GET'},
      query: {method: 'GET', isArray: false},
      post: {
        method: 'POST'
      }
    }
  );

  return {
    query: function(id) {
      this.loading = true;

      return places.query({
        id: id
      }).$promise
        .then((res) => {
          this.data = res;

          return this.data;

        }, (err) => {
          this.error = err.statusText || `Something went wrong.`;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    post: function(payload) {
      this.loading = true;

      return places.post({}, payload).$promise
        .then((res) => {
          this.data = res;

          return this.data;

        }, (err) => {
          this.error = err.statusText || `Something went wrong.`;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  };
};
