describe('sideNav controller', () => {

  let $rootScope, createController, apiService;
  let input = [
    {
      'pages': [
        {
          'id': 1086,
          'parent_id': 0,
          'order': 1,
          'title': 'About',
          'link': 'http:\/\/blog.dummydomainname.com\/about\/',
          'image': {
            'src': 'http:\/\/blog.dummydomainname.com\/wp-content\/uploads\/2013\/03\/page-image-691x1024.jpg',
            'width': 691,
            'height': 1024
          },
          'content': '',
          'has_content': 1
        },
        {
          'id': 1409,
          'parent_id': 0,
          'order': 3,
          'title': 'Another page',
          'link': 'http:\/\/blog.dummydomainname.com\/another-page\/',
          'image': '',
          'content': '',
          'has_content': 1
        },
        {
          'id': 1388,
          'parent_id': 1086,
          'order': 2,
          'title': 'Child page',
          'link': 'http:\/\/blog.dummydomainname.com\/child-page\/',
          'image': '',
          'content': '',
          'has_content': 1
        }
      ]
    }
  ];
  let categories = {
    'categories': [{
      'id': 0,
      'order': 1,
      'name': 'Latest',
      'name_slug': 'Latest',
      'image': '',
      'parent_id': 0
    }, {
      'id': 1,
      'order': 2,
      'name': 'Post category parent',
      'name_slug': 'post-category',
      'link': 'http:\/\/blog.dummydomainname.com\/category\/post-category\/',
      'image': {
        'src': 'http:\/\/blog.dummydomainname.com\/wp-content\/uploads\/2013\/03\/featured-image-vertical.jpg',
        'width': 300,
        'height': 580
      },
      'parent_id': 0
    },
    {
      'id': 2,
      'order': 3,
      'name': 'Post category child-01',
      'name_slug': 'post-category',
      'link': 'http:\/\/blog.dummydomainname.com\/category\/post-category\/',
      'image': {
        'src': 'http:\/\/blog.dummydomainname.com\/wp-content\/uploads\/2013\/03\/featured-image-vertical.jpg',
        'width': 300,
        'height': 580
      },
      'parent_id': 1
    },
    {
      'id': 3,
      'order': 4,
      'name': 'Post category child-02',
      'name_slug': 'post-category',
      'link': 'http:\/\/blog.dummydomainname.com\/category\/post-category\/',
      'image': {
        'src': 'http:\/\/blog.dummydomainname.com\/wp-content\/uploads\/2013\/03\/featured-image-vertical.jpg',
        'width': 300,
        'height': 580
      },
      'parent_id': 1
    },
    {
      'id': 4,
      'order': 5,
      'name': 'Post category grandchild-01',
      'name_slug': 'post-category',
      'link': 'http:\/\/blog.dummydomainname.com\/category\/post-category\/',
      'image': {
        'src': 'http:\/\/blog.dummydomainname.com\/wp-content\/uploads\/2013\/03\/featured-image-vertical.jpg',
        'width': 300,
        'height': 580
      },
      'parent_id': 3
    }
    ]
  };

  beforeEach(module('appticles.nav'));
  beforeEach(module('appticles.validation'));

  beforeEach(
    () => {

      module(function ($provide) {
        $provide.factory('appticles.api', function ($q) {

          let findPages = jasmine.createSpy('findPages').and.callFake(function () {
            return $q.when({
              'data': input[0]
            });
          });

          let findCategories = jasmine.createSpy('findCategories').and.callFake(function () {
            return $q.when({
              'data': categories
            });
          });

          return {
            findPages: findPages,
            findCategories: findCategories
          };
        });
      });
    }
  );

  beforeEach(inject(function ($injector, _AppticlesValidation_) {

    // Get hold of a scope (i.e. the root scope)
    $rootScope = $injector.get('$rootScope');

    // The $controller service is used to create instances of controllers
    var $controller = $injector.get('$controller');

    // Create AppticlesAPI mock
    apiService = $injector.get('appticles.api');

    createController = () => {
      return $controller('SideNavController', {
        'AppticlesAPI': apiService
      });
    };
  }));

  it('should set allPages property', () => {
    let controller = createController();
    expect(controller.allPages).not.toBe(undefined);
  });

  it('should make request to load pages', () => {
    let controller = createController();
    controller.loadPages(); // simulateClick
    expect(apiService.findPages).toHaveBeenCalled();
  });

  it('should set allPages data from request', () => {
    let controller = createController();
    controller.loadPages(); // simulateClick
    $rootScope.$digest();
    expect(controller.allPages.length).toEqual(3);
  });

  it('should set allPages property', () => {
    let controller = createController();
    expect(controller.allPages).not.toBe(undefined);
  });

  /////

  it('should set allCategories property', () => {
    let controller = createController();
    expect(controller.allCategories).not.toBe(undefined);
  });

  it('should make request to load Categories', () => {
    let controller = createController();
    controller.loadCategories(); // simulateClick
    expect(apiService.findCategories).toHaveBeenCalled();
  });

  it('should make request to load categories', () => {
    let controller = createController();
    controller.loadCategories(); // simulateClick
    expect(apiService.findCategories).toHaveBeenCalled();
  });

  it('should set allCategories data from request', () => {
    let controller = createController();
    controller.loadCategories(); // simulateClick
    $rootScope.$digest();
    expect(controller.allCategories.length).toEqual(4);
  });
});

