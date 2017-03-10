angular
  .module('appticles.nav')
  .directive('appticlesNestedCategories', AppticlesNestedCategories);

AppticlesNestedCategories.$inject = ['$log', '$state', '$ionicScrollDelegate', '$ionicSideMenuDelegate'];

function AppticlesNestedCategories($log, $state, $ionicScrollDelegate, $ionicSideMenuDelegate) {
  return {
    restrict: 'AE',
    scope: {
      categories: '=',
      directiveApi: '='
    },
    templateUrl: 'app/layout/nav/side-nav/categories/nested-categories.template.html',
    controller: NestedCategoriesController,
    controllerAs: 'nestedCategoriesVm',
    bindToController: true
  };
}


class NestedCategoriesController {
  constructor($log, $document, configuration, $ionicScrollDelegate, $ionicSideMenuDelegate, $state) {
    this.openContent = openContent;
    this.openChildCategories = openChildCategories;
    this.goBackTo = goBackTo;

    let initialCategories = this.categories;
    this.currentCategories = this.buildNestedTree(this.categories, 0);


    function openChildCategories(parentPageId) {
      // prevent scrolling issues by scrolling to top before updating the pageList
      $ionicScrollDelegate.scrollTop();

      let parentPage = this.currentCategories.filter((page) => page.id === parentPageId);
      this.currentCategories = parentPage[0].children;
      this.currentParentId = this.currentCategories[0].parent_id;
    }

    function goBackTo(parentCategoryId = 0) {
      if (parentCategoryId === 0) {
        this.directiveApi.isRoot = true;
        this.shouldAnimate = false;
      }
      else {
        let parentPageItem = initialCategories.filter((page) => page.id === parentCategoryId)[0];
        let listAtParentPageLevel = initialCategories.filter((page) => page.parent_id === parentPageItem.parent_id);

        this.currentCategories = listAtParentPageLevel;
        this.currentParentId = parentPageItem.parent_id;
      }
    }

    function openContent(category) {
      $ionicSideMenuDelegate.toggleRight(false);
      $state.go('app.nav.category', { categorySlug: category.name_slug, categoryId: category.id });
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

NestedCategoriesController.$inject = ['$log', '$document', 'configuration', '$ionicScrollDelegate', '$ionicSideMenuDelegate', '$state'];
