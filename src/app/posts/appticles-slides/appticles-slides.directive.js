angular
  .module('appticles.posts')
  .directive('appticlesSlides', AppticlesSlides);

AppticlesSlides.$inject = [];

function AppticlesSlides() {
  return {
    restrict: 'AE',
    scope: {
      posts: '=',
      categories: '='
    },
    controller: SlidesController,
    templateUrl: 'app/posts/appticles-slides/appticles-slides.template.html',
    controllerAs: 'slidesVm',
    bindToController: true,
  };
}

///
class SlidesController {
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

    const articlesPerCard = configuration.articlesPerCard || 'auto';
    this.categories = this.buildCategoriesList(this.categories);
    this.posts = this.combineIntoGroupsOf(articlesPerCard, this.posts);

    this.loadMorePosts = loadMorePosts;
    this.morePostsAvailable = true;
    this.$log = $log;

    $scope.$on('$ionicSlides.sliderInitialized', (event, data) => {
      this.slider = data.slider;
      this.slider.on('slideChangeStart', () => {
        $log.info(this.slider.activeIndex);
        let canLoadMorePosts = this.slider.activeIndex == this.posts.length - 2 && this.morePostsAvailable;
        if (canLoadMorePosts) {
          this.loadMorePosts();
          $log.info('loading more posts');
        }
      });
    });

    this.sliderOptions = {
      initialSlide: 0,
      direction: 'horizontal',
      speed: 300
    };

    function loadMorePosts() {
      if (this.posts.length > 0) {
        let lastPost = this.posts[this.posts.length - 1].slice(-1).pop();
        AppticlesAPI.findPosts({ lastTimestamp: lastPost.timestamp })
          .then(validatePosts)
          .then(buildMorePosts);
      }
    };

    const validatePosts = (result) => {
      let validPosts = AppticlesValidation.validatePosts(result);
      return $q.when(validPosts);
    };

    const buildMorePosts = (result) => {
      if (result.length > 0) {
        this.posts = this.posts.concat(combineIntoGroupsOf(articlesPerCard, result));
        $log.info(this.posts);
      } else {
        this.morePostsAvailable = false;
      }
    };
  }

  /**
   * @ngdoc function
   * @name combineIntoGroupsOf
   * @description Combines elements in a flat array into groups of perPageItemCount number of elements
   *
   * @return {Array} Nested Array, with each element an array of perPageItemCount of elements,
   * and the final element an array of length the remaining number of items after the others have been grouped
   *
   *
   */
  combineIntoGroupsOf (perPageItemCount, itemsToGroup) {
    itemsToGroup.reverse();
    let itemsPerPage = perPageItemCount;
    let results = [];
    let arrayGroups = [];


    if (itemsPerPage === 'auto') {
      let lastGroupCount;
      // we always start with one article on the first page
      perPageItemCount = 1;
      // as long as there are more elements in the list than the number of elements we want per page
      while (itemsToGroup.length > perPageItemCount) {
        // we start with an empty array
        arrayGroups = [];
        // alternate between 1 or 2 items in the array group
        perPageItemCount = lastGroupCount === 1 ? 2 : 1;
        // as long as the array group is not the length we need
        while (arrayGroups.length < perPageItemCount) {
          // keep pushing elements in the array group
          arrayGroups.push(itemsToGroup[itemsToGroup.length - 1]);
          // remove them from the original array
          itemsToGroup.pop();
        }
        // then push the array group in the results array
        results.push(arrayGroups);
        // remember the number of items in the previous iteration
        lastGroupCount = arrayGroups.length;
      }
    }
    // if we want a set number of articles per page
    else {
      if (angular.isNumber(perPageItemCount) && itemsToGroup.length > perPageItemCount) {
        while (itemsToGroup.length > perPageItemCount) {
          arrayGroups = [];
          while (arrayGroups.length < perPageItemCount) {
            arrayGroups.push(itemsToGroup[itemsToGroup.length - 1]);
            itemsToGroup.pop();
          }
          results.push(arrayGroups);
        }
      }
    }
    // push the remaining articles, if there are any into a group of items of their own
    itemsToGroup.length > 0 && results.push(itemsToGroup);

    return results;
  };

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

SlidesController.$inject = ['AppticlesAPI', 'AppticlesValidation', 'AppticlesCanonical', 'configuration', '$stateParams', '$log', '$state', '$q', '$scope', '$ionicLoading'];
