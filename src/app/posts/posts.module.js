angular.module('appticles.posts', [
  'ui.router',
  'appticles.api',
  'appticles.validation',
  'appticles.configuration',
  'appticles.canonical',
  'appticles.ads',
  'appticles.htmlFilter'
])
  .config(postsModule);

postsModule.$inject = ['$stateProvider', '$urlRouterProvider'];

function postsModule($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('app.nav.category', {
      url: '/category/:categorySlug/{categoryId:[a-zA-Z0-9]+}',
      views: {
        'postList@app.nav': {
          controller: 'PostListController as listVm',
          templateUrl: 'app/posts/category/post-list.template.html'
        }
      }
    })
    .state('app.nav.latest', {
      url: '/',
      views: {
        'postList@app.nav': {
          controller: 'LatestController as latestVm',
          templateUrl: 'app/posts/latest/latest.template.html'
        }
      }
    })
    .state('app.nav.post', {
      url: '/category/:categorySlugId/article/{postId:[a-zA-Z0-9]+}',
      views: {
        'postList@app.nav': {
          controller: 'PostDetailsController as postDetailsVm',
          templateUrl: 'app/posts/details/post-details.template.html',
        }
      }
    })
    .state('app.nav.postFromHome', {
      url: '/category/:categorySlugId/article/{postId:[a-zA-Z0-9]+}/latest/{latest:[0-1]}',
      views: {
        'postList@app.nav': {
          controller: 'PostDetailsController as postDetailsVm',
          templateUrl: 'app/posts/details/post-details.template.html',
        }
      }
    })
    .state('app.nav.externalPost', {
      url: '/article/{postId:[a-zA-Z0-9]+}',
      views: {
        'postList@app.nav': {
          controller: 'PostDetailsController as postDetailsVm',
          templateUrl: 'app/posts/details/post-details.template.html',
        }
      }
    });


  $urlRouterProvider.otherwise('/');
};
