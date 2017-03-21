'use strict';

class Homepage {

  open() {
    browser.get('/');
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
