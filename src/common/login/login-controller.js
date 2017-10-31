export default function(authService, $rootScope) {
  this.$onInit = () => {
    this.onSubmit = () => {
      this.isLoading = true;
      delete this.formError;

      if (this.loginForm.$valid) {
        authService.authenticateUser(this.username, this.password).then(() => {
          authService.redirectToLandingPage();
        }).catch((err) => {
          this.formError = err;
          this.isLoading = false;

        }).finally(() => {
          $rootScope.$apply();
        });
      }
    };
  };
};

