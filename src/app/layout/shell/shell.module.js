angular.module('appticles.base', [
  'ui.router',
  'appticles.api',
  'appticles.configuration'
])
  .config(baseModule);

baseModule.$inject = ['$stateProvider'];

function baseModule($stateProvider) {

  $stateProvider
    .state('app', {
      url: '',
      abstract: true,
      templateUrl: 'app/layout/shell/shell.template.html'
    });
};
