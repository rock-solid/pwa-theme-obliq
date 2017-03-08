angular.module('appticles.htmlFilter', [])
  .filter('TrustHtmlFilter', TrustHtmlFilter);

TrustHtmlFilter.$inject = ['$sce'];

function TrustHtmlFilter($sce) {

  return (input) => {
    if(!angular.isString(input)) {
      return;
    }
    return $sce.trustAsHtml(input);
  };
}
