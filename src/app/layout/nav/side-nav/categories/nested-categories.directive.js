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
  constructor($log, $document, configuration, $ionicScrollDelegate, $ionicSideMenuDelegate, $scope, $state, $filter, $q, AppticlesAPI, AppticlesValidation) {

    // this.openChildCategories = openChildCategories;
    //let previousBackButtonTitle = '';
    //this.currentCategories = this.buildNestedTree(this.categories, 0);
    //let initialCategories = this.categories;

    this.goBackTo = goBackTo;
    this.openContent = openContent;
    this.backButtonTitle = $filter('translate')('LINKS.CATEGORIES');
    this.loadMoreCategories = loadMoreCategories;

    const rows = 10;

    const validateCategories = (result) => {

      let validCategories = AppticlesValidation.validateCategories(result);

      if (angular.isDefined(validCategories.error)) {
        $state.go('app.latest');
        return $q.reject('error fetching category list');
      }

      let data = {
        categories: validCategories,
        pagination: result.data.page
      };

      return $q.when(data);
    };

    const populateCategoryList = (result) => {

      this.categories = result.categories;

      // check page from response to see if the API supports paginating
      if (!result.pagination)
        this.moreCategoriesAvailable = false;
    };

    function loadMoreCategories() {
      if (this.categories.length > 0) {
        this.directiveApi.currentPaginationForCategories++;
        AppticlesAPI.findCategories({ withArticles: 0, page: this.directiveApi.currentPaginationForCategories, rows: rows })
          .then(validateCategories)
          .then(buildMoreCategories);
      }
    };

    const buildMoreCategories = (result) => {
      if (result.categories && result.categories.length > 0) {
        this.categories = this.categories.concat(result.categories);
      } else {
        this.directiveApi.moreCategoriesAvailable = false;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    function openContent(category) {
      $ionicSideMenuDelegate.toggleRight(false);
      $state.go('app.nav.category', { categorySlug: category.name_slug, categoryId: category.id });
    }

    function goBackTo(parentCategoryId = 0) {
      if (parentCategoryId === 0) {
        this.directiveApi.isRoot = true;
        this.directiveApi.categoriesVisible = false;
        this.shouldAnimate = false;
      }
      // else {
      //   let parentPageItem = initialCategories.filter((page) => page.id === parentCategoryId)[0];
      //   let listAtParentPageLevel = initialCategories.filter((page) => page.parent_id === parentPageItem.parent_id);

      //   this.currentCategories = listAtParentPageLevel;
      //   this.currentParentId = parentPageItem.parent_id;
      //   let parentOfIncomingList = initialCategories.filter((page) => page.id === this.currentParentId)[0];
      //   this.backButtonTitle = this.currentParentId === 0 ? $filter('translate')('LINKS.CATEGORIES') : parentOfIncomingList.name;
      // }
    }
  }
    // TODO enable after dashboard modifications are made

    // function openChildCategories(parentPageId) {
    //   // prevent scrolling issues by scrolling to top before updating the pageList
    //   $ionicScrollDelegate.scrollTop();
    //   previousBackButtonTitle = this.backButtonTitle;

    //   let parentPage = this.currentCategories.filter((page) => page.id === parentPageId);
    //   this.backButtonTitle = parentPage[0].name;
    //   this.currentCategories = parentPage[0].children;
    //   this.currentParentId = this.currentCategories[0].parent_id;

    // }



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

NestedCategoriesController.$inject = ['$log', '$document', 'configuration', '$ionicScrollDelegate', '$ionicSideMenuDelegate', '$scope', '$state', '$filter', '$q', 'AppticlesAPI' , 'AppticlesValidation'];
