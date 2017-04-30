/**
 * @ngdoc controller
 * @name appticles.pages.PageDetails
 *
 * @description Responsible for displaying a page's details.
 */
class PageDetails {
  constructor(
    AppticlesAPI,
    AppticlesValidation,
    AppticlesCanonical,
    $stateParams,
    $state,
    $q,
    $ionicLoading,
    $log) {

    this.page = null;
    this.contentLoaded = false;

    const pageId = $stateParams.pageId;

    /**
     * @ngdoc function
     * @name appticles.pages.PageDetails#validateData
     * @description Internal method, validate page.
     *
     * @param {Promise} A promise with a page object.
     *
     * @return {Promise} A promise with a validated page object.
     */
    const validateData = (result) => {

      let validPageDetails = AppticlesValidation.validateOnePages(result);

      if (validPageDetails.error) {
        $state.go('app.nav.latest');
        return $q.reject('error fetching page details');
      }

      return $q.when(validPageDetails);
    };

    /**
     * @ngdoc function
     * @name appticles.pages.PageDetails#populateData
     * @description Internal method, bind results to the controller properties.
     *
     * @param {Promise} A promise object with a validated page.
     */
    const populateData = (result) => {

      this.page = result;

      if (angular.isDefined(this.page.link)) {
        AppticlesCanonical.set(this.page.link);
      }
    };

    $ionicLoading.show();

    AppticlesAPI
      .findOnePages({ pageId: pageId })
      .then(validateData)
      .then(populateData)
      .finally(() => {
        $ionicLoading.hide();
        this.contentLoaded = true;
      })
      .catch($log.error);
  }
}

PageDetails.$inject = ['AppticlesAPI', 'AppticlesValidation', 'AppticlesCanonical', '$stateParams', '$state', '$q', '$ionicLoading', '$log'];

angular.module('appticles.pages')
  .controller('PageDetailsController', PageDetails);
