angular.module('appticles.validation')
  .factory('AppticlesValidation', AppticlesValidation);


/**
 * @ngdoc service
 * @name appticles.validation.AppticlesValidation
 *
 * @description Service for validating data coming from the API.
 */
function AppticlesValidation() {

  let service = {
    validateCategories: validateCategories,
    validateOneCategories: validateOneCategories,
    validatePosts: validatePosts,
    validateOnePosts: validateOnePosts,
    validatePages: validatePages,
    validateOnePages: validateOnePages,
    validateComments: validateComments,
    validateInsertComments: validateInsertComments
  };

  return service;

  /**
   * @ngdoc function
   * @name appticles.validation.AppticlesValidation#checkOneCategories
   * @methodOf appticles.validation.AppticlesValidation
   * @description Validate a single category object.
   *
   * @return {Boolean|Object} Return the category if it's valid, false otherwise.
   *
   * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#exportcategories}
   */
  function _checkOneCategories(category) {

    if (angular.isDefined(category.id) && /^[a-z0-9]+$/i.test(category.id) &&
      angular.isDefined(category.order) && /^\d+$/.test(category.order) &&
      angular.isDefined(category.name) &&  angular.isString(category.name) &&
      angular.isDefined(category.name_slug) && angular.isString(category.name_slug) &&
      (angular.isUndefined(category.parent_id) || /^[a-z0-9]+$/i.test(category.parent_id) )) {

      return category;
    }

    return false;
  }

    /**
   * @ngdoc function
   * @name appticles.validation.AppticlesValidation#validateCategory
   * @methodOf appticles.validation.AppticlesValidation
   * @description Validate category data
   *
   * @return {An Object} An object containing category details
   *
   * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#exportcategory}
   */
  function validateOneCategories(input) {
    if(angular.isObject(input) && !angular.isArray(input)) {

      if (angular.isDefined(input.data) && angular.isDefined(input.data.category)) {

        let category = input.data.category;

        if(angular.isDefined(category.id) && /^[a-z0-9]+$/i.test(category.id) &&
          angular.isDefined(category.name) && angular.isString(category.name) &&
          angular.isDefined(category.name_slug) && angular.isString(category.name_slug) &&
          (angular.isUndefined(category.parent_id) || /^[a-z0-9]+$/i.test(category.parent_id) )) {

          return category;
        }
      }
    }

    return { 'error': 'Invalid data' };
  };

  /**
   * @ngdoc function
   * @name appticles.validation.AppticlesValidation#validateCategories
   * @methodOf appticles.validation.AppticlesValidation
   * @description Validate categories data
   *
   * @return {Array} An array of category objects
   *
   * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#exportcategories}
   */
  function validateCategories(input) {

    if(angular.isObject(input) && !angular.isArray(input)) {
      if (angular.isDefined(input.data) && angular.isDefined(input.data.categories)) {

        if (input.data.categories.length == 0) {
          return [];
        }

        let validatedCategories = input.data.categories.map(_checkOneCategories);

        if (validatedCategories.indexOf(false) === -1) {
          return validatedCategories;
        }
      }
    }

    return { 'error': 'Invalid data' };
  }

  /**
   * @ngdoc function
   * @name appticles.validation.AppticlesValidation#checkOnePages
   * @methodOf appticles.validation.AppticlesValidation
   * @description Validate a single page object.
   *
   * @return {Boolean|Object} Return the page if it's valid, false otherwise.
   *
   * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#exportarticle}
   */
  function _checkOnePosts(post) {

    if (angular.isDefined(post.id) && /^[a-z0-9]+$/i.test(post.id) &&
      angular.isDefined(post.title) && angular.isString(post.title) &&
      angular.isDefined(post.author) && angular.isString(post.author) &&
      angular.isDefined(post.link) && angular.isString(post.link) &&
      angular.isDefined(post.date) && angular.isString(post.date) &&
      angular.isDefined(post.timestamp) && /^\d+$/.test(post.timestamp) &&
      angular.isDefined(post.description) && angular.isString(post.description) &&
      angular.isDefined(post.content) && angular.isString(post.content) &&
      angular.isDefined(post.categories) && angular.isArray(post.categories) &&
      (angular.isUndefined(post.comment_status) || ['open','closed','disabled'].indexOf(post.comment_status) !== -1 ) &&
      (angular.isUndefined(post.no_comments) || /^\d+$/.test(post.no_comments)) &&
      (angular.isUndefined(post.show_avatars) || /^\d+$/.test(post.show_avatars)) &&
      (angular.isUndefined(post.require_name_email) || /^\d+$/.test(post.require_name_email)) ) {

      return post;
    }

    return false;
  }

  /**
   * @ngdoc function
   * @name appticles.validation.AppticlesValidation#validateOnePosts
   * @methodOf appticles.validation.AppticlesValidation
   * @description Validate post details data
   *
   * @return {Object} An object with the details of a post
   *
   * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#exportarticle}
   */
  function validateOnePosts(input) {

    if(angular.isObject(input) && !angular.isArray(input)) {
      if (angular.isDefined(input.data) && angular.isDefined(input.data.article)) {
        let validArticle = _checkOnePosts(input.data.article);

        if(validArticle !== false) {
          return validArticle;
        }
      }
    }

    return { 'error': 'Invalid data' };
  };

  /**
   * @ngdoc function
   * @name appticles.validation.AppticlesValidation#validatePosts
   * @methodOf appticles.validation.AppticlesValidation
   * @description Validate posts data
   *
   * @return {Array} An array of articles objects
   *
   * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#exportarticles}
   */
  function validatePosts(input) {

    if(angular.isObject(input) && !angular.isArray(input)) {

      if (angular.isDefined(input.data) && angular.isDefined(input.data.articles)) {

        if (input.data.articles.length == 0) {
          return [];
        }

        let validatedPosts = input.data.articles.map(_checkOnePosts);

        if (validatedPosts.indexOf(false) === -1) {
          return validatedPosts;
        }
      }
    }

    return { 'error': 'Invalid data' };
  };

  /**
   * @ngdoc function
   * @name appticles.validation.AppticlesValidation#checkOnePages
   * @methodOf appticles.validation.AppticlesValidation
   * @description Validate a single page object.
   *
   * @return {Boolean|Object} Return the page if it's valid, false otherwise.
   *
   * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#exportpages}
   */
  function _checkOnePages(page) {

    if (angular.isDefined(page.id) && /^[a-z0-9]+$/i.test(page.id) &&
      angular.isDefined(page.order) && /^\d+$/.test(page.order) &&
      angular.isDefined(page.title) && angular.isString(page.title) &&
      angular.isDefined(page.has_content) && /^\d+$/.test(page.has_content) &&
      angular.isDefined(page.parent_id) && /^[a-z0-9]+$/i.test(page.parent_id) ) {

      return page;
    }

    return false;
  }

     /**
   * @ngdoc function
   * @name appticles.validation.AppticlesValidation#validateOnePages
   * @methodOf appticles.validation.AppticlesValidation
   * @description Validate page details data
   *
   * @return {Object} An object with the details of a page
   *
   * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#exportpage}
   */
  function validateOnePages(input) {
    if(angular.isObject(input) && !angular.isArray(input)) {
      if (angular.isDefined(input.data) && angular.isDefined(input.data.page)) {

        let page = input.data.page;

        if(angular.isDefined(page.id) && /^[a-z0-9]+$/i.test(page.id) &&
          angular.isDefined(page.parent_id) && /^[a-z0-9]+$/i.test(page.parent_id) &&
          angular.isDefined(page.title) && angular.isString(page.title) &&
          angular.isDefined(page.has_content) && /^\d+$/.test(page.has_content) &&
          angular.isDefined(page.content) && angular.isString(page.content)) {

          return page;
        }
      }
    }

    return { 'error': 'Invalid data' };
  };

  /**
   * @ngdoc function
   * @name appticles.validation.AppticlesValidation#validatePages
   * @methodOf appticles.validation.AppticlesValidation
   * @description Validate pages data
   *
   * @return {Array} An array of pages objects
   *
   * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#exportpages}
   */
  function validatePages(input) {

    if(angular.isObject(input) && !angular.isArray(input)) {
      if (angular.isDefined(input.data) && angular.isDefined(input.data.pages)) {

        if (input.data.pages.length == 0) {
          return [];
        }

        let validatedPages = input.data.pages.map(_checkOnePages);

        if (validatedPages.indexOf(false) === -1) {
          return validatedPages;
        }
      }
    }

    return { 'error': 'Invalid data' };
  };


  /**
   * @ngdoc function
   * @name appticles.validation.AppticlesValidation#checkOneComments
   * @methodOf appticles.validation.AppticlesValidation
   * @description Validate a single comment object.
   *
   * @return {Boolean|Object} Return the comment if it's valid, false otherwise.
   *
   * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#exportcomments}
   */
  function _checkOneComments(comment) {

    if (angular.isDefined(comment.id) && /^[a-z0-9]+$/i.test(comment.id) &&
      angular.isDefined(comment.author) && angular.isString(comment.author) &&
      angular.isDefined(comment.author_url) && angular.isString(comment.author_url) &&
      angular.isDefined(comment.avatar) && angular.isString(comment.avatar) &&
      angular.isDefined(comment.date) && angular.isString(comment.date) &&
      angular.isDefined(comment.content) && angular.isString(comment.content) &&
      angular.isDefined(comment.article_id) && /^[a-z0-9]+$/i.test(comment.article_id) ) {

      return comment;
    }

    return false;
  }

  /**
   * @ngdoc function
   * @name appticles.validation.AppticlesValidation#validateComments
   * @methodOf appticles.validation.AppticlesValidation
   * @description Validate comments data
   *
   * @return {Array} An array of comments objects
   *
   * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#exportcomments}
   */
  function validateComments(input) {

    if(angular.isObject(input) && !angular.isArray(input)) {

      if (angular.isDefined(input.data) && angular.isDefined(input.data.comments)) {

        if (input.data.comments.length == 0) {
          return [];
        }

        let validatedComments = input.data.comments.map(_checkOneComments);
        if (validatedComments.indexOf(false) === -1) {
          return validatedComments;
        }
      }
    }

    return { 'error': 'Invalid data' };
  };

   /**
   * @ngdoc function
   * @name appticles.validation.AppticlesValidation#validateInsertComments
   * @methodOf appticles.validation.AppticlesValidation
   * @description Validate comment submission
   *
   * @return {Object} An object containing the details of the comment that are passed on the request
   *
   * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#savecomment}
   */
  function validateInsertComments(input) {

    if (angular.isObject(input) && !angular.isArray(input)) {

      if (angular.isDefined(input.articleId) && /^[a-z0-9]+$/i.test(input.articleId) &&
          angular.isDefined(input.comment) && angular.isString(input.comment) &&
          angular.isDefined(input.code) && angular.isString(input.code)) {

        if (angular.isDefined(input.require_name_email) && Number(input.require_name_email) === 1) {

          if(angular.isDefined(input.author) && angular.isString(input.author) &&
            angular.isDefined(input.email) && angular.isString(input.email)){
            return input;
          }

        } else {
          return input;
        }
      }
    }

    return { 'error': 'Invalid data' };
  };
}






