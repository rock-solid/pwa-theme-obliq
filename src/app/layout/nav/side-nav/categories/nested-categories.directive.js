angular
  .module('appticles.nav')
  .directive('appticlesNestedCategories', AppticlesNestedCategories);

/**
 * @ngdoc directive
 * @name appticles.layout.categories.AppticlesNestedCategories
 *
 * @description Render a menu with categories.
 * @todo Display categories as nested.
 */
function AppticlesNestedCategories() {
  return {
    restrict: 'AE',
    scope: {
      state: '='
    },
    templateUrl: 'app/layout/nav/side-nav/categories/nested-categories.template.html',
    controller: NestedCategoriesController,
    controllerAs: 'nestedCategoriesVm',
    bindToController: true
  };
}

/**
 * @ngdoc controller
 * @name appticles.layout.categories.NestedCategoriesController
 *
 * @description Controller for the directive that loads the categories submenu.
 * @todo Add unit tests
 */
class NestedCategoriesController {
  constructor(
    AppticlesAPI,
    AppticlesValidation,
    configuration,
    $q,
    $ionicScrollDelegate,
    $ionicSideMenuDelegate,
    $state,
    $filter,
    $scope,
    $log) {

    // list of categories displayed in the current view
    this.categories = [];

    this.contentLoaded = false;

    this.goBack = goBack;
    this.openContent = openContent;
    this.loadMoreCategories = loadMoreCategories;

    this.moreCategoriesAvailable = true;
    let page = 1;
    const rows = 10;

    /**
     * @ngdoc function
     * @name appticles.layout.categories.NestedCategoriesController#validateData
     * @description Internal method, validate categories.
     *
     * @param {Promise} A promise object with the categories, returned by the API.
     *
     * @return {Promise} A promise object with an array of validated categories.
     */
    const validateData = (result) => {

      let validCategories = AppticlesValidation.validateCategories(result);

      if (angular.isDefined(validCategories.error)) {
        return $q.reject('error fetching categories');
      }

      let data = {
        categories: validCategories,
        pagination: angular.isDefined(result.data.page)
      };

      return $q.when(data);
    };

    /**
     * @ngdoc function
     * @name appticles.layout.categories.NestedCategoriesController#populateData
     * @description Internal method, bind results to the controller properties.
     *
     * @param {Promise} A promise object with an array of categories and pagination param.
     */
    const populateData = (result) => {

      if (result.categories && result.categories.length > 0) {
        // remove the latest category from the results
        this.categories = result.categories.filter((category) => category.id != 0);
      }

      // check page from response to see if the API supports paginating
      if (!result.pagination) {
        this.moreCategoriesAvailable = false;
      }
    };

    /**
     * @ngdoc function
     * @name appticles.layout.categories.NestedCategoriesController#loadMoreCategories
     * @description Load more categories when scrolling at the bottom of the list.
     */
    function loadMoreCategories() {
      if (this.categories.length > 0) {
        page++;

        AppticlesAPI.findCategories({ withArticles: 1, limit: 1, page: page, rows: rows })
          .then(validateData)
          .then(buildMoreCategories);
      }
    };

    /**
     * @ngdoc function
     * @name appticles.layout.categories.NestedCategoriesController#loadMoreCategories
     * @description Add the loaded categories in the list.
     *
     * @param {Promise} A promise object with an array of categories and pagination param
     */
    const buildMoreCategories = (result) => {

      if (result.categories && result.categories.length > 0) {
        this.categories = this.categories.concat(result.categories);
      } else {
        this.moreCategoriesAvailable = false;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    /**
     * @ngdoc function
     * @name appticles.layout.categories.NestedCategoriesController#openContent
     * @description Navigate to a category.
     *
     * @param {Object} The tapped category.
     */
    function openContent(category) {
      $ionicSideMenuDelegate.toggleRight(false);
      $state.go('app.nav.category', { categorySlug: category.name_slug, categoryId: category.id });
    }

    /**
     * @ngdoc function
     * @name appticles.layout.categories.NestedCategoriesController#goBack
     * @description Close the categories submenu.
     */
    function goBack() {
      this.state = 'root';
    }

    AppticlesAPI.findCategories({ withArticles: 1, limit: 1, page: page, rows: rows })
      .then(validateData)
      .then(populateData)
      .finally(() => {
        this.contentLoaded = true;
      })
      .catch($log.error);
  }
};

NestedCategoriesController.$inject = ['AppticlesAPI', 'AppticlesValidation', 'configuration', '$q', '$ionicScrollDelegate', '$ionicSideMenuDelegate', '$state', '$filter', '$scope', '$log'];
