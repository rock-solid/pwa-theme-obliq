angular.module('appticles.categories', [
  'ui.router',
  'appticles.api',
  'appticles.validation',
  'appticles.canonical',
  'appticles.htmlFilter'
])
  .config(categoriesModule);

categoriesModule.$inject = ['$stateProvider', '$urlRouterProvider'];

function categoriesModule($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('app.nav.categories', {
      url: '/categories',
      views: {
        'postList@app.nav': {
          controller: 'CategoryListController as categoryVm',
          templateUrl: 'app/categories/list/category-list.template.html'
        }
      }
    });
};
