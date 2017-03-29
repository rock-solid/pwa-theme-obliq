angular
  .module('appticles.posts')
  .directive('appticlesSlides', AppticlesSlides);

AppticlesSlides.$inject = [];

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

      if(tAttrs && tAttrs.type) {
        return 'app/posts/' + tAttrs.type + '/appticles-slides-' + tAttrs.type + '.template.html';
      }
      else {
        return 'app/posts/latests/appticles-slides-latest.template.html';
      }
    },
    controllerAs: 'slidesVm',
    bindToController: true,
  };
}

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
    this.categories = this.categories.length > 1 ? this.buildCategoriesList(this.categories) : this.categories;

    let appCover = configuration.defaultCover;
    let appLogo = configuration.logo || '';
    let hasCover = this.type && this.type == 'latest' ? true : false;

    // initialize coverPost first as this mutates the posts array
    this.coverPost = this.initializeCoverPost(this.posts, hasCover, {appCover, appLogo});

    // then combine posts in to array of pages to display them
    this.posts = this.combineIntoGroupsOf(articlesPerCard, this.posts);


    this.loadMorePosts = loadMorePosts;
    this.morePostsAvailable = true;
    this.$log = $log;

    $scope.$on('$ionicSlides.sliderInitialized', (event, data) => {
      this.slider = data.slider;
      this.slider.on('slideChangeStart', () => {
        let canLoadMorePosts = this.slider.activeIndex == this.posts.length - 2 && this.morePostsAvailable;
        if (canLoadMorePosts) {
          this.loadMorePosts();
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
        this.posts = this.posts.concat(this.combineIntoGroupsOf(articlesPerCard, result));
      } else {
        this.morePostsAvailable = false;
      }
    };
  }

  initializeCoverPost(posts, hasCover, options) {
    let coverPost = {};

    // if there are posts separate the first post as coverPost
    if(hasCover && posts.length > 0) {
      coverPost = posts.splice(0, 1)[0]; // this modifies the existing array of posts to take out first article
    }

    //otherwise just attach the options to an object so we have a visible cover and a logo
    if (Object.keys(options).length > 0) {
      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          coverPost[key] = options[key];
        }
      }
    }

    return coverPost;
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
    // push the array of remaining articles in reverse order in the results array so chronological order is kept
    itemsToGroup.length > 0 && results.push(itemsToGroup.reverse());

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
