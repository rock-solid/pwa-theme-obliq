'use strict';

class PostDetails {

  open(url) {
    browser.get(url);
  }

  getCloseButton() {
    return element(by.css('[data-ng-click="postDetailsVm.goBack()"]'));
  }

  //@todo add comment button function

  getCommentsButton() {
    return element(by.css('.social-modal__btn-comm'));
  }

  getComments() {
    return element.all(by.repeater('comment in commentsVm.commentList'));
  }

  getAddCommentButton() {
    return element(by.css('ion-pull-up-handle.pull-up__handle'));
  }

  getAddCommentEmailField() {
    return element(by.model('addCommentVm.email'));
  }

  getAddCommentAuthorField() {
    return element(by.model('addCommentVm.author'));
  }

  getAddCommentContentField() {
    return element(by.model('addCommentVm.content'));
  }

  getSendCommentButton() {
    return element(by.css('[data-ng-disabled]'));
  }

  getShareButton() {
    return element(by.css('.post__ex-social-btn'));
  }
};

module.exports = PostDetails;
