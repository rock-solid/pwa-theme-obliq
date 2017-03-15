angular
  .module('appticles.posts')
  .directive('appticlesComments', AppticlesComments);

AppticlesComments.$inject = [];

function AppticlesComments() {
  return {
    restrict: 'AE',
    scope: {
      directiveApi: '='
    },
    controller: CommentsController,
    controllerAs: 'commentsVm',
    bindToController: true,
  };
}

///
class CommentsController {
  constructor(AppticlesAPI, AppticlesValidation, $stateParams, $ionicModal, $scope, $log, $q) {

    this.modal = '';
    this.closeModal = closeModal;
    this.commentList = [];
    this.postDetails = this.directiveApi.props;

    const postId = this.directiveApi.props.id;

    $ionicModal.fromTemplateUrl('app/posts/comments/appticles-comments.template.html', {
      scope: $scope
    }).then((modal) => {
      this.modal = modal;
      this.directiveApi.triggerCommentsModal = triggerCommentsModal;
    });

    const triggerCommentsModal = () => {
      this.modal.show();
    };

    function closeModal() {
      this.modal.hide();
    }

    // garbage cleaning after modal is deleted
    $scope.$on('$stateChangeStart', () => {
      this.modal.remove();
    });

    const validateComments = (result) => {
      let validatedComments = AppticlesValidation.validateComments(result);

      if (validatedComments.error) {
        return $q.reject('error fetching comment list');
      }

      return $q.when(validatedComments);
    };

    const populateCommentList = (result) => {
      if (angular.isUndefined(result.error)) {
        this.commentList = result;
      }
    };

    AppticlesAPI
      .findComments({ articleId: postId })
      .then(validateComments)
      .then(populateCommentList)
      .catch($log.error);
  }
};

CommentsController.$inject = ['AppticlesAPI', 'AppticlesValidation', '$stateParams', '$ionicModal', '$scope', '$log', '$q'];
