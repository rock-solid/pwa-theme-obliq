'use strict';

class Homepage {

  open() {
    browser.get('/');
  }

  swipeOn(element) {
    let deferred = protractor.promise.defer();

    browser.sleep(500);
    browser
      .actions()
      .mouseDown(element)
      .mouseMove({ x: -25, y: 0 }) // try different value of x
      .mouseUp()
      .perform();

    return deferred.promise;
  }

  getFirstPost() {
    return element.all(by.css('.slide__post-item')).get(0);
  }

  getPosts() {
    return element.all(by.repeater('post in page'));
  }

  getPostLink(postCard) {
    return postCard.element(by.css('.slide__post-item')).getWebElement().getAttribute('href');
  }
};

module.exports = Homepage;
