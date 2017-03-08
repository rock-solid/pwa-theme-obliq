angular.module('appticles.canonical')
  .factory('AppticlesCanonical', AppticlesCanonical);

AppticlesCanonical.$inject = ['$document'];

/**
 * @ngdoc service
 * @name appticles.canonical.AppticlesCanonical
 *
 * @description Sets the canonical url in the DOM for the current view.
 *
 * {@link https://support.appticles.com/mobile-web-apps-url-rewriting-rel-canonical/}
 */
function AppticlesCanonical($document) {

  let service = { set };

  return service;

  /**
    * @ngdoc function
    * @name appticles.canonical.AppticlesCanonical#set
    * @methodOf appticles.canonical.AppticlesCanonical
    * @description Sets the canonical url in the DOM for the current view
    * @param  {String} the url of the current view
    */
  function set(href) {

    if (!angular.isString(href) || href.length == 0) {
      _unset();
    }

    var el = _getElement();

    if (!el) {
      _initialize(href);
    }

    else if (el.getAttribute('href') !== href) {
      el.setAttribute('href', href);
    }
  }

  function _initialize(href) {
    if (!angular.isString(href)) {
      return;
    }

    var canonical = $document[0].createElement('link');

    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', href);
    $document[0].head.appendChild(canonical);
  }

  function _getElement() {
    return $document[0].querySelector('[rel="canonical"]');
  }

  function _unset() {
    var el = _getElement();
    if (el) {
      el.remove();
    }
  }
}
