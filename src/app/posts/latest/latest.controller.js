class Latest {
  constructor(AppticlesAPI,
    AppticlesValidation,
    AppticlesCanonical,
    configuration,
    $log,
    $q,
    $ionicLoading) {

    this.posts = [];
    this.appCover = configuration.defaultCover || '';

    const showLoader = () => {
      $ionicLoading.show();
    };

    const hideLoader = () => {
      $ionicLoading.hide();
      this.contentLoaded = true;
    };

    const getCategoriesPosts = () => {
      let promises = {
        categories: AppticlesAPI.findCategories({ withArticles: 0 }),
        posts: AppticlesAPI.findPosts()
      };

      return $q.all(promises);
    };

    const validateData = (result) => {
      let validPosts, validFirstPost, validCategories;

      validPosts = AppticlesValidation.validatePosts(result.posts);
      validCategories = AppticlesValidation.validateCategories(result.categories);

      if (validPosts.error || validCategories.error) {
        return $q.reject('error fetching posts or categories');
      }

      let promise = {
        posts: validPosts,
        categories: validCategories
      };

      return $q.when(promise);
    };

    const populatePostList = (result) => {
      this.categories = result.categories;
      this.posts = result.posts;
    };

    AppticlesCanonical.set();
    showLoader();

    getCategoriesPosts()
      .then(validateData)
      .then(populatePostList)
      .finally(hideLoader)
      .catch($log.error);
  }
}

Latest.$inject = ['AppticlesAPI', 'AppticlesValidation', 'AppticlesCanonical', 'configuration', '$log', '$q', '$ionicLoading'];

angular.module('appticles.posts')
  .controller('LatestController', Latest);
