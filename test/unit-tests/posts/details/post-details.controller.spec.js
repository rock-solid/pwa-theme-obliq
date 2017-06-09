describe('posts details controller', () => {

  let $rootScope, createController, apiService, $ionicLoadingMock;

  beforeEach(module('appticles.posts'));
  beforeEach(() => {
    // mock $ionicLoading
    $ionicLoadingMock = jasmine.createSpyObj('$ionicLoading spy', ['show', 'hide']);
    $ionicScrollMock = jasmine.createSpy('getScrollPositionTop');
  });

  beforeEach(
    () => {
      module(function ($provide) {
        $provide.factory('appticles.api', function ($q) {

          let findOneCategories = jasmine.createSpy('findOneCategories').and.callFake(function () {
            let items = {
              'category':
              { id: 1, order: 1, name: 'Category name', name_slug: 'category-name', image: '', parent_id: 0 }
            };
            return $q.when({
              'data': items
            });
          });

          let findOnePosts = jasmine.createSpy('findOnePosts').and.callFake(function () {
            let items = {
              'article': {
                'id': 1379,
                'title': 'Video Test',
                'author': 'alexandra',
                'author_description': '',
                'author_avatar': 'http:\/\/0.gravatar.com\/avatar\/680ab7fc1e594444e04ebb33bb4d94ee?s=50&#038;d=mm&#038;r=g',
                'link': 'http:\/\/dev2.techlady.co\/index.php\/2016\/02\/10\/video-test\/',
                'image': '',
                'date': 'Wed, February 10',
                'timestamp': 1455102149,
                'description': '<p>lorem ipsum text lorem ipsum text lorem ipsum text lorem ipsum text lorem ipsum text lorem&#8230;<\/p>\n', 'content': '<p><iframe width="660" height="371" src="https:\/\/www.youtube.com\/embed\/WVbQ-oro7FQ?feature=oembed" frameborder="0" allowfullscreen=""><\/iframe><\/p>\n<p>lorem ipsum text lorem ipsum text lorem ipsum text lorem ipsum text lorem ipsum text lorem ipsum text lorem ipsum text lorem<\/p>',
                'categories': [1],
                'comment_status': 'open',
                'no_comments': 0,
                'show_avatars': 1,
                'require_name_email': 1
              }
            };
            return $q.when({
              'data': items
            });
          });

          return {
            findOnePosts: findOnePosts,
            findOneCategories: findOneCategories
          };
        });
      });
    }
  );

  beforeEach(inject(function ($injector) {

    // Get hold of a scope (i.e. the root scope)
    $rootScope = $injector.get('$rootScope');

    // The $controller service is used to create instances of controllers
    let $controller = $injector.get('$controller');

    // Create AppticlesAPI mock
    apiService = $injector.get('appticles.api');


    createController = (dependencyObject) => {
      let controllerDependencies = {
        'AppticlesAPI': apiService,
        '$scope': $rootScope,
        '$ionicLoading': $ionicLoadingMock,
        '$ionicScrollDelegate': $ionicScrollMock
      };

      let depsObj = dependencyObject;

      if (depsObj !== null) {
        for (let key in depsObj) {
          if (depsObj.hasOwnProperty(key)) {
            controllerDependencies[key] = depsObj[key];
          }
        }
      }

      return $controller('PostDetailsController', controllerDependencies);
    };
  }));

  it('should set .post property', () => {
    let controller = createController();
    expect(controller.post).not.toBe(undefined);
  });

  it('should make request to load the post', () => {
    stateParams = { postId: '15' };
    let controller = createController({ $stateParams: stateParams });
    let postId = '15';

    expect(apiService.findOnePosts).toHaveBeenCalledWith({
      articleId: postId
    });
  });

  it('should set post data from request', () => {
    let controller = createController();
    $rootScope.$digest();

    expect(controller.post.id).toBeDefined();
    expect(controller.post.content).toBeDefined();
    expect(controller.post.description).toBeDefined();
    expect(controller.post.title).toBeDefined();
    expect(controller.post['no_comments']).toBeDefined();
  });

  ///////////////////////////////////////////////////////////////////


  it('should make a request to get the current category', () => {
    stateParams = { categorySlugId: '1', postId: '1379' };
    let controller = createController({ $stateParams: stateParams });
    let categorySlugId = '1';

    $rootScope.$digest();
    expect(apiService.findOneCategories).toHaveBeenCalledWith({
      categoryId: categorySlugId
    });
  });

});

