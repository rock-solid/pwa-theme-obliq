[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Theme Obliq


## About

This repository hosts the assets for the Obliq theme, developed by Appticles.

## Regulatory Information

In order to keep everyone in the development community feeling safe and appreciated,
we added a *Code of conduct* that we should all try to adhere to. Please go ahead
and read it before you move further with your work: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

For information regarding making contributions to the repository, please take a look
at our [CONTRIBUTING.md](CONTRIBUTING.md) document.

## Environment setup

To get your development environment up and running, please refer to the environment
configuration document. You will find more information about the tools you
need to install and the first steps needed to start developing using this seed project:
[ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)

## Coding standards

For the coding part, we rely heavily on [John Papa's Angular 1 style guide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md) which is baked
into our development process. We use ESLint to run our code style validations, and the [angular](https://www.npmjs.com/package/eslint-plugin-angular)
ESLint plugin to validate the code. The code validation step runs on buffer save.
Every time you save a file, ESLint will run and check your code for stylistic errors.
There is also a pre-commit hook that runs code validation against your code, so you will not be
able to commit code that does not adhere to the style guide, into the repository.
However, this can be bypassed, but it is a conscious/intended act rather than a mistake.
For more information, please refer to [John Papa's Angular 1 style guide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md).

## Naming conventions

For all our modules we use the naming conventions outlined in the style guide mentioned above so please be sure
to check out the [Folders-by-Feature Structure](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#folders-by-feature-structure) section.

## Commit message style guide

We use the AngularJS committing style guide for all our projects, thus, any commit message
you write must follow the structure outlined below:

```
<type>(<scope>): <subject>  
<BLANK LINE>  
<body>  
<BLANK LINE>  
<footer>
```  

To get more details on the meaning of each item in the commit message, please follow the links below:

- [type](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#type)
- [scope](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#scope)
- [subject](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#subject)  
- [body](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#body)  
- [footer](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#footer)  


## Testing

While developing any application on-top of the Appticles Starter Kit, we take a TDD(Test-Driven Development)
approach. This means that we first write some failing tests, and then we implement the functionality to make
those tests pass. This way, we are more focused on what we need to implement, and not waste a lot
of our time thinking about solutions that do not fit our current implementation.

We test our application in two ways:

- Unit tests - Karma + Jasmine
- End-to-end(E2E) tests - Protractor

For more information about our current testing toolkit please visit the official docs of [Karma](https://karma-runner.github.io/1.0/index.html), [Jasmine](http://jasmine.github.io/) and [Protractor](http://www.protractortest.org/#/).

## Useful resources

For a list of useful resources on various aspects of Ionic/AngularJS take a look at
the [USEFUL_LINKS.md](USEFUL_LINKS.md) document.

## Production process

The process to make an application production ready is detailed in the [PRODUCTION.md](PRODUCTION.md) document.