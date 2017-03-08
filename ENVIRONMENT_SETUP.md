# Environment setup

## Prerequisites

- NodeJS - 4.x or higher
- A globally-installed version of [Bower](https://bower.io/)
- A globally-installed version of [Gulp](http://gulpjs.com/)
- A globally-installed version of [commitizen](https://www.npmjs.com/package/commitizen)
- A globally-installed version of [Ionic CLI](http://ionicframework.com/docs/cli/install.html)
- [EditorConfig](http://editorconfig.org/) plugin for your preferred text editor/intended
- A code linter plugin that can use ESLint, to get visual feedback of code errors directly in your IDE/editor
  - Atom: [linter plugin](https://atom.io/packages/linter) + [linter-eslint](https://atom.io/packages/linter-eslint)
  - Sublime Text: [SublimeLinter](https://packagecontrol.io/packages/SublimeLinter) +  [SublimeLinter-contrib-eslint](https://packagecontrol.io/packages/SublimeLinter-contrib-eslint)
  - NeoVim: [NeoMake](https://github.com/neomake/neomake) + globally installed ESLint module
    - [Linting code with Neovim and Neomake - ESLint edition](https://gregjs.com/vim/2015/linting-code-with-neovim-and-neomake-eslint-edition/?=)

## Setup

After you have installed everything above, you need to run the following tasks, in order:

- `npm install`
- `bower install`
- `ionic serve`

You should see your default browser open, and an Ionic 1 application booting up.
If you see an error, like this: **"Error: ENOENT: no such file or directory, open '/$USERNAME_HOME/$PROJECTS_PATH/appticles-ionic1-seed/www/index.html'
please refresh your browser, as the gulp jobs might not have had time to finish, before the application was started, in the browser.

## Gulp tasks

- `default` - The task that will be run whenever you run `gulp` with no arguments
  - Internally runs `compilejs`, `sass`, `minify-html` and `copy-assets`
- `watch` - Starts a watch process, for changes in the `src/` directory and runs the `default`
task for each file change
- `compilejs` - Takes all the JavaScript source code from `src/` and runs it through Babel.js
outputting the ES5-compiled code to the `www/` directory
- `lint` - Validates that the JavaScript sources (ES6) adhere to the style guide (John Papa's AngularJS style guide)
- `sass` - Compiles the SASS files into compatible CSS files
- `minify-html` - Takes all the HTML files from the `src/` directory, performs a whitespace removal step
on each of them and then moves everything to the `www/` directory
- `copy-assets` - This task is responsible for copying all assets from the `src/` directory to the `www/` directory.
It is useful for custom fonts, images as well as JSON configuration files.
- `ngdoc` - This task generates documentation from the ngdoc-style comments available in the
source code. This is a manual task that can be run by anyone and its results can be served from a webserver.
- `test` - Performs a single run of the unit tests located in `test/unit-tests/`. This is also used when running the pre-push hook, which means that all tests must pass in order to be able to push on a branch.
- `test:watch` - Starts the tests in watch mode. Every time a test in `tests/unit-tests/` changes the code is run again by the Karma Chrome Launcher and the results are displayed in the console.

## Protractor

Protractor has been chosen for testing the application end-to-end (user flows, application functionality). For more information on how to write tests, there are great resources in the [USEFUL_LINKS.md document](USEFUL_LINKS.md)
