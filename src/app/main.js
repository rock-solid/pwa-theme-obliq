/**
 * Take the response object received from the `$http` call to the configuration service
 * and store it into a global variable on the `appticles` namespace for quick retrieval
 *
 * @param  {Object} response The output returned by an `$http` call
 * @return {Object|Promise}  The configuration options already set on the global object
 */
const initializeConfiguration = (response) => {
  const $initInjector = angular.injector(['ng']);
  const $window = $initInjector.get('$window');
  $window.appticles = {
    config: response.data
  };
  return $window.appticles;
};

/**
 * Manually bootstrap the application instead of relying on the `ng-app` directive.
 * Allows a higher degree of flexibility in terms of application startup manipulation
 */
const boostrapApplication = () => {
  angular.element(document).ready(function() {
    angular.bootstrap(document, ['appticles']);
  });
};

/**
 * Retrieve the application configuration from the config server. This allows us
 * to keep the configuration outside the codebase and make the code environment-agnostic.
 * By only manipulating the endpoint from which the application pulls its config, we
 * have independent applications.
 *
 * @return {Promise|any} A promise that resolves to the data retrieved from the configuration service
 */
const fetchConfig = () => {
  const $initInjector = angular.injector(['ng']);
  const $http = $initInjector.get('$http');
  const $window = $initInjector.get('$window');
  return $http.get(`${$window.__APPTICLES_BOOTSTRAP_DATA__.CONFIG_PATH}`);
};

/**
 * Prints any error that might occur during application bootstrap
 * @param  {Object} error
 */
const errorHandler = (error) => {
  const $initInjector = angular.injector(['ng']);
  const $log = $initInjector.get('$log');

  $log.error('Application bootstrap error: ', error);
};

fetchConfig()
  .then(initializeConfiguration)
  .then(boostrapApplication)
  .catch(errorHandler);
