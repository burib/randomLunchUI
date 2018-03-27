import {Config, CognitoIdentityCredentials} from 'aws-sdk';
import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails
} from 'amazon-cognito-identity-js';

const appConfig = {
    region: __AWS_REGION__,
    IdentityPoolId: __AWS_IDENTITY_POOL_ID__,
    UserPoolId: __AWS_USERPOOL_ID__,
    ClientId: __AWS_USERPOOL_CLIENT_ID__
  };

Config.region = appConfig.region;
if (appConfig.IdentityPoolId) {
  Config.credentials = new CognitoIdentityCredentials({
      IdentityPoolId: appConfig.IdentityPoolId
    });
}

let userPool = {
    getCurrentUser: () => { return null; }
  };

if (appConfig.UserPoolId && appConfig.ClientId) {userPool = new CognitoUserPool({
      UserPoolId: appConfig.UserPoolId,
      ClientId: appConfig.ClientId
    });
}

const authenticate = (userName, password) => {
    const userData = {
        Username: userName,
        Pool: userPool
      };

    const authenticationData = {
        Username: userName,
        Password: password
      };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
        const callbacks = {
            onSuccess: (result) => {
                resolve({
                    etc: result,
                    token: result.getIdToken().getJwtToken()
                  });
              },
            onFailure: (err) => {
                reject(err.message);
              },
            mfaRequired: (codeDeliveryDetails) => {
                // MFA is required to complete user authentication.
                // Get the code from user and call
                let mfaCode = prompt('MFA code is required!');
                cognitoUser.sendMFACode(mfaCode, callbacks);
              },
            newPasswordRequired: (userAttributes, requiredAttributes) => {
                console.log(userAttributes, requiredAttributes);
                delete userAttributes.email_verified;
                delete userAttributes.phone_number_verified;
                const newPassword = prompt('A new password is required!');

                cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, callbacks);
              }
          };

        cognitoUser.authenticateUser(authenticationDetails, callbacks);
      });
  };

const getCurrentUser = () => {
    var cognitoUser = userPool.getCurrentUser();

    return new Promise((resolve, reject) => {
        if (cognitoUser != null) {
          cognitoUser.getSession(function(err, session) {
              if (err) {
                alert(err);
                return;
              }

              // NOTE: getSession must be called to authenticate user before calling getUserAttributes
              cognitoUser.getUserAttributes(function(err, attributes) {
                  if (err) {
                    // Handle error
                    reject(err.message);
                  } else {
                    // Do something with attributes
                    resolve({
                        isSessionValid: session.isValid(),
                        token: session.getIdToken().getJwtToken(),
                        attributes
                      });
                  }
                });

              Config.credentials = new CognitoIdentityCredentials({
                  IdentityPoolId: appConfig.IdentityPoolId,
                  Logins: {
                      loginKey: session.getIdToken().getJwtToken()
                    }
                });
            });
        } else {
          resolve({
              isSessionValid: false,
              token: null
            });
        }
      });
  };

const isLoggedIn = async () => {
    const currentUser = await getCurrentUser();

    return currentUser.isSessionValid;
  };

export default function($q, $cookies, jwtHelper,
                         store, $location, $rootScope) {
  let next = '/';
  const Auth = {
      isSSOActive: true,
      loginPath: '/login'
    };

  Auth.redirectToLogin = () => {
      const ignoredPaths = ['/error', '/login', '/logout'];
      const currentPath = $location.path();

      if (ignoredPaths.indexOf(currentPath) < 0) {
        next = $location.url();
      }

      return $location.path(Auth.loginPath);
    };

  Auth.redirectToLandingPage = () => {
      $location.path('/');
      $rootScope.$apply();
    };

  /**
   * Initializes the Auth factory's functionality.
   * @param {String} type Node object without ui metrics
   * @return {Object} this Allows for chaining methods.
   */
  Auth.init = () => {
      $rootScope.$on('$routeChangeStart', async (event, next) => {
          if (!next.$$route) {
            return;
          }

          // If the user is not logged in and we're not heading to a public route
          // then block the change and redirect them to login. This works for both
          // manual and programmatic route changes.
          // Get route data.
          const route = next.data || {};
          const _isLoggedIn = await isLoggedIn();
          if (!_isLoggedIn && !route.isPublic) {
            event.preventDefault();
            Auth.logout();
          }

        });

      // This watches for location changes. If we see that a user is not logged
      // then we block their change and force a logout and redirects to /login.
      // If the next url in the change is to /login, we let that happen.

      return this;
    };

  /**
   * Logs user out.
   * @return {Object} this Allows for chaining methods.
   */
  Auth.logout = () => {
      const cognitoUser = userPool.getCurrentUser();

      if (cognitoUser) {
        cognitoUser.signOut();
        Auth.removeToken();
      }
    };

  /**
   * Removes encoded JWT from localStorage.
   * @return {Object} this Allows for chaining methods.
   */
  Auth.removeToken = function() {
      store.remove('token');

      return this;
    };

  /**
   * Sets encoded JWT into localStorage.
   * @param {String} token Encoded JSON Web Token
   * @return {Object} this Allows for chaining methods.
   */
  Auth.setToken = function(IDtoken) {
      store.set('token', IDtoken);

      return this;
    };

  Auth.authenticateUser = (username, pw) => {
      return new Promise((resolve, reject) => {
          authenticate(username, pw).then((user) => {
              Auth.setToken(user.token);
              resolve(user);
            }).catch((err) => {
              reject(err);
            });
        });
    };

  Auth.getCurrentUser = getCurrentUser;

  return Auth;
};
