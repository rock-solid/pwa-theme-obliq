describe('pageDetails controller', () => {

  let $rootScope, createController, apiService, validationService, $ionicLoadingMock;

  let pageDetails = {
    'page': {
      'id': 1086,
      'parent_id': 0,
      'title': 'About',
      'link': 'http:\/\/blog.dummydomainname.com\/about\/',
      'image': {
        'src': 'http:\/\/blog.dummydomainname.com\/wp-content\/uploads\/2013\/03\/page-image-691x1024.jpg',
        'width': 691,
        'height': 1024
      },
      'content': '<p>This is the content of the page<\/p>',
      'has_content': 1
    }
  };

  beforeEach(module('appticles.pages'));
  beforeEach(module('appticles.validation'));

  beforeEach(() => {
    $ionicLoadingMock = jasmine.createSpyObj('$ionicLoading spy', ['show', 'hide']);
  });

  beforeEach(
    () => {
      module(function ($provide) {
        $provide.factory('appticles.api', function ($q) {
          let findOnePages = jasmine.createSpy('findOnePages').and.callFake((paramObj) => {
            return $q.when({
              'data': pageDetails
            });
          });

          return {
            findOnePages: findOnePages,
          };
        });
      });
    }
  );

  beforeEach(inject(function ($injector, _AppticlesValidation_) {

    // Get hold of a scope (i.e. the root scope)
    $rootScope = $injector.get('$rootScope');

    // The $controller service is used to create instances of controllers
    let $controller = $injector.get('$controller');

    // Create AppticlesAPI mock
    apiService = $injector.get('appticles.api');
    validationService = _AppticlesValidation_;

    createController = (dependencyObject) => {
      let controllerDependencies = {
        'AppticlesAPI': apiService,
        'AppticlesValidation': validationService,
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

      return $controller('PageDetailsController', controllerDependencies);
    };
  }));

  it('should make request to load page', () => {
    stateParams = { pageId: '15' };
    let controller = createController({ $stateParams: stateParams });
    let pageId = stateParams.pageId;
    expect(apiService.findOnePages).toHaveBeenCalledWith({
      pageId: pageId
    });
  });

  it('should set page data from request', () => {
    let controller = createController();
    $rootScope.$digest();

    expect(controller.page).toBe(pageDetails.page);
  });
});



