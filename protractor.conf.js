'use strict';

exports.config = {
  seleniumAddress : 'http://localhost:4444/wd/hub',
  capabilities : {
    browserName: 'chrome'
  },
  suites:  {
    all:          ['test/end-to-end/**/*.po.js', 'test/end-to-end/**/*-spec.js'],
    nav:          ['test/end-to-end/layout/*.po.js', 'test/end-to-end/layout/*-spec.js'],
  },
  baseUrl: 'http://localhost:8100/',
  jasmineNodeOpts : {
    showColors : true,
    isVerbose :  true,
    // Added in order to prevent reporter messages from being prefixed with a dot "."
    print: function noop() {}
  },
  framework: 'jasmine2',
  onPrepare: function() {
    let jasmineReporters = require('jasmine-reporters');
    let SpecReporter = require('jasmine-spec-reporter');

    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: true}));
  }
};
