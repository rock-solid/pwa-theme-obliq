'use strict';

let Homepage = require('./../latest/home.po');
let PostDetails = require('./post-details.po');

describe('post details', () => {

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

  it('should have the shareBtn', () => {

    let postDetails = new PostDetails();
    postDetails.open('/#/article/' + String(articleId));

    let shareBtn = postDetails.getShareButton();

    expect(shareBtn.isPresent()).toBe(true);
  });

  it('should have an ad in the content of the article', () => {
    let adContainer = $('.dfp-ad');

    expect(adContainer).not.toBe(null);
  });
});
