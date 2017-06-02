angular.module('appticles.i18n')
  .factory('AppticlesTranslateLoader', AppticlesTranslateLoader)
  .config(AppticlesTranslateConfig);

AppticlesTranslateLoader.$inject = ['$log', '$http', '$q', 'configuration'];
AppticlesTranslateConfig.$inject = ['$translateProvider'];


/**
 * @ngdoc service
 * @name appticles.i18n.AppticlesTranslateLoader
 *
 * @description Async loading for the JSON file with text translations
 *
 */
function AppticlesTranslateLoader($log, $http, $q, configuration) {
  const translationsPath = configuration.translate.path;

  return () => {

    const deferred = $q.defer();

    $http.get(translationsPath)
    .then((translations) => deferred.resolve(translations.data));

    return deferred.promise;
  };
}


/**
 * @name appticles.i18n.AppticlesTranslateConfig
 *
 * @description Configure the translation service, determine language based on the browser settings
 */
function AppticlesTranslateConfig($translateProvider){

  $translateProvider
    .useLoader('AppticlesTranslateLoader')
    .useSanitizeValueStrategy('escape')
    .determinePreferredLanguage();
}
