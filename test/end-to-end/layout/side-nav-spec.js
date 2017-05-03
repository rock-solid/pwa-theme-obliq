'use strict';

let SideNav = require('./nav.po');

describe('Nav categories', () => {

  let nav;

  beforeEach(() => {
    nav = new SideNav();
    nav.open('/');

    let sideMenuBtn = nav.getSideMenuBtn();
    sideMenuBtn.click();

    let EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf($('.side-nav__container')), 5000);
  });

  it('should contain a home button', () => {
    let homeButton = nav.getHomeButton();
    expect(homeButton.isDisplayed()).toBeTruthy();
  });

  it('should open the home page when the home button is clicked', () => {
    let homeButton = nav.getHomeButton();
    homeButton.click();

    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '#/');
  });

  it('should contain a categories button', () => {
    let categoriesButton = nav.getCategoriesButton();
    expect(categoriesButton.isDisplayed()).toBeTruthy();
  });

  it('should have a list of categories', () => {

    let categoriesButton = nav.getCategoriesButton();
    categoriesButton.click();

    let EC = protractor.ExpectedConditions;

    browser
      .wait(EC.invisibilityOf($('.spinner')), 5000)
      .then( () => {
        let noCategories = nav.getCategories().count();
        expect(noCategories).toBeGreaterThan(0);
      });
  });

  it('should load a list of articles belonging to that category', () => {

    let categoriesButton = nav.getCategoriesButton();
    categoriesButton.click();

    let EC = protractor.ExpectedConditions;

    browser
      .wait(EC.invisibilityOf($('.spinner')), 5000)
      .then( () => {
        let categoryBtn = nav.getCategories().get(1);
        categoryBtn.element(by.css('[ng-click="nestedCategoriesVm.openContent(category)"]')).click();

        let regex = /category\/[a-z-]+\/[a-z0-9]+/;
        let newUrl = browser.getCurrentUrl();

        expect(newUrl).toMatch(regex);
      });
  });

  it('should contain a link to the pages menu', () => {
    let pagesButton = nav.getPagesButton();
    expect(pagesButton.isDisplayed()).toBeTruthy();
  });

  it('should have a list of pages', () => {

    let pagesButton = nav.getPagesButton();
    pagesButton.click();

    let EC = protractor.ExpectedConditions;

    browser
      .wait(EC.invisibilityOf($('.spinner')), 5000)
      .then( () => {
        let noPages = nav.getAllPages().count();
        expect(noPages).toBeGreaterThan(0);
      });
  });

  it('should open a submenu if an arrow is clicked', () => {

    let pagesButton = nav.getPagesButton();
    pagesButton.click();

    let EC = protractor.ExpectedConditions;

    browser
      .wait(EC.invisibilityOf($('.spinner')), 5000)
      .then( () => {

        let submenuIcon = nav.getPageSubmenuIcons().first();

        browser.executeScript('arguments[0].scrollIntoView({behavior: \'instant\'});', submenuIcon.getWebElement()).then(() => {

          let submenuList = nav.getSubmenuNestedList(submenuIcon);
          submenuIcon.click();

          expect(submenuList.isDisplayed()).toBeTruthy();
        });
      });
  });

  it('should contain a link to the desktop version', () => {

    let desktopButton = nav.getDesktopButton();
    desktopButton.click();

    var EC = protractor.ExpectedConditions;
    browser.wait(EC.alertIsPresent(), 5000);

    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.getText()).toEqual('Are you sure you want to access the desktop site?');

    alertDialog.accept();
  });
});
