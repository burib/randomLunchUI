export default function(authService) {
  this.$onInit = () => {
    authService.logout();
    authService.redirectToLogin();
  };
};

