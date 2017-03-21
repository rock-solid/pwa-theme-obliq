class PostList {
  constructor(AppticlesAPI,
    AppticlesValidation,
    AppticlesCanonical,
    configuration,
    $stateParams,
    $log,
    $state,
    $q,
    $scope,
    $ionicLoading) {

    this.postList = [];
    this.contentLoaded = false;

    const categoryId = $stateParams.categoryId;

    // latest category id should redirect to home
    if (Number(categoryId) === 0) {
      $state.go('app.nav.latest');
      return;
    }

    const showLoader = () => {
      $ionicLoading.show();
    };

    const hideLoader = () => {
      $ionicLoading.hide();
      this.contentLoaded = true;
    };

    const populateData = (result) => {
      this.postList = result.validatedPosts;
      this.hasArticles = angular.copy(result.validatedPosts).length > 0 ? true : false;
      this.category = result.validatedCategory;

      setCanonical(result.validatedCategory);
    };

    const validateData = (result) => {

      let validatedPosts = AppticlesValidation.validatePosts(result.posts);
      let validatedCategory = AppticlesValidation.validateOneCategories(result.category);

      if (validatedPosts.error || validatedCategory.error) {
        $state.go('app.nav.latest');
        return $q.reject('error fetching list of posts or category doesn\'t exist');
      }

      let promises = {
        validatedPosts,
        validatedCategory
      };

      return $q.all(promises);
    };

    // using es6 default value for params to save another if block
    const setCanonical = (result = false) => {
      AppticlesCanonical.set(result.link);
    };

    function getPosts() {
      let promises = {
        posts: AppticlesAPI.findPosts({ categoryId: categoryId }),
        category: AppticlesAPI.findOneCategories({ categoryId: categoryId })
      };

      return $q.all(promises);
    }

    showLoader();

    getPosts()
      .then(validateData)
      .then(populateData)
      .finally(hideLoader)
      .catch($log.error);
  }
}

PostList.$inject = ['AppticlesAPI', 'AppticlesValidation', 'AppticlesCanonical', 'configuration', '$stateParams', '$log', '$state', '$q', '$scope', '$ionicLoading'];

angular.module('appticles.posts')
  .controller('PostListController', PostList);
