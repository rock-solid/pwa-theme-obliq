'use strict';

let Homepage = require('./../latest/home.po');
let PostDetails = require('./../details/post-details.po');

describe('add comment', () => {

  let articleId;
  let postDetails;

  beforeAll(() => {

    // set window size to portrait, otherwise some inputs might not be visible, causing errors
    browser.driver.manage().window().setSize(350, 800);

    let homepage = new Homepage();
    homepage.open();

    let article = homepage.getFirstPost();
    let homeArticleUrl = article.getWebElement().getAttribute('href');

    homeArticleUrl.then((result) => {

      let regex = /[a-z0-9]+/gi;
      let matches = result.match(regex);
      articleId = matches[3];
    });

  });

  beforeEach(() => {

    postDetails = new PostDetails();
    postDetails.open('/#/article/' + String(articleId));
    let shareButton = postDetails.getShareButton();
    shareButton.click();
    let commentsBtn = postDetails.getCommentsButton();
    commentsBtn.click();

    let addCommentButton = postDetails.getAddCommentButton();
    browser.executeScript('arguments[0].scrollIntoView({behavior: \'smooth\'});', addCommentButton.getWebElement()).then(() => {

      addCommentButton.click();

      // $ionicScrollDelegate will miscalculate position in combination with the test, so re-focus button
      browser.sleep(1000);
      browser.executeScript('arguments[0].scrollIntoView({behavior: \'smooth\'});', addCommentButton.getWebElement());
    });
  });

  it('should open a comment form', () => {

    let emailField = postDetails.getAddCommentEmailField();

    var EC = protractor.ExpectedConditions;
    browser
      .wait(EC.elementToBeClickable(emailField), 5000)
      .then(() => {
        expect(emailField.isDisplayed()).toBeTruthy();
      });
  });

  it('should display error message if email is invalid', () => {

    let emailField = postDetails.getAddCommentEmailField();
    let nameField = postDetails.getAddCommentAuthorField();
    let commentField = postDetails.getAddCommentContentField();
    let sendCommentBtn = postDetails.getSendCommentButton();

    var EC = protractor.ExpectedConditions;

    browser.wait(EC.visibilityOf(emailField), 5000);

    nameField.sendKeys('John Test');
    emailField.sendKeys('invalid email address');
    commentField.sendKeys('This is John Test. Can you hear me Chuck? ' + String(Math.random()));

    expect(sendCommentBtn.getWebElement().getAttribute('disabled')).toBeTruthy();

  });

  it('should send a comment', () => {

    let emailField = postDetails.getAddCommentEmailField();
    let nameField = postDetails.getAddCommentAuthorField();
    let commentField = postDetails.getAddCommentContentField();
    let sendCommentBtn = postDetails.getSendCommentButton();

    var EC = protractor.ExpectedConditions;

    browser.wait(EC.visibilityOf(emailField), 5000);

    nameField.sendKeys('John Test');
    emailField.sendKeys('alexandra@appticles.com');
    commentField.sendKeys('This is John Test. Can you hear me Chuck? ' + String(Math.random()));

    sendCommentBtn.click();

    browser.wait(EC.visibilityOf($('.popup-buttons')), 5000);
    expect(element(by.css('.popup > .popup-body')).getText()).toBe('Ihr Kommentar wartet Genehmigung!');
  });
});
