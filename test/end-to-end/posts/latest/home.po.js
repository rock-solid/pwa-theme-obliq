'use strict';

class Homepage {

  open() {
    browser.get('/');
  }

  getFirstPost() {
    return element(by.css('.hero__top-inner'));
  }

  getPosts() {
    return element.all(by.repeater('post in page'));
  }

  getPostLink(postCard) {
    return postCard.element(by.css('.slide__post-item')).getWebElement().getAttribute('href');
  }
};

module.exports = Homepage;
