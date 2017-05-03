'use strict';

let PostList = require('./post-list.po');
let PostDetails = require('./../details/post-details.po');
let sideNav = require('../../layout/nav.po');

describe('category', () => {

  let categoryId;
  let categorySlug;

  beforeAll(() => {

    let nav = new sideNav();
    let EC = protractor.ExpectedConditions;

    // opening the sideMenu
    nav.open('/#/');
    let sideMenuBtn = nav.getSideMenuBtn();
    sideMenuBtn.click();

    // wait for the side menu to open
    browser.wait(EC.visibilityOf($('.side-nav__container')), 5000);

    // load the list of categories
    let categoriesButton = nav.getCategoriesButton();
    categoriesButton.click();

    // wait for the categories to load
    browser
      .wait(EC.invisibilityOf($('.spinner')), 10000)
      .then( () => {

        let category = nav.getCategories().get(2);
        let categoryUrl = category.element(by.css('.nested-categories__item-content'));

        browser
          .executeScript('arguments[0].scrollIntoView({behavior: \'smooth\'});', category.getWebElement())
          .then(() => {

            category.click().then(() => {
              browser.sleep(2000);
              browser.getCurrentUrl().then((result) => {
                let regex = /[a-z0-9]+/gi;
                let matches = result.split('/');

                categoryId = matches[matches.length - 1];
                categorySlug = matches[matches.length - 2];
              });
            });
          });
      });

  });

  it('route should respond if category id is set', () => {
    let postList = new PostList();
    postList.open('/#/category/' + String(categorySlug) + '/' + String(categoryId));
    expect(browser.getCurrentUrl()).toContain('/#/category/' + String(categorySlug) + '/' + String(categoryId));
  });

  it('route should go back to category after opening post details', () => {

    let postList = new PostList();
    postList.open('/#/category/' + String(categorySlug) + '/' + String(categoryId));
    expect(browser.getCurrentUrl()).toContain('/#/category/' + String(categorySlug) + '/' + String(categoryId));

    // open a post
    let articleItem = postList.getPosts().get(0);
    articleItem.click();

    // init post details
    let postDetails = new PostDetails();

    // back button should go back to category page
    let closeButton = postDetails.getCloseButton();
    closeButton.click();

    // check if the route is set back to the category
    let regex = new RegExp('/category/[a-z-]+/' + categoryId, 'g');
    expect(browser.getCurrentUrl()).toMatch(regex);
  });

  it('route should redirect to home if category id does not exist', () => {
    let postList = new PostList();
    postList.open('/#/category/name-slug/12232323');
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '#/');
  });

  it('route should redirect to home if category id is 0', () => {
    let postList = new PostList();
    postList.open('/#/category/latest/0');
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '#/');
  });

  it('should contain links to articles', () => {

    let postList = new PostList();
    postList.open('/#/category/' + String(categorySlug) + '/' + String(categoryId));
    let articleItem = postList.getPosts().get(1); // get third element because the previous are overlapped by header
    browser.executeScript('arguments[0].scrollIntoView({behavior: \'instant\'});', articleItem.getWebElement()).then(() => {

      articleItem.click();

      let regex = new RegExp('/category/' + categoryId + '/article/[a-z0-9]+', 'g');
      expect(browser.getCurrentUrl()).toMatch(regex);
    });
  });

  it('should load more articles as you swipe', () => {

    let postList = new PostList();
    postList.open('/#/category/' + String(categorySlug) + '/' + String(categoryId));

    let posts = postList.getPosts();
    let firstPost = posts.get(0);
    let secondPagePost = posts.get(2);
    let noPosts = posts.count();
    let lastArticle = posts.last();

    browser.sleep(2000);
    postList
      .swipeOn(firstPost)
      .then(() => {
        postList
          .swipeOn(secondPagePost)
          .then(() => {
            browser.sleep(5000).then(() => {
              let noPostsNew = postList.getPosts().count();
              expect(noPostsNew).toBeGreaterThan(noPosts);
            });
          });
      });
  });

});
