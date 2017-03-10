angular.module('appticles.nav', [
  'ui.router',
  'appticles.api',
  'appticles.i18n',
  'appticles.configuration'
])
  .config(navModule);

navModule.$inject = ['$stateProvider', '$urlRouterProvider'];

function navModule($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('app.nav', {
      url: '',
      abstract: true,
      views: {
        'navView@app': {
          templateUrl: 'app/layout/nav/nav.template.html'
        },
        'sideNavView@app': {
          controller: 'SideNavController as navSideVm',
          templateUrl: 'app/layout/nav/side-nav/side-nav.template.html'
        }
      }
    });

  $urlRouterProvider.otherwise('/');
};
