angular
  .module('appticles.posts')
  .directive('appticlesSocial', AppticlesSocial);

/**
 * @ngdoc directive
 * @name appticles.posts.details.social.AppticlesSocial
 *
 * @description Display share and comments buttons.
 */
function AppticlesSocial() {
  return {
    restrict: 'AE',
    scope: {
      directiveApi: '='
    },
    controller: SocialNetworksController,
    controllerAs: 'socialNetworksVm',
    bindToController: true,
  };
}

/**
 * @ngdoc controller
 * @name appticles.posts.details.social.SocialNetworksController
 *
 * @description Controller for the directive that handles share and comments buttons.
 * @todo Add unit tests
 */
class SocialNetworksController {
  constructor(
    AppticlesAPI,
    configuration,
    $ionicModal,
    $scope,
    $state) {

    this.modal = null;
    this.post = this.directiveApi.data;

    this.hasFacebook = angular.isDefined(configuration.socialMedia.facebook) ? configuration.socialMedia.facebook : false;
    this.hasTwitter = angular.isDefined(configuration.socialMedia.twitter) ? configuration.socialMedia.twitter : false;
    this.hasGoogle = angular.isDefined(configuration.socialMedia.google) ? configuration.socialMedia.google : false;

    this.openComments = openComments;

    // Initialize the modal options
    $ionicModal.fromTemplateUrl('app/posts/details/social/appticles-social.template.html', {
      scope: $scope,
      backdropClickToClose: true
    }).then((modal) => {
      this.modal = modal;
      this.directiveApi.triggerModal = triggerModal;
      this.directiveApi.modalTriggered = false;
    });

    /**
     * @ngdoc function
     * @nameappticles.posts.details.social.SocialNetworksController#triggerModal
     * @description Open the share & comments buttons modal.
     */
    const triggerModal = () => {
      this.modal.show();
      this.directiveApi.modalTriggered = true;
    };

    // Listener for hiding the modal
    $scope.$on('modal.hidden', () => {
      this.directiveApi.modalTriggered = false;
    });

    // Garbage cleaning after modal is deleted
    $scope.$on('$stateChangeStart', () => {
      this.modal.remove();
    });

    /**
     * @ngdoc function
     * @nameappticles.posts.details.social.SocialNetworksController#openComments
     * @description Navigate to the comments route.
     */
    function openComments() {

      if (this.post.from_latest){
        return $state.go('app.nav.post.comments', { postId: this.post.id });
      }

      $state.go('app.nav.postFromCategory.comments', { categorySlugId: this.post.category_id, postId: this.post.id });
    };
  }
};

SocialNetworksController.$inject = ['AppticlesAPI', 'configuration', '$ionicModal', '$scope', '$state'];
