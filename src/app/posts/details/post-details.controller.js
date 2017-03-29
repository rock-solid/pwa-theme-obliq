class PostDetails {
  constructor(AppticlesAPI,
    AppticlesValidation,
    AppticlesCanonical,
    configuration,
    $stateParams,
    $state,
    $window,
    $ionicScrollDelegate,
    $scope,
    $log,
    $q,
    $ionicLoading) {

    this.itemIsShown = true;
    this.handleOnScroll = function($event) {
      this.deltaY = (this.lastScrollY) ? $ionicScrollDelegate.getScrollPosition().top - this.lastScrollY : 0;
      // scroll down
      if (this.deltaY > 0 && this.itemIsShown == true) {
        this.itemIsShown = false;
        $scope.$applyAsync();
      }
      // scroll up
      else if (this.deltaY < 0 && this.itemIsShown == false) {
        this.itemIsShown = true;
        $scope.$applyAsync();
      }
      this.lastScrollY = $ionicScrollDelegate.getScrollPosition().top;
    };

    this.handleOnTap = function() {
      this.itemIsShown = !this.itemIsShown ? true : this.itemIsShown;
      $scope.$applyAsync();
    };

    this.contentLoaded = false;
    this.postDetails = '';
    this.category = '';
    this.fromLatest = (angular.isDefined($stateParams.latest) && Number($stateParams.latest) === 1) ||
      (angular.isDefined($stateParams.categorySlugId) && Number($stateParams.categorySlugId) === 0);
    this.hasSocialNetworks = this.checkHasSocialNetwork(configuration.socialMedia);
    this.goBack = goBack;
    this.postCover = configuration.defaultCover;

    this.directiveApi = {
      props: ''
    };

    const postId = $stateParams.postId;
    let categorySlugId = $stateParams.categorySlugId || undefined;

    const showLoader = () => {
      $ionicLoading.show();
    };

    const hideLoader = () => {
      $ionicLoading.hide();
      this.contentLoaded = true;
    };

    const validatePost = (result) => {

      let validPostDetails = AppticlesValidation.validateOnePosts(result);

      if (validPostDetails.error) {
        $state.go('app.nav.latest');
        return $q.reject('error fetching post details');
      }

      this.postDetails = validPostDetails;
      let commentsEnabled = this.postDetails['comment_status'] == 'open' || (this.postDetails['comment_status'] == 'closed' && this.postDetails['no_comments'] > 0);
      this.directiveApi.hasComments = commentsEnabled ? true : false;

      // @todo when do we need to return a promise?
      return $q.when({ 'categories': validPostDetails.categories });
    };

    const getCategory = (result) => {

      // if we don't have a category defined id, get one from the categories list of the post
      if (angular.isUndefined(categorySlugId) || Number(categorySlugId) === 0) {
        categorySlugId = result.categories[0];
      }

      return AppticlesAPI.findOneCategories({ categoryId: categorySlugId });
    };

    const validateCategory = (result) => {

      let validCategory = AppticlesValidation.validateOneCategories(result);

      // check if the category is valid and includes the current post
      if (validCategory.error || !this.postDetails.categories.includes(validCategory.id)) {
        $state.go('app.nav.latest');
        return $q.reject('error fetching category details');
      }

      this.category = validCategory;
    };

    const populatePostDetails = (result) => {

      this.directiveApi.props = {
        'id': this.postDetails.id,
        'title': $window.encodeURIComponent(this.postDetails.title),
        'link': this.postDetails.link,
        'no_comments': this.postDetails.no_comments,
        'comment_status': this.postDetails['comment_status'] || 'disabled',
        'require_name_email': this.postDetails['require_name_email'] || 0
      };

      if (this.postDetails.link) {
        AppticlesCanonical.set(this.postDetails.link);
      }
    };

    function goBack() {
      if (this.fromLatest) {
        return $state.go('app.nav.latest');
      }

      return $state.go('app.nav.category', { categorySlug: this.category['name_slug'], categoryId: this.category.id });

    };

    showLoader();

    AppticlesAPI.findOnePosts({ articleId: postId })
      .then(validatePost)
      .then(getCategory)
      .then(validateCategory)
      .then(populatePostDetails)
      .finally(hideLoader)
      .catch($log.error);
  }

  checkHasSocialNetwork(socialNetworks) {
    let disabledSocialNetworks = 0;
    if (!(angular.isObject(socialNetworks) && !angular.isArray(socialNetworks))) {
      return false;
    }

    Object.keys(socialNetworks).forEach((key) => {
      if (socialNetworks[key] === false)
        disabledSocialNetworks++;
    });

    if (disabledSocialNetworks === Object.keys(socialNetworks).length) {
      return false;
    }
    else {
      return true;
    }
  }
};

PostDetails.$inject = ['AppticlesAPI', 'AppticlesValidation', 'AppticlesCanonical', 'configuration', '$stateParams', '$state', '$window', '$ionicScrollDelegate', '$scope', '$log', '$q', '$ionicLoading'];

angular.module('appticles.posts')
  .controller('PostDetailsController', PostDetails);
