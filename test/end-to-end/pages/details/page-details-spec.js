'use strict';

let SideNav = require('./../../layout/nav.po');

describe('page', () => {
  let sideNav;

  beforeAll(() => {
    sideNav = new SideNav();
  });

  beforeEach(() => {

    sideNav.open('/#/');

    let EC = protractor.ExpectedConditions;

    let sideMenuBtn = sideNav.getSideMenuBtn();
    sideMenuBtn.click(); // open the side menu

    // wait for the side menu to open
    browser.wait(EC.visibilityOf($('.side-nav__container')), 5000);

    let pagesButton = sideNav.getPagesButton();
    pagesButton.click(); // load the list of pages

    // wait for the pages to load
    browser.wait(EC.invisibilityOf($('.spinner')), 5000);
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
