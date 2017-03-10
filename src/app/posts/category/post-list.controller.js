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
    this.morePostsAvailable = true;
    this.loadMorePosts = loadMorePosts;
    this.contentLoaded = false;
    this.appCover = configuration.defaultCover || '';

    this.appendSlides = this.appendSlides;
    const articlesPerCard = configuration.articlesPerCard || 'auto';

    const categoryId = $stateParams.categoryId;

    // latest category id should redirect to home
    if (Number(categoryId) === 0) {
      $state.go('app.nav.latest');
      return;
    }

    $scope.$on('$ionicSlides.sliderInitialized', (event, data) => {
      this.slider = data.slider;
      this.slider.on('slideChangeStart', () => {
        $log.info(this.slider.activeIndex);
        let canLoadMorePosts = this.slider.activeIndex == this.postList.length - 2 && this.morePostsAvailable;
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

    const showLoader = () => {
      $ionicLoading.show();
    };

    const hideLoader = () => {
      $ionicLoading.hide();
      this.contentLoaded = true;
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

    const populateData = (result) => {
      this.postList = combineIntoGroupsOf(articlesPerCard, result.validatedPosts);
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

    /**
     * handle loading more posts in the view
     */
    function loadMorePosts() {
      if (this.postList.length > 0) {
        let lastPost = this.postList[this.postList.length - 1].slice(-1).pop();
        AppticlesAPI.findPosts({ lastTimestamp: lastPost.timestamp, 'categoryId': categoryId })
          .then(buildMorePosts);
      }
    };

    const buildMorePosts = (result) => {
      if (result.data.articles.length > 0) {
        this.postList = this.postList.concat(combineIntoGroupsOf(articlesPerCard, result.data.articles));
      } else {
        this.morePostsAvailable = false;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };
  }
}

PostList.$inject = ['AppticlesAPI', 'AppticlesValidation', 'AppticlesCanonical', 'configuration', '$stateParams', '$log', '$state', '$q', '$scope', '$ionicLoading'];

angular.module('appticles.posts')
  .controller('PostListController', PostList);
