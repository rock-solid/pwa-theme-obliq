angular
  .module('appticles.nav')
  .directive('appticlesNestedPages', AppticlesNestedPages);

/**
 * @ngdoc directive
 * @name appticles.layout.pages.AppticlesNestedPages
 *
 * @description Render a menu with nested pages.
 */
function AppticlesNestedPages() {
  return {
    restrict: 'AE',
    scope: {
      menuItem: '=',
    },
    templateUrl: 'app/layout/nav/side-nav/pages/nested-pages.template.html',
    controller: NestedPagesController,
    controllerAs: 'nestedPagesVm',
    bindToController: true
  };
}

/**
 * @ngdoc controller
 * @name appticles.layout.pages.NestedPagesController
 *
 * @description Controller for the directive that loads the pages submenu.
 *
 * @todo Add unit tests
 */
class NestedPagesController {
  constructor(
    AppticlesAPI,
    AppticlesValidation,
    configuration,
    $q,
    $ionicScrollDelegate,
    $ionicSideMenuDelegate,
    $state,
    $filter,
    $log) {

    // list of all pages read from the API
    this.allPages = [];

    // list of pages displayed in the current view
    this.pages = [];

    this.contentLoaded = false;

    // the top level parent of the submenu
    this.currentParent = {
      'id': 0,
      'title': $filter('translate')('LINKS.GO_TO')
    };

    this.openChildPages = openChildPages;
    this.goBack = goBack;
    this.openContent = openContent;

    /**
     * @ngdoc function
     * @name appticles.layout.pages.NestedPagesController#validateData
     * @methodOf appticles.layout.pages.NestedPagesController
     * @description Internal method, validate pages.
     *
     * @param {Promise} result A promise object with the pages, returned by the API.
     *
     * @return {Promise} A promise object with an array of validated pages.
     */
    const validateData = (result) => {

      let validPages = AppticlesValidation.validatePages(result);

      if (angular.isDefined(validPages.error)) {
        return $q.reject('error fetching pages');
      }

      return $q.when(validPages);
    };

    /**
     * @ngdoc function
     * @name appticles.layout.pages.NestedPagesController#populateData
     * @methodOf appticles.layout.pages.NestedPagesController
     * @description Internal method, bind results to the controller properties.
     *
     * @param {Promise} result A promise object with an array of pages.
     */
    const populateData = (result) => {

      if (result.length > 0) {

        this.allPages = this.checkChildren(result);
        this.pages = this.getChildPagesByParentId(0);
      }
    };

    /**
     * @ngdoc function
     * @name appticles.layout.pages.NestedPagesController#openChildPages
     * @methodOf appticles.layout.pages.NestedPagesController
     * @description Open submenu when a parent page is clicked.
     *
     * @param {Object} page The page that was clicked.
     */
    function openChildPages(page) {

      // prevent scrolling issues by scrolling to top before updating the page list
      $ionicScrollDelegate.scrollTop();

      this.currentParent = page;
      this.pages = this.getChildPagesByParentId(page.id);
    };

    /**
     * @ngdoc function
     * @name appticles.layout.pages.NestedPagesController#goBack
     * @methodOf appticles.layout.pages.NestedPagesController
     * @description Go up one level in the page hierarchy.
     */
    function goBack() {

      if (this.currentParent.id === 0) {
        // exit the pages menu
        this.menuItem = 'root';
      } else {

        let page = this.getPageById(this.currentParent.id);

        if (page !== false) {

          if (page.parent_id == 0){

            this.currentParent = {
              'id': 0,
              'title': $filter('translate')('LINKS.GO_TO')
            };

          } else {

            let parentPage = this.getPageById(page.parent_id);

            if (parentPage !== false) {
              this.currentParent = parentPage;
            }
          }

          this.pages = this.getChildPagesByParentId(this.currentParent.id);
        }
      }
    }

    /**
     * @ngdoc function
     * @name appticles.layout.pages.NestedPagesController#openContent
     * @methodOf appticles.layout.pages.NestedPagesController
     * @description Open the page's details or submenu if the page doesn't have any content.
     *
     * @param {Object} page The page that was clicked.
     */
    function openContent(page) {
      if (!page.has_content && page.has_children) {
        this.openChildPages(page);
        return;
      }

      $ionicSideMenuDelegate.toggleRight(false);
      $state.go('app.nav.page-details', { pageId: page.id });
    }

    AppticlesAPI.findPages()
      .then(validateData)
      .then(populateData)
      .finally(() => {
        this.contentLoaded = true;
      })
      .catch($log.error);
  }

  /**
   * @ngdoc function
   * @name appticles.layout.pages.NestedPagesController#getPageById
   * @methodOf appticles.layout.pages.NestedPagesController
   * @description Search a page by its id in the list of pages.
   *
   * @param {Number} id The id of the page
   */
  getPageById(id) {

    let filteredPages = this.allPages.filter((page) => page.id === id);

    if (filteredPages.length > 0){
      return filteredPages[0];
    }

    return false;
  }

  /**
   * @ngdoc function
   * @name appticles.layout.pages.NestedPagesController#getChildPagesByParentId
   * @methodOf appticles.layout.pages.NestedPagesController
   * @description Search pages by their parent id in the list of pages.
   *
   * @param {Number} parentId The id of the parent
   */
  getChildPagesByParentId(parentId) {
    return this.allPages.filter((page) => page.parent_id === parentId);
  }

  /**
   * @ngdoc function
   * @name appticles.layout.pages.NestedPagesController#checkChildren
   * @methodOf appticles.layout.pages.NestedPagesController
   * @description Attach a has_children property to the list of pages.
   *
   * @param {Array} items A list of pages objects
   */
  checkChildren(items) {

    return items
      .map((item) => {

        let children = items.filter((child) => child.parent_id == item.id);
        item.has_children = children.length > 0;

        return item;
      });
  }
};

NestedPagesController.$inject = ['AppticlesAPI', 'AppticlesValidation', 'configuration', '$q', '$ionicScrollDelegate', '$ionicSideMenuDelegate', '$state', '$filter', '$log'];
