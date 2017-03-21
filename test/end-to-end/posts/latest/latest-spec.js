'use strict';

let Homepage = require('./home.po');

describe('home page', () => {

  let homepage;

  beforeEach(() => {
    homepage = new Homepage();
    homepage.open();
  });

  it('should open article details for the first article', () => {

    let article = homepage.getFirstPost();

    // click article and check if the url has changed
    article.click();

    let regex = /category\/[a-z0-9]+\/article\/[a-z0-9]+\/latest\/1/;
    let newUrl = browser.getCurrentUrl();

    expect(newUrl).toMatch(regex);
  });

  it('should open article details for another article', () => {

    let article = homepage.getPosts().get(3);

    browser.executeScript('arguments[0].scrollIntoView({behavior: \'smooth\'});', article.getWebElement()).then(function () {

      article.click();

      let regex = /category\/[a-z0-9]+\/article\/[a-z0-9]+\/latest\/1/;
      let newUrl = browser.getCurrentUrl();

      expect(newUrl).toMatch(regex);
    });
  });


  xit('should load more posts', () => {

    let allPosts = homepage.getPosts();
    let article = allPosts.get(2);
    let noPosts = allPosts.count();

    article.getAttribute('innerHTML').then(res => console.log(res));

    browser
      .actions()
      .mouseDown(article)
      .mouseMove({ x: -50, y: 0 }) // try different value of x
      .mouseUp()
      .perform()
      .then(function () {

        browser.sleep(25000).then(() => {
          let noPostsNew = homepage.getPosts().count();
          expect(noPostsNew).toBeGreaterThan(noPosts);
        });

      });
  });

  it('should open first post details and set back button to the home page', () => {

    let article = homepage.getFirstPost();

    // click article and check if the url has changed
    article.click();

    let regex = /category\/[a-z0-9]+\/article\/[a-z0-9]+\/latest\/1/;
    let newUrl = browser.getCurrentUrl();

    expect(newUrl).toMatch(regex);

    let backButton = element(by.css('.post__button-back'));
    backButton.click();
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '#/');
  });


  it('should open another post details and set back button to the home page', () => {

    let article = homepage.getPosts().get(3);

    browser.executeScript('arguments[0].scrollIntoView({behavior: \'smooth\'});', article.getWebElement()).then(() => {

      article.click();

      let regex = /category\/[a-z0-9]+\/article\/[a-z0-9]+\/latest\/1/;
      let newUrl = browser.getCurrentUrl();

      expect(newUrl).toMatch(regex);

      let backButton = element(by.css('.post__button-back'));
      backButton.click();
      expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '#/');
    });
  });
});
