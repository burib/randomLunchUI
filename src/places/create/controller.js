export default function($routeParams, PlacesAPIDataService) {
  this.isFormVisible = false;
  this.isFormSubmitted = false;
  this.showErrors = false;
  const errorMessages = {
    required: ' is required.',
    minlength: 'The minimum length is {{minlength}',
    email: 'invalid email address.',
    name: {
      required: 'This field is very required. (custom error message)'
    }
  };

  this.toggleFormVisibility = () => {
    this.isFormVisible = !this.isFormVisible;
  };


  const setErrorMessage = (element, key) => {
    /**
     * @TODO: pass arguments
     */
    return (errorMessages[element.$name] && errorMessages[element.$name][key]) || element.$name + ' ' + (errorMessages[key] || ' invalid');
  };

  this.validateForm = () => {
    this.showErrors = true;
    let errObj = null;
    this.errorMessages = [];

    angular.forEach(this.userForm.$error, (value, key) => {
      value.forEach((element) => {
        errObj = {
          field: element.$name,
          code: key,
          message: setErrorMessage(element, key)
        };
        this.errorMessages.push(errObj);
      });
    });

  };

  this.submitForm = () => {
    this.isFormSubmitted = true;
    if (this.userForm.$valid) {
      const payload = {
        title: this.userForm.place.$modelValue
      };

      PlacesAPIDataService.post.call(this, payload).then((res) => {
        if (this.onSuccess) {
          this.onSuccess({newPlace: {
            id: res.id,
            title: res.title
          }});
        }
      });
    } else {
      this.validateForm();
    }
  };
};
