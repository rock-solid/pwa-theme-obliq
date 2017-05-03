/**
 * @ngdoc controller
 * @name appticles.posts.PostDetails
 *
 * @description Responsible for displaying a post's details.
 */
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
    $q,
    $ionicLoading,
    $log) {

    this.contentLoaded = false;
    this.post = null;
    this.category = null;

    this.fromLatest = angular.isUndefined($stateParams.categorySlugId) || Number($stateParams.categorySlugId) === 0;

    this.hasSocialNetworks = this.checkHasSocialNetworks(configuration.socialMedia);
    this.postCover = configuration.defaultCover;

    this.directiveApi = {
      data: null
    };

    const postId = $stateParams.postId;
    let categorySlugId = $stateParams.categorySlugId || undefined;

    this.buttonsVisible = true;
    this.handleOnScroll = handleOnScroll;
    this.handleOnTap = handleOnTap;
    this.goBack = goBack;

    /**
     * @ngdoc function
     * @name appticles.posts.PostDetails#validatePost
     * @description Internal method, validate post.
     *
     * @param {Promise} A promise with a post object.
     *
     * @return {Promise} A promise with a validated post object.
     */
    const validatePost = (result) => {

      let validPost = AppticlesValidation.validateOnePosts(result);

      if (validPost.error) {
        $state.go('app.nav.latest');
        return $q.reject('error fetching post details');
      }

      this.post = validPost;

      return $q.when({ 'categories': validPost.categories });
    };

    /**
     * @ngdoc function
     * @name appticles.posts.PostDetails#getCategory
     * @description Internal method, make request to read a category.
     *
     * @param {Promise} A promise with a list of categories ids.
     *
     * @return {Promise} A promise for retrieving a category.
     */
    const getCategory = (result) => {

      // if we don't have a category defined id, get one from the categories list of the post
      if (angular.isUndefined(categorySlugId) || Number(categorySlugId) === 0) {
        categorySlugId = result.categories[0];
      }

      return AppticlesAPI.findOneCategories({ categoryId: categorySlugId });
    };

    /**
     * @ngdoc function
     * @name appticles.posts.PostDetails#validateCategory
     * @description Internal method, validate category.
     *
     * @param {Promise} A promise with a category object.
     *
     * @return {Promise} A promise with a validated category object.
     */
    const validateCategory = (result) => {

      let validCategory = AppticlesValidation.validateOneCategories(result);

      // check if the category is valid and includes the current post
      if (validCategory.error || !this.post.categories.includes(validCategory.id)) {
        $state.go('app.nav.latest');
        return $q.reject('error fetching category details');
      }

      this.category = validCategory;
    };

    /**
     * @ngdoc function
     * @name appticles.pages.PageDetails#populateData
     * @description Internal method, bind results to the controller properties.
     */
    const populateData = () => {

      this.directiveApi.data = {
        'id': this.post.id,
        'title': $window.encodeURIComponent(this.post.title),
        'link': this.post.link,
        'no_comments': Number(this.post.no_comments),
        'comment_status': this.post.comment_status || 'disabled',
        'has_comments': Number(this.post.comment_status == 'open' || (this.post.comment_status == 'closed' && this.post.no_comments > 0)),
        'require_name_email': this.post.require_name_email || 0,
        'from_latest': Number(this.fromLatest),
        'category_id': this.category.id
      };

      if (this.post.link) {
        AppticlesCanonical.set(this.post.link);
      }
    };

    /**
     * @ngdoc function
     * @name appticles.posts.PostDetails#goBack
     * @description Go back to a category or latest carousel.
     */
    function goBack() {
      if (this.fromLatest) {
        return $state.go('app.nav.latest');
      }

      return $state.go('app.nav.category', { categorySlug: this.category.name_slug, categoryId: this.category.id });
    };

    /**
     * @ngdoc function
     * @name appticles.posts.PostDetails#handleOnScroll
     * @description Scroll event listener, display / hide back and social buttons.
     *
     * @param {Object} The scroll event
     */
    function handleOnScroll($event) {
      this.deltaY = (this.lastScrollY) ? $ionicScrollDelegate.getScrollPosition().top - this.lastScrollY : 0;
      // scroll down
      if (this.deltaY > 0 && this.buttonsVisible == true) {
        this.buttonsVisible = false;
        $scope.$applyAsync();
      }
      // scroll up
      else if (this.deltaY < 0 && this.buttonsVisible == false) {
        this.buttonsVisible = true;
        $scope.$applyAsync();
      }
      this.lastScrollY = $ionicScrollDelegate.getScrollPosition().top;
    };

    /**
     * @ngdoc function
     * @name appticles.posts.PostDetails#handleOnTap
     * @description Tap event listener, display back and social buttons.
     */
    function handleOnTap() {
      this.buttonsVisible = !this.buttonsVisible ? true : this.buttonsVisible;
      $scope.$applyAsync();
    };

    $ionicLoading.show();

    AppticlesAPI.findOnePosts({ articleId: postId })
      .then(validatePost)
      .then(getCategory)
      .then(validateCategory)
      .then(populateData)
      .finally(() => {
        $ionicLoading.hide();
        this.contentLoaded = true;
      })
      .catch($log.error);
  }

  /**
   * @ngdoc function
   * @name appticles.posts.PostDetails#checkHasSocialNetworks
   * @description Check if social sharing is enabled.
   *
   * @param {Object} The configuration.socialMedia object.
   */
  checkHasSocialNetworks(socialNetworks) {

    let disabledSocialNetworks = 0;

    if (!(angular.isObject(socialNetworks) && !angular.isArray(socialNetworks))) {
      return false;
    }

    Object.keys(socialNetworks).forEach((key) => {
      if (socialNetworks[key] === false) {
        disabledSocialNetworks++;
      }
    });

    return disabledSocialNetworks < Object.keys(socialNetworks).length;
  }
};

PostDetails.$inject = ['AppticlesAPI', 'AppticlesValidation', 'AppticlesCanonical', 'configuration', '$stateParams', '$state', '$window', '$ionicScrollDelegate', '$scope', '$q', '$ionicLoading', '$log'];

angular.module('appticles.posts')
  .controller('PostDetailsController', PostDetails);
