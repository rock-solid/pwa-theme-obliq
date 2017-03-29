angular
  .module('appticles.posts')
  .directive('appticlesAddComment', AppticlesAddComment);

AppticlesAddComment.$inject = [];

function AppticlesAddComment() {
  return {
    restrict: 'AE',
    controller: AddCommentController,
    scope: {
      directiveApi: '<'
    },
    controllerAs: 'addCommentVm',
    bindToController: true,
    templateUrl: 'app/posts/add-comment/appticles-add-comment.template.html'
  };
}

///
class AddCommentController {
  constructor(AppticlesAPI, AppticlesValidation, $stateParams, $ionicPopup, configuration, $scope, $log, $q, $filter) {

    this.postId = this.directiveApi.props.id;
    this.requireNameEmail = Number(this.directiveApi.props['require_name_email']);
    this.postComment = postComment;
    this.submitted = false;

    const commentsToken = configuration.commentsToken;

    function postComment() {

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


    const showPopup = (result) => {

      let response = result.data;
      let userFeedback;
      let serverResponse;
      let genericSubmissionError;

      if (response.status !== 0) {
        userFeedback = $filter('translate')('FORMS.AWAITING_MODERATION');
      }
      else {
        serverResponse = response.message;
        genericSubmissionError = $filter('translate')('FORMS.SUBMIT_ERROR');

        userFeedback =
          `<div>
            <p>${genericSubmissionError}</p>
            <p>${serverResponse}</p>
          </div>`;
      }

      let promises = {
        'popup': $ionicPopup.alert({
          okText: 'OK',
          template: userFeedback,
          cssClass: 'popup-text',
          okType: 'popup-button button-custom'
        }),
        'status': response.status
      };

      return $q.all(promises);
    };

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

AddCommentController.$inject = ['AppticlesAPI', 'AppticlesValidation', '$stateParams', '$ionicPopup', 'configuration', '$scope', '$log', '$q', '$filter'];

