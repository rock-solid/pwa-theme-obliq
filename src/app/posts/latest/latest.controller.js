class Latest {
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

    this.loadMorePosts = loadMorePosts;
    this.morePostsAvailable = true;
    this.posts = [];
    this.appCover = configuration.defaultCover || '';
    this.$log = $log;
    this.appendSlides = this.appendSlides;
    const articlesPerCard = configuration.articlesPerCard || 'auto';

    $scope.$on('$ionicSlides.sliderInitialized', (event,data) => {
      this.slider = data.slider;
      this.slider.on('slideChangeStart', () => {
        $log.info(this.slider.activeIndex);
        let canLoadMorePosts = this.slider.activeIndex == this.posts.length - 2 && this.morePostsAvailable;
        if(canLoadMorePosts) {
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

    const combineIntoGroupsOf = (perPageItemCount, itemsToGroup) => {
      itemsToGroup.reverse();
      let itemsPerPage = perPageItemCount;
      let results = [];
      let arrayGroups = [];


      if (itemsPerPage === 'auto') {
        let lastGroupCount;
        // articles on the first page
        perPageItemCount = 1;
        while (itemsToGroup.length > perPageItemCount) {
          arrayGroups = [];
          perPageItemCount = lastGroupCount === 1 ? 2 : 1;
          while (arrayGroups.length < perPageItemCount) {
            arrayGroups.push(itemsToGroup[itemsToGroup.length - 1]);
            itemsToGroup.pop();
          }
          results.push(arrayGroups);
          lastGroupCount = arrayGroups.length;
        }
      }
      else {
        if(angular.isNumber(perPageItemCount) && itemsToGroup.length > perPageItemCount) {
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

    const populatePostList = (result) => {
      this.categories = this.buildCategoriesList(result.categories);
      this.posts = combineIntoGroupsOf(articlesPerCard, result.posts);
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


    AppticlesCanonical.set();

    showLoader();

    getCategoriesPosts()
      .then(validateData)
      .then(populatePostList)
      .finally(hideLoader)
      .catch($log.error);
  }

  // @todo Test with posts that don't have a category_id or category_name field
  buildCategoriesList(categoriesData) {

    return categoriesData.reduce(
      (map, category) => {
        map[category.id] = category.name;
        return map;
      },
      {}
    );
  }
}

Latest.$inject = ['AppticlesAPI', 'AppticlesValidation', 'AppticlesCanonical', 'configuration', '$stateParams', '$log', '$state', '$q', '$scope', '$ionicLoading'];

angular.module('appticles.posts')
  .controller('LatestController', Latest);
