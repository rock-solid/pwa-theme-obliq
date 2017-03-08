describe('validation service:', () => {

  beforeEach( () => {
    module('appticles.validation');
  });

  it('exists', () => {
    expect(angular.module('appticles.validation')).toBeDefined();
  });

  describe('The service :', () => {
    let serviceInstance;

    beforeEach( () => {
      inject( (_AppticlesValidation_) => {
        serviceInstance = _AppticlesValidation_;
      });
    });

    it('has a method called validateCategories', () => {
      expect(serviceInstance.validateCategories).toBeDefined();
    });

    it('has a method called validateOneCategories', () => {
      expect(serviceInstance.validateOneCategories).toBeDefined();
    });

    it('has a method called validatePosts', () => {
      expect(serviceInstance.validatePosts).toBeDefined();
    });

    it('has a method called validateOnePosts', () => {
      expect(serviceInstance.validateOnePosts).toBeDefined();
    });

    it('has a method called validatePages', () => {
      expect(serviceInstance.validatePages).toBeDefined();
    });

    it('has a method called validateOnePages', () => {
      expect(serviceInstance.validateOnePages).toBeDefined();
    });

    it('has a method called validateComments', () => {
      expect(serviceInstance.validateComments).toBeDefined();
    });

    it('has a method called validateInsertComments', () => {
      expect(serviceInstance.validateInsertComments).toBeDefined();
    });
  });

});
