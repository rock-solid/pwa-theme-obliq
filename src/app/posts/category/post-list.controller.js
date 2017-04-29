/**
 * @ngdoc controller
 * @name appticles.posts.PostListController
 *
 * @description Responsible for loading a carousel with the posts from a category.
 */
class PostList {
  constructor(
    AppticlesAPI,
    AppticlesValidation,
    AppticlesCanonical,
    $stateParams,
    $state,
    $q,
    $ionicLoading,
    $log) {

    this.posts = [];
    this.category = null;

    this.contentLoaded = false;

    const categoryId = $stateParams.categoryId;

    // latest category id should redirect to home
    if (Number(categoryId) === 0) {
      $state.go('app.nav.latest');
      return;
    }

    /**
     * @ngdoc function
     * @name appticles.posts.PostListController#getCategoryPosts
     * @description Internal method, call API to load the first batch of posts and the category.
     *
     * @return {Promise} A promise object which resolves to an array with posts and a category.
     */
    const getCategoryPosts = () => {

      let promises = {
        posts: AppticlesAPI.findPosts({ categoryId: categoryId, limit: 10 }),
        category: AppticlesAPI.findOneCategories({ categoryId: categoryId })
      };

      return $q.all(promises);
    };

    /**
     * @ngdoc function
     * @name appticles.posts.PostListController#validateData
     * @description Internal method, validate posts and the category.
     *
     * @param {Promise} A promise object with an array of posts and the category, returned by the API.
     *
     * @return {Promise} A promise object with a validated array of posts and category or a reject promise.
     */
    const validateData = (result) => {

      let validPosts = AppticlesValidation.validatePosts(result.posts);
      let validCategory = AppticlesValidation.validateOneCategories(result.category);

      if (validPosts.error || validCategory.error) {
        $state.go('app.nav.latest');
        return $q.reject('error fetching posts or category doesn\'t exist');
      }

      let promises = {
        posts: validPosts,
        category: validCategory
      };

      return $q.all(promises);
    };

    /**
     * @ngdoc function
     * @name appticles.posts.PostListController#populateData
     * @description Internal method, bind results to the controller properties.
     *
     * @param {Promise} A promise object with a validated array of posts and category.
     */
    const populateData = (result) => {

      this.posts = result.posts;
      this.hasArticles = angular.copy(this.posts).length > 0;
      this.category = result.category;

      AppticlesCanonical.set(this.category.link);
    };

    $ionicLoading.show();

    getCategoryPosts()
      .then(validateData)
      .then(populateData)
      .finally(() => {
        $ionicLoading.hide();
        this.contentLoaded = true;
      })
      .catch($log.error);
  }
}

PostList.$inject = ['AppticlesAPI', 'AppticlesValidation', 'AppticlesCanonical', '$stateParams', '$state', '$q', '$ionicLoading', '$log'];

angular.module('appticles.posts')
  .controller('PostListController', PostList);
