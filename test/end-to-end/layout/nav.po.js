'use strict';

class Nav {

  open(url) {
    browser.get(url);
  }

  getSideMenuBtn() {
    return element(by.css('.latest__button-more'));
  }

  getHomeButton() {
    return element(by.css('[data-ui-sref="app.nav.latest"]'));
  }

  getCategoriesButton() {
    return element(by.css('[data-ng-click="navSideVm.openCategories()"]'));
  }

  getCategories() {
    return element.all(by.repeater('category in nestedCategoriesVm.categories'));
  }

  getCategorySubmenuIcons() {
    return element.all(by.css('[ng-click="nestedCategoriesVm.openChildCategories(page.id)"]'));
  }

  getPagesButton() {
    return element(by.css('.side-nav__static-pages-container'));
  }

  getAllPages() {
    return element.all(by.binding('page.title'));
  }

  getPageSubmenuIcons() {
    return element.all(by.css('[ng-click="nestedPagesVm.openChildPages(page)"]'));
  }

  getSubmenuNestedList(arrowIcon) {
    return arrowIcon.element(by.xpath('../..'));
  }

  getDesktopButton() {
    return element(by.css('[data-ng-click="navSideVm.openDesktopWebsite()"]'));
  }
};

module.exports = Nav;
