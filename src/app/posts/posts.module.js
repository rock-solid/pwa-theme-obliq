angular.module('appticles.posts', [
  'ui.router',
  'ionic-pullup',
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
      url: '/article/{postId:[a-zA-Z0-9]+}',
      views: {
        'postList@app.nav': {
          controller: 'PostDetailsController as postDetailsVm',
          templateUrl: 'app/posts/details/post-details.template.html',
        }
      }
    })
    .state('app.nav.postFromCategory', {
      url: '/category/:categorySlugId/article/{postId:[a-zA-Z0-9]+}',
      views: {
        'postList@app.nav': {
          controller: 'PostDetailsController as postDetailsVm',
          templateUrl: 'app/posts/details/post-details.template.html',
        }
      }
    })
    .state('app.nav.post.comments', {
      url: '/comments',
      views: {
        'postList@app.nav': {
          controller: 'CommentsController as commentsVm',
          templateUrl: 'app/posts/comments/comment-list.template.html',
        }
      }
    })
    .state('app.nav.postFromCategory.comments', {
      url: '/comments',
      views: {
        'postList@app.nav': {
          controller: 'CommentsController as commentsVm',
          templateUrl: 'app/posts/comments/comment-list.template.html',
        }
      }
    });


  $urlRouterProvider.otherwise('/');
};
