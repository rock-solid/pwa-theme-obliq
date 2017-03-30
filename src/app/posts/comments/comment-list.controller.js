// @todo Add CSS class for styling the active order button
class Comments {
  constructor($log, $q, $state, $stateParams, $ionicLoading, $ionicScrollDelegate, AppticlesAPI, AppticlesValidation) {

    this.postId = $stateParams.postId;
    this.commentStatus = $stateParams.postCommentStatus;
    this.requireNameEmail = $stateParams.postRequireNameEmail;

    this.directiveApi = {
      props: ''
    };

    this.contentLoaded = false;

    const showLoader = () => {
      $ionicLoading.show();
    };

    const hideLoader = () => {
      $ionicLoading.hide();
      this.contentLoaded = true;
    };

    const getCommentList = () => {

      let promises = {
        'comments': AppticlesAPI.findComments({ articleId: this.postId }),
        'article': AppticlesAPI.findOnePosts({ articleId: this.postId })
      };

      return $q.all(promises);
    };

    const validateData = (result) => {
      let validArticle, validComments;

      validComments = AppticlesValidation.validateComments(result.comments);

      if (!this.commentStatus) {
        validArticle = AppticlesValidation.validateOnePosts(result.article);
      }
      else {
        validArticle = result.article;
      }

      if (validComments.error) {
        $state.go('app.nav.post', { postId: this.postId });
        return $q.reject('error fetching comments for this post');
      }

      let promise = {
        comments: validComments,
        article: validArticle
      };

      return $q.when(promise);
    };

    const populateCommentList = (result) => {

      // get post data from the passed state params or from the API response
      let postDetails = result.article;

      this.commentStatus = postDetails['comment_status'] || 'disabled';
      this.postTitle = postDetails.title;
      this.postImg = postDetails.image;


      if (this.commentStatus === 'disabled') {
        $state.go('app.nav.post', { postId: this.postId });
      }
      else {
        this.comments = result.comments;

        // convert numeric ids to numbers (for comments ordering)
        angular.forEach(this.comments, comment => {
          if (!isNaN(parseInt(comment.id))) {
            comment.id = Number(comment.id);
          }
        });

        this.requireNameEmail = postDetails['require_name_email'] || 0;

        // properties to be passed and used by the add-comment modal
        this.directiveApi.props = {
          id: this.postId,
          requireNameEmail: this.requireNameEmail,
        };
      }
    };

    showLoader();
    getCommentList()
      .then(validateData)
      .then(populateCommentList)
      .finally(hideLoader)
      .catch($log.error);
  }
}

Comments.$inject = ['$log', '$q', '$state', '$stateParams', '$ionicLoading', '$ionicScrollDelegate', 'AppticlesAPI', 'AppticlesValidation'];

angular.module('appticles.posts')
  .controller('CommentsController', Comments);
