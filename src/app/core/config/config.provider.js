angular.module('appticles.configuration')
  .provider('configuration', globalConfigurationProvider);

/**
 * @ngdoc service
 * @name appticles.configuration.globalConfigurationProvider
 *
 * @description Wraps over the application configuration provided by the configuration service
 * before the application is bootstrapped
 *
 * @return {Object} The configuration object retrieved from the configuration service
 */
function globalConfigurationProvider() {

  function ConfigurationProvider($window) {
    return $window.appticles.config || {};
  }
  
  ConfigurationProvider.$inject = ['$window'];

  this.$get = ConfigurationProvider;
};
