angular.module('appticles.ads')
  .config(AppticlesAdsConfig);

AppticlesAdsConfig.$inject = ['$windowProvider', 'DoubleClickProvider', 'configurationProvider'];

function AppticlesAdsConfig($windowProvider, DoubleClickProvider, configurationProvider){
  let $window = $windowProvider.$get();
  let config = configurationProvider.$get($window).googleAds || null;

  if (config && angular.isDefined(config.phone.networkCode) &&
    angular.isDefined(config.phone.adUnitCode) &&
    angular.isDefined(config.phone.sizes)){

    let slot = '/' + config.phone.networkCode + '/' + config.phone.adUnitCode;

    // @improvement Find better method to retrieve content width;
    let contentPadding = 42;

    let viewportWidth = $window.innerWidth - contentPadding;
    let viewportHeight = $window.innerHeight;

    let initialSizes = config.phone.sizes;

    // select only slots that fit inside the viewport
    let filteredSizes = initialSizes.filter(adSlot => adSlot[0] <= viewportWidth && adSlot[1] <= viewportHeight);
    DoubleClickProvider.defineSlot(slot, filteredSizes, 'div-dfp-ads');

    // set refresh interval
    let adRefreshTime = (angular.isDefined(config.adsInterval) ? Number(config.adsInterval) : 30) * 1000;
    DoubleClickProvider.setRefreshInterval(adRefreshTime);

  } else {
    DoubleClickProvider.setEnabled(false); // if we don't have ads enabled, don't load library
  }
}
