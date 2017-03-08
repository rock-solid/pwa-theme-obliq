class CategoryList {
  constructor(AppticlesAPI, AppticlesValidation, AppticlesCanonical, $q, $log) {
    this.categoryList = [];
    this.categoryContentLoaded = false;

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
        let categories = result
          .filter((category) => { return category.id !== 0; })
          .sort((a, b) => { return a.order - b.order; });
        this.categoryList = this.buildNestedTree(categories, 0);
      }

      AppticlesCanonical.set();
    };

    AppticlesAPI
      .findCategories({ withArticles: 0 })
      .then(validateCategories)
      .then(populateCategoryList)
      .then(() => {
        this.categoryContentLoaded = true;
      })
      .catch($log.error);

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

CategoryList.$inject = ['AppticlesAPI', 'AppticlesValidation', 'AppticlesCanonical', '$q', '$log'];

angular.module('appticles.categories')
  .controller('CategoryListController', CategoryList);
