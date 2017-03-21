class PageDetails {
  constructor(AppticlesAPI,
    AppticlesValidation,
    AppticlesCanonical,
    $stateParams,
    $state,
    $log,
    $q,
    $ionicLoading) {

    this.content = '';
    this.image = '';
    this.title = '';
    this.contentLoaded = false;

    const pageId = $stateParams.pageId;


    const showLoader = () => {
      $ionicLoading.show();
    };

    const hideLoader = () => {
      $ionicLoading.hide();
      this.contentLoaded = true;
    };

    const validateOnePages = (result) => {

      let validPageDetails = AppticlesValidation.validateOnePages(result);

      if (validPageDetails.error) {
        $state.go('app.nav.latest');
        return $q.reject('error fetching page details');
      }

      return $q.when(validPageDetails);
    };

    const populatePageDetails = (result) => {

      let pageDetails = result;

      this.content = pageDetails.content;
      this.image = pageDetails.image;
      this.title = pageDetails.title;

      if (pageDetails.link) {
        AppticlesCanonical.set(pageDetails.link);
      }

    };
    showLoader();
    AppticlesAPI
      .findOnePages({ pageId: pageId })
      .then(validateOnePages)
      .then(populatePageDetails)
      .finally(hideLoader)
      .catch($log.error);
  }
}

PageDetails.$inject = ['AppticlesAPI', 'AppticlesValidation', 'AppticlesCanonical', '$stateParams', '$state', '$log', '$q', '$ionicLoading'];

angular.module('appticles.pages')
  .controller('PageDetailsController', PageDetails);
