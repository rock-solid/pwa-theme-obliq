describe('latest controller', () => {

  let $rootScope, createController, apiService, $ionicLoadingMock;

  beforeEach(() => {
    module('appticles.posts');
  });

  beforeEach(() => {
    // mock $ionicLoading
    $ionicLoadingMock = jasmine.createSpyObj('$ionicLoading spy', ['show', 'hide']);
  });

  beforeEach(
    () => {
      module(function ($provide) {
        $provide.factory('appticles.api', function ($q) {

          let findCategories = jasmine.createSpy('findCategories').and.callFake(function () {
            let items = {
              'categories': [{
                'id': 0,
                'order': 1,
                'name': 'Latest',
                'name_slug': 'Latest',
                'image': '',
                'articles': [{
                  'id': 1,
                  'title': 'Post Title',
                  'author': 'Author name',
                  'link': 'http:\/\/blog.dummydomainname.com\/2016\/03\/11\/post-title\/',
                  'image': '',
                  'date': 'Fri, March 11',
                  'timestamp': 1457735104,
                  'description': '<p>This is the article description, a part of the content<\/p>',
                  'content': '',
                  'categories': [2]
                },
                {
                  'id': 2,
                  'title': 'Posta Titles',
                  'author': 'Authoar names',
                  'link': 'http:\/\/blog.dummydomainname.com\/2016\/03\/11\/post-title\/',
                  'image': '',
                  'date': 'Fri, March 11',
                  'timestamp': 1457735104,
                  'description': '<p>Thiss is the article description number 2, a part of the content<\/p>',
                  'content': '',
                  'categories': [2]
                }
                ]
              }, {
                'id': 1,
                'order': 2,
                'name': 'Post category',
                'name_slug': 'post-category',
                'link': 'http:\/\/blog.dummydomainname.com\/category\/post-category\/',
                'image': {
                  'src': 'http:\/\/blog.dummydomainname.com\/wp-content\/uploads\/2013\/03\/featured-image-vertical.jpg',
                  'width': 300,
                  'height': 580
                },
                'articles': [{
                  'id': 1,
                  'title': 'Post Title',
                  'author': 'Author name',
                  'link': 'http:\/\/blog.dummydomainname.com\/2016\/03\/11\/post-title\/',
                  'image': '',
                  'date': 'Fri, March 11',
                  'timestamp': 1457735104,
                  'description': '<p>This is the article description, a part of the content<\/p>',
                  'content': '',
                  'categories': [2]
                }, {
                  'id': 4,
                  'title': 'Postus Titlus',
                  'author': 'Author namus',
                  'link': 'http:\/\/blog.dummydomainname.com\/2016\/03\/11\/post-title\/',
                  'image': '',
                  'date': 'Fri, March 11',
                  'timestamp': 1457735106,
                  'description': '<p>Thisus isus the articleus description, a part of the content<\/p>',
                  'content': '',
                  'categories': [2]
                }]
              }]
            };
            return $q.when({
              'data': items
            });
          });

          let findPosts = jasmine.createSpy('findPosts').and.callFake((paramObj) => {
            let postList = {
              'articles': [
                {
                  'id': 1,
                  'title': 'Post Title',
                  'author': 'Author name',
                  'link': 'http:\/\/blog.dummydomainname.com\/2016\/03\/11\/post-title\/',
                  'image': '',
                  'date': 'Fri, March 11',
                  'timestamp': 1457735104,
                  'description': '<p>This is the article description, a part of the content<\/p>',
                  'content': '',
                  'categories': [2]
                },
                {
                  'id': 5,
                  'title': 'Another Post Title',
                  'author': 'Author Name',
                  'link': 'http:\/\/blog.dummydomainname.com\/2012\/12\/09\/another-post-title\/',
                  'image': {
                    'src': 'http:\/\/blog.dummydomainname.com\/wp-content\/uploads\/2013\/03\/featured-image-vertical.jpg',
                    'width': 300,
                    'height': 580
                  },
                  'date': 'December 09, 2012',
                  'timestamp': 1355043654,
                  'description': '<p>This is the article description, a part of the content<\/p>',
                  'content': '',
                  'categories': [1, 2]
                }
              ]
            };

            if (paramObj && paramObj.timestamp) {
              postList = { 'articles': [4, 5, 6] };
            }

            return $q.when({
              'data': postList
            });
          });

          return {
            findCategories: findCategories,
            findPosts: findPosts
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
        '$ionicLoading': $ionicLoadingMock
      };

      let depsObj = dependencyObject;

      if (depsObj !== null) {
        for (let key in depsObj) {
          if (depsObj.hasOwnProperty(key)) {
            controllerDependencies[key] = depsObj[key];
          }
        }
      }

      return $controller('LatestController', controllerDependencies);
    };
  }));

  it('should make request to load categories', () => {
    let firstCall = {
      withArticles: 0
    };
    let controller = createController();
    expect(apiService.findCategories).toHaveBeenCalledWith(firstCall);
  });

  it('should set categories data from request', () => {
    let controller = createController();
    $rootScope.$digest();
    expect(typeof controller.categories).toBe('object');
  });


  it('should have a list of posts', () => {
    let controller = createController();
    $rootScope.$digest();
    expect(controller.posts.length).toBeGreaterThan(0);
  });
});
