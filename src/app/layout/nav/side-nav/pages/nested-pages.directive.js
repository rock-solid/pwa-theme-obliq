angular
  .module('appticles.nav')
  .directive('appticlesNestedPages', AppticlesNestedPages);

AppticlesNestedPages.$inject = ['$log', '$state', '$ionicScrollDelegate', '$ionicSideMenuDelegate'];

function AppticlesNestedPages($log, $state, $ionicScrollDelegate, $ionicSideMenuDelegate) {
  return {
    restrict: 'AE',
    scope: {
      pages: '=',
      directiveApi: '='
    },
    templateUrl: 'app/layout/nav/side-nav/pages/nested-pages.template.html',
    controller: NestedPagesController,
    controllerAs: 'nestedPagesVm',
    bindToController: true
  };
}


class NestedPagesController {
  constructor($log, $document, configuration, $ionicScrollDelegate, $ionicSideMenuDelegate, $state, $filter) {
    this.openContent = openContent;
    this.goBackTo = goBackTo;

    let initialPagelist = this.pages;
    this.currentPages = this.buildNestedTree(this.pages, 0);

    let previousBackButtonTitle = '';
    this.backButtonTitle = $filter('translate')('LINKS.GO_TO');

    const openChildPages = (parentPageId) => {
      // prevent scrolling issues by scrolling to top before updating the pageList
      $ionicScrollDelegate.scrollTop();
      previousBackButtonTitle = this.backButtonTitle;

      let parentPage = this.currentPages.filter((page) => page.id === parentPageId);
      this.backButtonTitle = parentPage[0].title;
      this.currentPages = parentPage[0].children;
      this.currentParentId = this.currentPages[0].parent_id;
    };
    this.openChildPages = openChildPages;

    function goBackTo(parentPageId = 0) {
      if (parentPageId === 0) {
        this.directiveApi.isRoot = true;
        this.directiveApi.pagesVisible = false;
        this.shouldAnimate = false;
      }
      else {
        let parentPageItem = initialPagelist.filter((page) => page.id === parentPageId)[0];
        let listAtParentPageLevel = initialPagelist.filter((page) => page.parent_id === parentPageItem.parent_id);

        this.currentPages = listAtParentPageLevel;
        this.currentParentId = parentPageItem.parent_id;
        let parentOfIncomingList = initialPagelist.filter((page) => page.id === this.currentParentId)[0];
        this.backButtonTitle = this.currentParentId === 0 ? $filter('translate')('LINKS.GO_TO') : parentOfIncomingList.title;
      }
    }

    function openContent(page) {
      if (!page.has_content && page.children.length > 0) {
        openChildPages(page.id);
        return;
      }

      $ionicSideMenuDelegate.toggleRight(false);
      $state.go('app.nav.page-details', { pageId: page.id });
    }
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
};

NestedPagesController.$inject = ['$log', '$document', 'configuration', '$ionicScrollDelegate', '$ionicSideMenuDelegate', '$state', '$filter'];
