describe('the i18n service:', () => {
  let p;
  beforeEach(module('appticles.i18n'));

  let configFile = {
    'translate': {
      'path':'https://s3-eu-west-1.amazonaws.com/appticles-devel/others/locales3/de_DE.json'
    }
  };

  beforeEach(() => {
    module('appticles.configuration', (configurationProvider) => {
      p = configurationProvider;
      p.$get = () => configFile;
    });
  });

  it('should exist', () => {
    expect(angular.module('appticles.i18n')).toBeDefined();
  });

  it('should contain the factory method', () => {
    inject((_AppticlesTranslateLoader_) => {
      expect(_AppticlesTranslateLoader_).toBeDefined();
    });
  });
});
