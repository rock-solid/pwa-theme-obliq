'use strict';

let Homepage = require('./../latest/home.po');
let PostDetails = require('./../details/post-details.po');

describe('comments', () => {

  let articleId;

  beforeAll(() => {

    let homepage = new Homepage();
    homepage.open();

    let article = homepage.getFirstPost();
    let homeArticleUrl = article.getWebElement().getAttribute('href');

    homeArticleUrl.then((result) => {

      let regex = /[a-z0-9]+/gi;
      let matches = result.match(regex);

      articleId = matches[1];
    });

  });

  it('should have a list of comments', () => {

    let postDetails = new PostDetails();
    postDetails.open('/#/article/' + String(articleId));

    let shareButton = postDetails.getShareButton();
    shareButton.click();
    let commentsButton = postDetails.getCommentsButton();
    commentsButton.click();

    let comments = postDetails.getComments();
    let noComments = comments.count();
    expect(noComments).toBeGreaterThan(0);
  });

  it('route should redirect to home if post does not exist', () => {

    let postDetails = new PostDetails();
    postDetails.open('/#/article/324234234234/comments');

    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '#/');
  });

});
