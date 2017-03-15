angular.module('appticles.pages', [
  'ui.router',
  'appticles.api',
  'appticles.configuration',
  'appticles.htmlFilter',
  'appticles.canonical'
])
  .config(pagesModule);

pagesModule.$inject = ['$stateProvider', '$urlRouterProvider'];

function pagesModule($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('app.nav.page-details', {
      url: '/page/{pageId:[a-zA-Z0-9]+}',
      views: {
        'postList@app.nav': {
          controller: 'PageDetailsController as pageVm',
          templateUrl: 'app/pages/details/page-details.template.html'
        }
      },
    });
};
