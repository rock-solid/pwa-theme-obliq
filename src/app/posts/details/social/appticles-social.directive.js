angular
  .module('appticles.posts')
  .directive('appticlesSocial', AppticlesSocial);

AppticlesSocial.$inject = [];

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

///
class SocialNetworksController {
  constructor(AppticlesAPI, $stateParams, configuration, $ionicModal, $scope) {

    this.modal = '';
    this.postDetails = this.directiveApi.props;


    $ionicModal.fromTemplateUrl('app/posts/details/social/appticles-social.template.html', {
      scope: $scope,
      backdropClickToClose: true
    }).then((modal) => {
      this.modal = modal;
      this.directiveApi.triggerModal = triggerModal;
      this.directiveApi.modalTriggered = false;
    });


    const triggerModal = () => {
      this.modal.show();
      this.directiveApi.modalTriggered = true;
    };

    $scope.$on('modal.hidden', () => {
      // Execute action
      this.directiveApi.modalTriggered = false;
    });

    this.hasFacebook = angular.isDefined(configuration.socialMedia.facebook) ? configuration.socialMedia.facebook : false;
    this.hasTwitter = angular.isDefined(configuration.socialMedia.twitter) ? configuration.socialMedia.twitter : false;
    this.hasGoogle = angular.isDefined(configuration.socialMedia.google) ? configuration.socialMedia.google : false;

    // garbage cleaning after modal is deleted
    $scope.$on('$stateChangeStart', () => {
      this.modal.remove();
    });
  }
};

SocialNetworksController.$inject = ['AppticlesAPI', '$stateParams', 'configuration', '$ionicModal', '$scope'];
