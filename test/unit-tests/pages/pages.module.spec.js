describe('the pages module', () => {

  it('should exist.', () => {
    expect(angular.module('appticles.pages')).not.toBe(null);
  });

  describe('with the \'app.page-details\' state', () => {
    let $rootScope, $state, $location;
    let stateName = 'app.nav.page-details';

    beforeEach(() => {
      module('appticles.base');
      module('appticles.nav');
      module('appticles.posts');
      module('appticles.pages');

      inject((_$rootScope_, _$state_, _$location_, $templateCache) => {
        $rootScope = _$rootScope_;
        $state = _$state_;
        $location = _$location_;

        $templateCache.put('app/layout/shell/shell.template.html', '');
        $templateCache.put('app/layout/nav/nav.template.html', '');
        $templateCache.put('app/layout/nav/side-nav/side-nav.template.html', '');
        $templateCache.put('app/layout/shell/app-view.template.html', '');
        $templateCache.put('app/posts/latest/latest.template.html', '');
        $templateCache.put('app/pages/list/page-list.template.html', '');
        $templateCache.put('app/pages/details/page-details.template.html', '');
      });

    });

    it('should resolve a valid route', () => {
      expect($state.href(stateName, { pageId: 1 })).toEqual('#/page/1');
    });

    it('should change to the \'app.nav.latest\' state', () => {
      $state.go(stateName);
      $rootScope.$digest();
      expect($state.current.name).toBe(stateName);
    });

    it('should revert to the \'/\' route as default when passed an invalid route', () => {
      $location.url('random/url');
      $rootScope.$digest();
      expect($state.current.name).toBe('app.nav.latest');
    });

    it('should have a state that plugs into the view named navView', () => {
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
});



