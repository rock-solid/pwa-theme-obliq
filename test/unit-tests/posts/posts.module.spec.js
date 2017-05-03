describe('posts module', () => {

  it('should exist.', () => {
    expect(angular.module('appticles.posts')).not.toBe(null);
  });

  describe('with the \'/\' route', () => {
    let $rootScope, $state, $location;
    let stateName = 'app.nav.latest';

    beforeEach(() => {
      module('appticles.base');
      module('appticles.nav');
      module('appticles.posts');

      inject((_$rootScope_, _$state_, _$location_, $templateCache) => {
        $rootScope = _$rootScope_;
        $state = _$state_;
        $location = _$location_;

        $templateCache.put('app/layout/shell/shell.template.html', '');
        $templateCache.put('app/layout/nav/nav.template.html', '');
        $templateCache.put('app/layout/nav/side-nav/side-nav.template.html', '');
        $templateCache.put('app/posts/latest/latest.template.html', '');
      });

    });

    it('should resolve the \'/\' route', () => {
      expect($state.href(stateName)).toEqual('#/');
    });

    it('should change to the \'app.nav.latest\' state', () => {
      $state.go(stateName);
      $rootScope.$digest();
      expect($state.current.name).toBe(stateName);
    });

    it('should revert to the \'/\' route as default when passed an invalid route', () => {
      $location.url('random/url');
      $rootScope.$digest();
      expect($state.current.name).toBe(stateName);
    });
  });

  ////////////////////////////////////////////////////////////////////


  describe('with the app.nav.category state', () => {
    let $rootScope, $state, $location;
    let stateName = 'app.nav.category';

    beforeEach(() => {
      module('appticles.base');
      module('appticles.nav');
      module('appticles.posts');

      inject((_$rootScope_, _$state_, _$location_, $templateCache) => {
        $rootScope = _$rootScope_;
        $state = _$state_;
        $location = _$location_;

        $templateCache.put('app/layout/shell/shell.template.html', '');
        $templateCache.put('app/layout/nav/nav.template.html', '');
        $templateCache.put('app/layout/shell/app-view.template.html', '');
        $templateCache.put('app/layout/nav/side-nav/side-nav.template.html', '');
        $templateCache.put('app/posts/category/list.template.html', '');
        $templateCache.put('app/posts/category/post-list.template.html', '');
      });

    });

    it('should resolve a valid route', () => {
      expect($state.href(stateName, { categorySlug: 'Aside', categoryId: 16 })).toEqual('#/category/Aside/16');
    });

    it('should change to the \'app.nav.category\' state', () => {
      $state.go(stateName);
      $rootScope.$digest();
      expect($state.current.name).toBe(stateName);
    });

    it('should have a state that plugs into the view named postList@app.nav', () => {
      let state = $state.get(stateName);
      expect(state.views['postList@app.nav']).toBeDefined();
    });

    it('should have a template', () => {
      let state = $state.get(stateName);
      expect(state.views['postList@app.nav'].templateUrl).not.toBe(undefined);
    });

    it('should have a controller', () => {
      let state = $state.get(stateName);
      expect(state.views['postList@app.nav'].controller).not.toBe(undefined);
    });

  });

  ////////////////////////////////////////////////////////////////////

  describe('with the app.nav.post state', () => {
    let $rootScope, $state, $location;
    let stateName = 'app.nav.post';

    beforeEach(() => {
      module('appticles.base');
      module('appticles.nav');
      module('appticles.posts');

      inject((_$rootScope_, _$state_, _$location_, $templateCache) => {
        $rootScope = _$rootScope_;
        $state = _$state_;
        $location = _$location_;

        $templateCache.put('app/layout/shell/shell.template.html', '');
        $templateCache.put('app/layout/nav/nav.template.html', '');
        $templateCache.put('app/layout/nav/side-nav/side-nav.template.html', '');
        $templateCache.put('app/layout/shell/app-view.template.html', '');
        $templateCache.put('app/posts/category/list.template.html', '');
        $templateCache.put('app/posts/details/post-details.template.html', '');
      });

    });

    it('should resolve a valid route', () => {
      expect($state.href(stateName, { postId: '1647' })).toEqual('#/article/1647');
    });

    it('should change to the \'app.nav.post\' state', () => {
      $state.go(stateName);
      $rootScope.$digest();
      expect($state.current.name).toBe(stateName);
    });

  });

});



