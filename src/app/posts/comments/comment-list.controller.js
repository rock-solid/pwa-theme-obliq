/**
 * @ngdoc controller
 * @name appticles.comments.CommentsController
 *
 * @description Display a post's comments.
 * @todo Add CSS class for styling the active order button
 */
class Comments {
  constructor(
    AppticlesAPI,
    AppticlesValidation,
    $state,
    $stateParams,
    $ionicLoading,
    $ionicScrollDelegate,
    $q,
    $log) {

    this.postId = $stateParams.postId;

    this.commentStatus = null;
    this.requireNameEmail = 0;

    this.contentLoaded = false;

    let fromLatest = angular.isUndefined($stateParams.categorySlugId) || Number($stateParams.categorySlugId) === 0;
    let categorySlugId = $stateParams.categorySlugId || undefined;

    this.goBack = goBack;

    /**
     * @ngdoc function
     * @name appticles.comments.CommentsController#getPostComments
     * @methodOf appticles.comments.CommentsController
     * @description Internal method, call API to load the post and its comments.
     *
     * @return {Promise} A promise object which resolves to an array with a post and comments.
     */
    const getPostComments = () => {

      let promises = {
        'post': AppticlesAPI.findOnePosts({ articleId: this.postId }),
        'comments': AppticlesAPI.findComments({ articleId: this.postId })
      };

      return $q.all(promises);
    };

    /**
     * @ngdoc function
     * @name appticles.comments.CommentsController#validateData
     * @methodOf appticles.comments.CommentsController
     * @description Internal method, validate the post and comments.
     *
     * @param {Promise} result A promise object with an array of comments and the post, returned by the API.
     *
     * @return {Promise} A promise object with a validated array of comments and the post or a reject promise.
     */
    const validateData = (result) => {

      let validPost = AppticlesValidation.validateOnePosts(result.post);
      let validComments = AppticlesValidation.validateComments(result.comments);

      if (validPost.error || validComments.error) {
        $state.go('app.nav.post', { postId: this.postId });
        return $q.reject('error fetching post or comments');
      }

      let promise = {
        comments: validComments,
        post: validPost
      };

      return $q.when(promise);
    };

    /**
     * @ngdoc function
     * @name appticles.comments.CommentsController#populateData
     * @methodOf appticles.comments.CommentsController
     * @description Internal method, bind results to the controller properties.
     *
     * @param {Promise} result A promise object with a validated array of comments and the post.
     */
    const populateData = (result) => {

      let postDetails = result.post;

      this.commentStatus = postDetails['comment_status'] || 'disabled';

      // redirect to the post details if comments are disabled
      if (this.commentStatus === 'disabled') {
        $state.go('app.nav.post', { postId: this.postId });
        return;
      }

      this.comments = result.comments;

      // convert numeric ids to numbers (for comments ordering)
      angular.forEach(this.comments, comment => {
        if (!isNaN(parseInt(comment.id))) {
          comment.id = Number(comment.id);
        }
      });

      this.requireNameEmail = Number(postDetails['require_name_email']) || 0;
    };

    /**
     * @ngdoc function
     * @name appticles.comments.CommentsController#goBack
     * @methodOf appticles.comments.CommentsController
     * @description Go back to the post details.
     */
    function goBack() {

      if (fromLatest || !categorySlugId) {
        return $state.go('app.nav.post', { postId: this.postId });
      }

      return $state.go('app.nav.postFromCategory', { categorySlug: categorySlugId, postId: this.postId });
    }

    $ionicLoading.show();

    getPostComments()
      .then(validateData)
      .then(populateData)
      .finally(() => {
        $ionicLoading.hide();
        this.contentLoaded = true;
      })
      .catch($log.error);
  }
}

Comments.$inject = ['AppticlesAPI', 'AppticlesValidation', '$state', '$stateParams', '$ionicLoading', '$ionicScrollDelegate', '$q', '$log'];

angular.module('appticles.posts')
  .controller('CommentsController', Comments);
