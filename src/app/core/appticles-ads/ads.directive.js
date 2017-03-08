angular
  .module('appticles.ads')
  .directive('appticlesAds', AppticlesInsertAds);

/**
 * @ngdoc directive
 * @name appticles.ads.appticlesAds
 *
 * @description Split post content in two parts to insert ad.
 */
function AppticlesInsertAds() {
  return {
    restrict: 'AE',
    scope: {
      content: '='
    },
    templateUrl: 'app/core/appticles-ads/ads.template.html',
    controller: AdsController,
    controllerAs: 'adsVm',
    bindToController: true
  };
};

class AdsController {
  constructor($log, $document, configuration) {

    this.hasAds = angular.isDefined(configuration.googleAds) ? true : false;
    this.$document = $document;

    if (this.hasAds) {

      // create a temporary html div to hold our content
      const temp = $document[0].createElement('div');

      // replace its contents with the contents received from server, eliminating newlines
      temp.innerHTML = this.content.replace(/\n/g, '');

      // count the number of elements the content has
      const numberOfChildNodes = temp.childNodes.length;

      // create an array with nodes belonging to temporary div.
      const nodes = [];
      for (var i = 0; i < numberOfChildNodes; i++) {
        nodes.push(temp.childNodes[i]);
      }

      // checking for textNodes so we don't have element displaying undefined in the template.
      // Wraps text nodes into a span, because otherwise textNodes can't be styled
      let parsedNodes = this._replaceTextNodes(nodes);

      // calculate split position
      let randomPos = 4;
      if (parsedNodes.length > 4) {
        randomPos = this._createRandomPosition(parsedNodes.length);
      }

      // add content to the first block
      this.content1 = '';
      parsedNodes.slice(0, randomPos).map((node) => {
        this.content1 += node.outerHTML;
      });

      // add content to the second block
      this.content2 = '';
      parsedNodes.slice(randomPos + 1).map((node) => {
        this.content2 += node.outerHTML;
      });

    } else {
      this.content1 = this.content;
    }
  }

  _createRandomPosition(arrayLength) {
    let randomPos =  4 + Math.floor((Math.random() * arrayLength) / 2);
    return randomPos;
  }

  _replaceTextNodes(nodesArray) {

    let newArray = nodesArray.map((node) => {

      if (node.nodeType == 3) {
        let elementNode = this.$document[0].createElement('span');
        elementNode.appendChild(node);
        node = elementNode;
      }

      return node;
    });

    return newArray;
  }
};

AdsController.$inject = ['$log', '$document', 'configuration'];



