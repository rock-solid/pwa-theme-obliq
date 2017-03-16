class SideNav {
  constructor(AppticlesAPI, AppticlesValidation, $q, $log, $window, $translate, configuration) {
    this.allPages = [];
    this.allCategories = [];

    this.websiteUrl = configuration.websiteUrl;
    this.openDesktopWebsite = openDesktopWebsite;

    this.pageContentLoaded = false;
    this.categoryContentLoaded = false;

    this.loadPages = loadPages;
    this.loadCategories = loadCategories;

    this.hasCategories = true;
    this.hasPages = true;

    this.directiveApi = {
      isRoot: true,
      pagesVisible: false,
      categoriesVisible: false
    };

    this.loadPages = loadPages;

    const confirmNavigation = (message) => {

      if (confirm(message)) {
        $window.open(this.websiteUrl, '_self', 'location=yes');
      }
    };

    function openDesktopWebsite() {
      if (this.websiteUrl) {
        $translate('TEXTS.WEBSITE_CONFIRM')
          .then(confirmNavigation);
      }
    };

    const validatePages = (result) => {

      let validPages = AppticlesValidation.validatePages(result);

      if (angular.isDefined(validPages.error)) {
        return $q.reject('error fetching page list');
      }

      return $q.when(validPages);
    };

    const populateSideNav = (result) => {
      // sort pages
      if (angular.isDefined(result)) {
        let pages = result.sort((a, b) => { return a.order - b.order; });
        this.allPages = pages;
      }
    };

    function loadPages() {

      // if we haven't already loaded the pages
      if(!this.pageContentLoaded) {
        AppticlesAPI
          .findPages()
          .then(validatePages)
          .then(populateSideNav)
          .then(() => {
            this.pageContentLoaded = true;
            this.directiveApi.isRoot = false;
            this.directiveApi.pagesVisible = true;
          })
          .catch($log.error);
      }
      else {
        this.pageContentLoaded = true;
        this.directiveApi.isRoot = false;
        this.directiveApi.pagesVisible = true;
      }
    }

    function checkHasPages() {
      let hasPages = AppticlesAPI
        .findPages({ page: 1, rows: 1 })
        .then((res) => res.data.pages && res.data.pages.length > 0 ? true : false);

      return $q.when(hasPages);
    };
    checkHasPages().then(res => this.hasPages = res);


    function checkHasCategories() {
      let hasCategories = AppticlesAPI
        .findCategories({ withArticles: 0, page: 1, rows: 1 })
        .then((res) => res.data.categories && res.data.categories.length > 0 ? true : false);

      return $q.when(hasCategories);
    };
    checkHasCategories().then(res => this.hasCategories = res);


    const validateCategories = (result) => {

      let validCategories = AppticlesValidation.validateCategories(result);

      if (angular.isDefined(validCategories.error)) {
        return $q.reject('error fetching category list');
      }

      return $q.when(validCategories);
    };

    const populateCategoryList = (result) => {
      // sort pages
      if (angular.isDefined(result)) {
        let categories = result.sort((a, b) => { return a.order - b.order; }).filter(category => category.id !== 0);
        this.allCategories = categories;
      }
    };

    function loadCategories() {

      if(!this.categoryContentLoaded) {
        AppticlesAPI
          .findCategories({ withArticles: 0 })
          .then(validateCategories)
          .then(populateCategoryList)
          .then(() => {
            this.categoryContentLoaded = true;
            this.directiveApi.isRoot = false;
            this.directiveApi.categoriesVisible = true;
          })
          .catch($log.error);
      }
      else {
        this.categoryContentLoaded = true;
        this.directiveApi.isRoot = false;
        this.directiveApi.categoriesVisible = true;
      }
    }


  }
}

SideNav.$inject = ['AppticlesAPI', 'AppticlesValidation', '$q', '$log', '$window', '$translate', 'configuration'];

angular.module('appticles.nav')
  .controller('SideNavController', SideNav);
