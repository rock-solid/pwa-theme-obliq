angular
  .module('appticles.posts')
  .directive('appticlesAddComment', AppticlesAddComment);

/**
 * @ngdoc directive
 * @name appticles.posts.add-comment.AppticlesAddComment
 *
 * @description Add a post comment.
 */
function AppticlesAddComment() {
  return {
    restrict: 'AE',
    controller: AddCommentController,
    scope: {
      postId: '<',
      requireNameEmail: '<'
    },
    controllerAs: 'addCommentVm',
    bindToController: true,
    templateUrl: 'app/posts/add-comment/appticles-add-comment.template.html'
  };
}

/**
 * @ngdoc controller
 * @name appticles.posts.add-comment.AddCommentController
 *
 * @description Controller for the directive that adds post comments.
 * @todo Add unit tests
 */
class AddCommentController {
  constructor(
    AppticlesAPI,
    AppticlesValidation,
    configuration,
    $stateParams,
    $ionicPopup,
    $scope,
    $q,
    $filter) {

    this.submitted = false;
    this.submitComment = submitComment;

    const commentsToken = configuration.commentsToken;

    /**
     * @ngdoc function
     * @name appticles.posts.add-comment.AddCommentController#submitComment
     * @methodOf appticles.posts.add-comment.AddCommentController
     * @description Submit a comment.
     */
    function submitComment() {

      if (this.submitted === true) {
        return;
      }

      this.submitted = true;

      let params = {
        'articleId': this.postId,
        'author': this.commentForm.author.$modelValue,
        'email': this.commentForm.email.$modelValue,
        'comment': this.commentForm.content.$modelValue,
        'code': commentsToken
      };

      if (angular.isDefined(this.requireNameEmail)) {
        params['require_name_email'] = this.requireNameEmail;
      };

      let validComment = AppticlesValidation.validateInsertComments(params);

      if (angular.isUndefined(validComment.error)) {

        $q.when(validComment)
          .then(AppticlesAPI.insertComments)
          .then(showPopup)
          .then(resetForm);
      }
    };

    /**
     * @ngdoc function
     * @name appticles.posts.add-comment.AddCommentController#showPopup
     * @methodOf appticles.posts.add-comment.AddCommentController
     * @description Show a message to the user, after the response from the server is received.
     *
     * @return {Promise} Object with status and popup data.
     */
    const showPopup = (result) => {

      let userFeedback, serverResponse, genericSubmissionError;

      if (result.data) {

        let response = result.data;

        if (response.status !== 0) {

          userFeedback = $filter('translate')('FORMS.AWAITING_MODERATION');

        } else {
          serverResponse = response.message;
          genericSubmissionError = $filter('translate')('FORMS.SUBMIT_ERROR');

          userFeedback =
            `<div>
              <p>${genericSubmissionError}</p>
              <p>${serverResponse}</p>
            </div>`;
        }

      } else {
        genericSubmissionError = $filter('translate')('FORMS.SUBMIT_ERROR');

        userFeedback =
          `<div>
            <p>${genericSubmissionError}</p>
          </div>`;
      }

      let promises = {
        'popup': $ionicPopup.alert({
          okText: 'OK',
          template: userFeedback,
          cssClass: 'popup-text',
          okType: 'popup-button button-custom'
        }),
        'status': result.data ? result.data.status : 0
      };

      return $q.all(promises);
    };

    /**
     * @ngdoc function
     * @name appticles.posts.add-comment.AddCommentController#resetForm
     * @methodOf appticles.posts.add-comment.AddCommentController
     * @description Reset form fields.
     */
    const resetForm = (result) => {

      this.submitted = false;

      if (result.status !== 0) {
        this.author = '';
        this.email = '';
        this.content = '';

        this.commentForm.$setPristine();
        this.commentForm.$setUntouched();
      }
    };
  }
};

AddCommentController.$inject = ['AppticlesAPI', 'AppticlesValidation', 'configuration', '$stateParams', '$ionicPopup',  '$scope', '$q', '$filter'];

