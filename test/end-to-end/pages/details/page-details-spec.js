'use strict';

let SideNav = require('./../../layout/nav.po');

describe('page', () => {
  let sideNav;

  beforeAll(() => {
    sideNav = new SideNav();
  });

  beforeEach(() => {
    sideNav.open('/#/');
    let sideMenuBtn = sideNav.getSideMenuBtn();
    sideMenuBtn.click(); // open the sidemenu

    let pagesButton = sideNav.getPagesButton();
    pagesButton.click(); //load the list of pages
  });

  // @todo Can't check separate route if we don't have access to a page ID.
  it('should open page details if page is clicked', () => {

    let pageItem = sideNav.getAllPages().first();
    pageItem.click();

    let regex = /page\/[a-z0-9]+/;
    expect(browser.getCurrentUrl()).toMatch(regex);
  });

  it('should redirect to home if page does not exist', () => {

    browser.get('/#/page/3223234234');
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '#/');
  });
});
