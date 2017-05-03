/**
 * @ngdoc controller
 * @name appticles.layout.SideNavController
 *
 * @description Responsible for loading a side menu and checking if we have pages and categories.
 * @todo Add unit tests
 */
class SideNav {
  constructor(
    AppticlesAPI,
    AppticlesValidation,
    configuration,
    $q,
    $window,
    $translate,
    $log ) {

    this.menuItem = 'root';

    this.hasCategories = false;
    this.hasPages = false;

    this.contentLoaded = false;

    this.websiteUrl = configuration.websiteUrl || '';

    this.openCategories = openCategories;
    this.openPages = openPages;
    this.openDesktopWebsite = openDesktopWebsite;

    /**
     * @ngdoc function
     * @name appticles.layout.SideNavController#getCategoriesPages
     * @description Internal method, call API to load a single category and a page.
     *
     * @return {Promise} A promise object which resolves to an array with a category and a page.
     */
    const getCategoriesPages = () => {

      let promises = {
        categories: AppticlesAPI.findCategories({ page: 1, rows: 1, withArticles: 0 }),
        pages: AppticlesAPI.findPages({ page: 1, rows: 1 })
      };

      return $q.all(promises);
    };

    /**
     * @ngdoc function
     * @name appticles.layout.SideNavController#validateData
     * @description Internal method, validate the category and page.
     *
     * @param {Promise} A promise object with the category and page, returned by the API.
     *
     * @return {Promise} A promise object with a validated category and page or a reject promise.
     */
    const validateData = (result) => {

      let validCategories = AppticlesValidation.validateCategories(result.categories);
      let validPages = AppticlesValidation.validatePages(result.pages);

      if (validPages.error || validCategories.error) {
        return $q.reject('error fetching categories or pages');
      }

      let promises = {
        categories: validCategories,
        pages: validPages
      };

      return $q.all(promises);
    };

    /**
     * @ngdoc function
     * @name appticles.layout.SideNavController#populateData
     * @description Internal method, bind results to the controller properties.
     *
     * @param {Promise} A promise object with a validated category and page.
     */
    const populateData = (result) => {

      this.hasCategories = result.categories.length > 0;
      this.hasPages = result.pages.length > 0;
    };

    /**
     * @ngdoc function
     * @name appticles.layout.SideNavController#confirmNavigation
     * @description Internal method, redirect user to the desktop version.
     *
     */
    const confirmNavigation = (message) => {
      if (confirm(message)) {
        $window.open(this.websiteUrl, '_self', 'location=yes');
      }
    };

    /**
     * @ngdoc function
     * @name appticles.layout.SideNavController#openDesktopWebsite
     * @description Ask user if he wants to navigate to the desktop version.
     *
     */
    function openDesktopWebsite() {
      if (this.websiteUrl) {
        $translate('TEXTS.WEBSITE_CONFIRM')
          .then(confirmNavigation);
      }
    };

    /**
     * @ngdoc function
     * @name appticles.layout.SideNavController#openCategories
     * @description Open the categories submenu.
     *
     */
    function openCategories() {
      this.menuItem = 'categories';
    }

    /**
     * @ngdoc function
     * @name appticles.layout.SideNavController#openPages
     * @description Open the pages submenu.
     *
     */
    function openPages() {
      this.menuItem = 'pages';
    }

    getCategoriesPages()
      .then(validateData)
      .then(populateData)
      .finally(() => {
        this.contentLoaded = true;
      })
      .catch($log.error);
  }
}

SideNav.$inject = ['AppticlesAPI', 'AppticlesValidation', 'configuration', '$q', '$window', '$translate', '$log'];

angular.module('appticles.nav')
  .controller('SideNavController', SideNav);
