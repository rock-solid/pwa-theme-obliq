'use strict';

let Homepage = require('./../latest/home.po');
let PostDetails = require('./post-details.po');

describe('post', () => {

  let articleId;
  let categoryId;

  beforeAll(() => {

    let homepage = new Homepage();
    homepage.open();

    let article = homepage.getFirstPost();
    let homeArticleUrl = article.getWebElement().getAttribute('href');

    homeArticleUrl.then((result) => {

      let regex = /[a-z0-9]+/gi;
      let matches = result.match(regex);
      articleId = matches[3];
      categoryId = matches[1];
    });

  });

  describe('routes', () => {

    it('should respond with only post id', () => {

      let postDetails = new PostDetails();

      // check route without category param
      postDetails.open('/#/article/' + String(articleId));
      expect(browser.getCurrentUrl()).toContain('/#/article/' + String(articleId));

      // back button should go to a category route
      let closeButton = postDetails.getCloseButton();
      closeButton.click();

      let regex = /category\/[a-z-]+\/[a-z0-9]+/;
      expect(browser.getCurrentUrl()).toMatch(regex);
    });

    it('should respond if category id is 0 (latest)', () => {

      let postDetails = new PostDetails();

      // check route category=0
      postDetails.open('/#/category/0/article/' + String(articleId));
      expect(browser.getCurrentUrl()).toContain('/#/category/0/article/' + String(articleId));

      // back button should go back to home page
      let closeButton = postDetails.getCloseButton();
      closeButton.click();
      expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '#/');
    });


    it('should respond if category id is set', () => {

      let postDetails = new PostDetails();

      postDetails.open('/#/category/' + String(categoryId) + '/article/' + String(articleId));
      expect(browser.getCurrentUrl()).toContain('/#/category/' + String(categoryId) + '/article/' + String(articleId));

      // back button should go back to category page
      let closeButton = postDetails.getCloseButton();
      closeButton.click();

      let regex = new RegExp('/category/[a-z-]+/' + categoryId, 'g');
      expect(browser.getCurrentUrl()).toMatch(regex);
    });

    it('should respond if category id and latest param are set', () => {

      let postDetails = new PostDetails();

      postDetails.open('/#/category/' + String(categoryId) + '/article/' + String(articleId) + '/1');
      expect(browser.getCurrentUrl()).toContain('/#/category/' + String(categoryId) + '/article/' + String(articleId) + '/1');

      // back button should go back to home page
      let closeButton = postDetails.getCloseButton();
      closeButton.click();
      expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '#/');
    });
  });

  describe('non existing routes', () => {

    it('should redirect to home if post does not exist', () => {

      let postDetails = new PostDetails();
      postDetails.open('/#/article/123456783');
      expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '#/');
    });

    it('should redirect to home if category does not exist', () => {

      let postDetails = new PostDetails();
      postDetails.open('/#/category/121323233/article/' + String(articleId));
      expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '#/');
    });

    it('should redirect to home if category does not contain post', () => {

      let postDetails = new PostDetails();
      postDetails.open('/#/category/2/article/' + String(articleId));
      expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '#/');
    });
  });
});
