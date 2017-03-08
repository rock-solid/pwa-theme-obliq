describe('appticles-canonical service:', () => {

  beforeEach( () => {
    module('appticles.canonical');
  });

  it('should exist', () => {
    expect(angular.module('appticles.canonical')).toBeDefined();
  });

  it('should contain the factory method', () => {
    inject((_AppticlesCanonical_) => {
      expect(_AppticlesCanonical_).toBeDefined();
    });
  });
});
