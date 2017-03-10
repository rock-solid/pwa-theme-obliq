class SideNav {
  constructor(AppticlesAPI, AppticlesValidation, $q, $log, $window, $translate, configuration) {
    this.currentPages = [];

    this.websiteUrl = configuration.websiteUrl;
    this.openDesktopWebsite = openDesktopWebsite;

    this.shouldAnimate = false;

    this.pageContentLoaded = false;
    this.pageMenuOpen = false;
    this.hasPages = true;

    this.isRoot = true;

    this.loadPages = loadPages;
    this.openChildPages = openChildPages;
    this.goBackTo = goBackTo;

    let initialPagelist = [];


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
        this.currentPages = this.buildNestedTree(pages, 0);
        initialPagelist = pages;
      }
    };

    function goBackTo(parentPageId = 0) {
      if(parentPageId === 0) {
        this.isRoot = true;
        this.shouldAnimate = false;
      }
      else{
        let parentPageItem = initialPagelist.filter((page) => page.id === parentPageId)[0];
        let listAtParentPageLevel = initialPagelist.filter((page) => page.parent_id === parentPageItem.parent_id);

        this.currentPages = listAtParentPageLevel;
        this.currentParentId = parentPageItem.parent_id;
      }
    }

    function openChildPages(parentPageId) {
      let parentPage =this.currentPages.filter((page) => page.id === parentPageId);
      this.currentPages = parentPage[0].children;
      this.currentParentId =this.currentPages[0].parent_id;
    }

    function loadPages() {
      this.isRoot = false;
      this.shouldAnimate = true;

      if(!this.pageContentLoaded) {
        AppticlesAPI
          .findPages()
          .then(validatePages)
          .then(populateSideNav)
          .then(() => {
            this.pageContentLoaded = true;
          })
          .catch($log.error);
      }
    }

    function checkHasPages() {
      let hasPages = AppticlesAPI
        .findPages({ page: 1, rows: 1 })
        .then((res) => res.data.pages && res.data.pages.length > 0 ? true : false);

      return $q.when(hasPages);
    };
    checkHasPages().then(res => this.hasPages = res);
  }

  /**
   * Build tree with the pages/categories.
   * Parent pages/categories will contain a list with their children.
   */
  buildNestedTree(items, parent) {

    return items
      .filter((item) => item.parent_id == parent)
      .map((item) => {
        if (item.id == 0) return item;

        let children = this.buildNestedTree(items, item.id);

        if (children.length > 0) {
          item.children = children;

          // Set active = 0 for parent items, to hide their submenus
          item.active = 0;
        }

        return item;
      });
  }
}

SideNav.$inject = ['AppticlesAPI', 'AppticlesValidation', '$q', '$log', '$window', '$translate', 'configuration'];

angular.module('appticles.nav')
  .controller('SideNavController', SideNav);
