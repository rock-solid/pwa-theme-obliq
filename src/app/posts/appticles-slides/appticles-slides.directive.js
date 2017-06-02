angular
  .module('appticles.posts')
  .directive('appticlesSlides', AppticlesSlides);

/**
 * @ngdoc directive
 * @name appticles.posts.AppticlesSlides
 *
 * @description Render a slider with posts.
 */
function AppticlesSlides() {
  return {
    restrict: 'AE',
    scope: {
      posts: '=',
      categories: '=',
      type: '@'
    },
    controller: SlidesController,
    templateUrl: (tElem, tAttrs) => {

      if (tAttrs && tAttrs.type && (tAttrs.type === 'latest' || tAttrs.type === 'category')) {
        return 'app/posts/' + tAttrs.type + '/appticles-slides-' + tAttrs.type + '.template.html';
      }
      else {
        return 'app/posts/latest/appticles-slides-latest.template.html';
      }
    },
    controllerAs: 'slidesVm',
    bindToController: true,
  };
}

/**
 * @ngdoc controller
 * @name appticles.posts.SlidesController
 *
 * @description Controller for the directive that renders a slider with posts.
 */
class SlidesController {
  constructor(
    AppticlesAPI,
    AppticlesValidation,
    configuration,
    $q,
    $scope,
    $log) {

    /**
     * Init slider
     */
    this.sliderOptions = {
      initialSlide: 0,
      direction: 'horizontal',
      speed: 300
    };

    /**
     * Prepare cover and logo to be displayed
     */
    this.appCover = configuration.defaultCover || '';
    this.appLogo = configuration.logo || '';
    this.hasCover = this.type && this.type == 'latest';

    /**
     * Prepare categories and posts to be displayed
     */
    if (this.categories.constructor === Array && this.categories.length > 0) {
      this.categories = this.buildCategoriesList(this.categories);
    }

    const articlesPerCard = configuration.articlesPerCard || 'auto';

    // initialize cover post first, as this mutates the posts array
    this.initializeCoverPost();

    // then combine posts into an array of pages to display them
    this.posts = this.combineIntoGroupsOf(articlesPerCard, this.posts);

    this.morePostsAvailable = this.posts.length > 0;
    this.loadMorePosts = loadMorePosts;

    /**
     * @ngdoc function
     * @name appticles.posts.SlidesController#loadMorePosts
     * @methodOf appticles.posts.SlidesController
     * @description Load more posts in the slider.
     *
     * @return {Promise} A promise object which resolves to an array with posts.
     */
    function loadMorePosts() {

      if (this.posts.length > 0) {

        let lastPost = this.posts[this.posts.length - 1].slice(-1).pop();

        AppticlesAPI.findPosts({ lastTimestamp: lastPost.timestamp, limit: articlesPerCard == 'auto' ? 9 : 10 })
          .then(validatePosts)
          .then(buildMorePosts)
          .catch($log.error);
      }
    };

    /**
     * @ngdoc function
     * @name appticles.posts.SlidesController#validatePosts
     * @methodOf appticles.posts.SlidesController
     * @description Internal method, validate posts.
     *
     * @param {Promise} result A promise object with an array of posts returned by the API.
     *
     * @return {Promise} A promise object with a validated array of posts.
     */
    const validatePosts = (result) => {

      let validPosts = AppticlesValidation.validatePosts(result);

      if (validPosts.error) {
        return $q.reject('error loading more posts');
      }

      return $q.when(validPosts);
    };

    /**
     * @ngdoc function
     * @name appticles.posts.SlidesController#buildMorePosts
     * @methodOf appticles.posts.SlidesController
     * @description Internal method, add more posts groups in the slider.
     *
     * @param {Promise} result A promise object with an array of validated posts.
     */
    const buildMorePosts = (result) => {
      if (result.length > 0) {
        this.posts = this.posts.concat(this.combineIntoGroupsOf(articlesPerCard, result));
      } else {
        this.morePostsAvailable = false;
      }
    };

    /**
     * Listener for the slider, load more posts when reaching the before last slide.
     */
    $scope.$on('$ionicSlides.sliderInitialized', (event, data) => {

      this.slider = data.slider;

      this.slider.on('slideChangeStart', () => {
        let canLoadMorePosts = this.slider.activeIndex == this.posts.length - 2 && this.morePostsAvailable;
        if (canLoadMorePosts) {
          this.loadMorePosts();
        }
      });
    });
  }

  /**
   * @ngdoc function
   * @name appticles.posts.SlidesController#initializeCoverPost
   * @methodOf appticles.posts.SlidesController
   * @description Set the first post as a separate property, if we have a cover.
   */
  initializeCoverPost(){

    this.coverPost = {};

    // if there are posts separate the first post as coverPost
    if (this.hasCover && this.posts.length > 0) {

      // this modifies the existing array of posts to take out first article
      this.coverPost = this.posts.splice(0, 1)[0];
    }
  }

  /**
   * @ngdoc function
   * @name appticles.posts.SlidesController#combineIntoGroupsOf
   * @methodOf appticles.posts.SlidesController
   * @description Split the posts lists into chunks that can be displayed on separate pages.
   *
   * @param {String} articlesPerCard Posts per card (1, 2 or auto - 2,1,2,1, ...)
   * @param {Array} posts Array with posts
   *
   * @return {Array} Nested array, with each element an array of articlesPerCard of elements.
   */
  combineIntoGroupsOf(articlesPerCard, posts) {

    let groups = [], i = 0;
    let chunkSize = angular.isNumber(articlesPerCard) ? articlesPerCard : 2;

    while (i < posts.length){

      groups.push(posts.slice(i, i + chunkSize));

      i += chunkSize;

      if (articlesPerCard == 'auto'){
        chunkSize = chunkSize == 1 ? 2 : 1;
      }
    }

    return groups;
  };

  /**
   * @ngdoc function
   * @name appticles.posts.SlidesController#buildCategoriesList
   * @methodOf appticles.posts.SlidesController
   * @description Index the categories names by their ids.
   *
   * @return {Array} categoriesData List of categories.
   */
  buildCategoriesList(categoriesData) {

    return categoriesData.reduce(
      (map, category) => {
        map[category.id] = category.name;
        return map;
      },
      {}
    );
  }
};

SlidesController.$inject = ['AppticlesAPI', 'AppticlesValidation', 'configuration', '$q', '$scope', '$log'];
