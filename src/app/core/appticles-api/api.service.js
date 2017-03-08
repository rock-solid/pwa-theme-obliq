angular.module('appticles.api')
  .factory('AppticlesAPI', AppticlesAPI);

AppticlesAPI.$inject = ['$log', '$http', 'configuration'];

/**
 * @ngdoc function
 * @name capitalize
 * @description Returns a capitalized version of the string being passed as an argument
 *
 * @example
 * <example module="myModule">
 * <file name="index.html">
 * <label for="word">Word</label>
 * <input type="text" name="word" id="word" placeholder="Type word...">
 * </file>
 *
 * <file name="capitalize.js">
 * let capitalizedName = capitalize('appticles'); // 'Appticles'
 * </file>
 * </example>
 *
 * @param  {string} input A string we want capitalized
 * @return {string}     The capitalized version of the string received as an argument
 */
const capitalize = (input) => {
  if (typeof input != 'string' || input == '') {
    return '';
  }

  return `${input.charAt(0).toUpperCase()}${input.slice(1)}`;
};

/**
 * @ngdoc function
 * @name camelCase
 * @description Returns a camelCase version of all the strings passed in the `inputs` array.
 *
 * @example
 * <example module="myModule">
 * <file name="index.html">
 * </file>
 *
 * <file name="capitalize.js">
 * let camelCaseFox = camelCase(['the', 'quick', 'brown', 'fox']); // 'theQuickBrownFox'
 * </file>
 * </example>
 *
 * @param  {Array} inputs A list of strings(words)
 * @return {string}       A string representing the camel case version of the words in the `inputs` list
 */
const camelCase = (inputs) => {
  if (!angular.isArray(inputs) || inputs.some(input => typeof input != 'string')) {
    return '';
  }

  return [inputs[0], inputs.slice(1).map(capitalize)].join('');
};

/**
 * @ngdoc function
 * @name appticles.api.AppticlesAPI#findCategories
 * @methodOf appticles.api.AppticlesAPI
 * @description Fetches the list of categories available for a specific publisher, via
 * the Appticles API. Each category contains a list of posts.
 *
 * @return {Promise|Array} A promise which resolves to an array of category objects
 *
 * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#exportcategories}
 */

/**
 * @ngdoc function
 * @name appticles.api.AppticlesAPI#findOneCategories
 * @methodOf appticles.api.AppticlesAPI
 * @description Retrieves a single category, for a specific publisher,
 * via the Appticles API.
 *
 * @return {Promise|Array} A promise which resolves to a category object
 *
 * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#exportcategory}
 */

/**
 * @ngdoc function
 * @name appticles.api.AppticlesAPI#findPosts
 * @methodOf appticles.api.AppticlesAPI
 * @description Fetches the list of posts available under a specific category, for a
 * specific publisher, via the Appticles API.
 *
 * @return {Promise|Array} A promise which resolves to an array of posts
 *
 * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#exportarticles}
 *
 */

/**
 * @ngdoc function
 * @name appticles.api.AppticlesAPI#findOnePosts
 * @methodOf appticles.api.AppticlesAPI
 * @description Retrieves a single post, for a specific publisher,
 * via the Appticles API.
 *
 * @return {Promise|Array} A promise which resolves to a post object
 *
 * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#exportarticle}
 */

/**
 * @ngdoc function
 * @name appticles.api.AppticlesAPI#findPages
 * @methodOf appticles.api.AppticlesAPI
 * @description Fetches the list of pages for a specific publisher, via the Appticles API.
 *
 * @return {Promise|Array} A promise which resolves to an array of pages
 *
 * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#exportpages}
 */

/**
 * @ngdoc function
 * @name appticles.api.AppticlesAPI#findOnePages
 * @methodOf appticles.api.AppticlesAPI
 * @description Retrieves a single page, for a
 * specific publisher, via the Appticles API.
 *
 * @return {Promise|Array} A promise which resolves to a page object
 *
 * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#exportpage}
 */


/**
 * @ngdoc function
 * @name appticles.api.AppticlesAPI#findComments
 * @methodOf appticles.api.AppticlesAPI
 * @description Lists all the comments under a post for a publisher.
 *
 * @return {Promise|Array} A promise which resolves to an array of comments
 *
 * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#exportcomments}
 */

/**
 * @ngdoc function
 * @name appticles.api.AppticlesAPI#insertComments
 * @methodOf appticles.api.AppticlesAPI
 * @description Creates a comment for a post related to the content of a specific publisher,
 * via the Appticles API.
 *
 * @return {Promise|Array} A promise which resolves to the success or error status
 * of saving the comment.
 *
 * {@link https://support.appticles.com/wp-mobile-pack-content-api-exporting-categories-posts/#savecomment}
 */

/**
 * @ngdoc service
 * @name appticles.api.AppticlesAPI
 *
 * @description Creates a programmatic API that wraps around the export endpoints provided via
 * the configuration service.
 */
function AppticlesAPI($log, $http, configuration) {
  const API = {};
  const exportApiEndpoints = configuration.export;

  Object.keys(exportApiEndpoints)
    .forEach((endpoint) => {
      let methods = exportApiEndpoints[endpoint];
      Object.keys(methods)
        .forEach((method) => {
          API[camelCase([method, endpoint])] = (params = {}) => {
            params.callback = 'JSON_CALLBACK';
            return $http.jsonp(methods[method], {
              method: 'GET',
              params: params
            });
          };
        });
    });

  return API;
}
