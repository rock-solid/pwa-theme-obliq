describe('appticles-ads service configuration', () => {

  let $windowProvider, configurationProvider, $fakeWindow;

  beforeEach(() => {
    module('appticles.configuration');
    module('ngDfp');

    // get reference to provider
    module((_$windowProvider_) => {

      $windowProvider = _$windowProvider_;
      $fakeWindow = {
        'googleAds': {
          'adsInterval': 15,
          'phone': {
            'networkCode': 1060237,
            'adUnitCode': 'dev.demo.ad.test1',
            'sizes': [
              [
                336,
                280
              ],
              [
                300,
                300
              ],
              [
                300,
                250
              ],
              [
                250,
                250
              ]
            ]
          },
          'tablet': null
        }
      };

      spyOn($windowProvider, '$get').and.callFake(() => {
        return $fakeWindow;
      });
    });

    // get reference to configuration provider
    module((_configurationProvider_) => {
      configurationProvider = _configurationProvider_;
      spyOn(configurationProvider, '$get').and.callFake(() => {
        return $fakeWindow;
      });
    });

    // get reference to the DFP provider
    module((_DoubleClickProvider_) => {
      DoubleClickProvider = _DoubleClickProvider_;
      spyOn(DoubleClickProvider, '$get');
    });

    module('appticles.ads');
    inject();
  });

  it('should get the $window instance', () => {
    expect($windowProvider.$get).toHaveBeenCalled();
  });

  it('should get the config instance', () => {
    expect(configurationProvider.$get).toHaveBeenCalledWith($fakeWindow);
  });

  it('should exist', () => {
    expect(angular.module('appticles.ads')).toBeDefined();
  });
});
