'use strict';

let SideNav = require('./nav.po');

fdescribe('Nav categories', () => {

  let nav;

  beforeEach(() => {
    nav = new SideNav();
    nav.open('/#/');

    let sideMenuBtn = nav.getSideMenuBtn();
    sideMenuBtn.click();
  });

  it('should contain a categories button', () => {

    let categoriesButton = nav.getCategoriesButton();
    expect(categoriesButton.isDisplayed()).toBeTruthy();

  });

  it('should have a list of categories', () => {

    let categoriesButton = nav.getCategoriesButton();
    categoriesButton.click().then(() => {
      let noCategories = nav.getCategories().count();

      // the latest category is skipped, so we should have 9 displayed categories
      expect(noCategories).toBeGreaterThan(0);
    });
  });

  it('should open a submenu if an arrow is clicked', () => {
    let categoriesButton = nav.getCategoriesButton();
    categoriesButton.click().then(() => {
      let submenuIcon = nav.getCategorySubmenuIcons().first();

      browser.executeScript('arguments[0].scrollIntoView({behavior: \'instant\'});', submenuIcon.getWebElement()).then(() => {

        let submenuList = nav.getSubmenuNestedList(submenuIcon);
        submenuIcon.click();

        expect(submenuList.isDisplayed()).toBeTruthy();
      });
    });
  });

  it('should load a list of articles belonging to that category', () => {
    let categoriesButton = nav.getCategoriesButton();

    categoriesButton.click().then(() => {
      let categoryBtn = nav.getCategories().get(1);
      categoryBtn.element(by.css('[ng-click="nestedCategoriesVm.openContent(page)"]')).click();

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
    pagesButton.click().then(() => {
      let noPages = nav.getAllPages().count();
      expect(noPages).toBeGreaterThan(0);
    });
  });

  it('should open a submenu if an arrow is clicked', () => {

    let pagesButton = nav.getPagesButton();
    pagesButton.click().then(() => {
      let submenuIcon = nav.getPageSubmenuIcons().first();

      browser.executeScript('arguments[0].scrollIntoView({behavior: \'instant\'});', submenuIcon.getWebElement()).then(() => {

        let submenuList = nav.getSubmenuNestedList(submenuIcon);
        submenuIcon.click();

        expect(submenuList.isDisplayed()).toBeTruthy();
      });
    });
  });

  // @todo Add test for the home button

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
