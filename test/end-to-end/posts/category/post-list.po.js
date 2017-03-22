'use strict';

class Category {

  open(url) {
    browser.get(url);
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

  getPosts() {
    return element.all(by.repeater('post in page'));
  }
};

module.exports = Category;
