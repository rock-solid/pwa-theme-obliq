'use strict';

exports.config = {
  seleniumAddress : 'http://localhost:4444/wd/hub',
  capabilities : {
    browserName: 'chrome'
  },
  suites:  {
    all:          ['test/end-to-end/**/*.po.js', 'test/end-to-end/**/*-spec.js'],
    latest:       ['test/end-to-end/posts/latest/*.po.js', 'test/end-to-end/posts/latest/*-spec.js'],
    nav:          ['test/end-to-end/layout/*.po.js', 'test/end-to-end/layout/*-spec.js'],
    postdetails:  ['test/end-to-end/posts/details/*.po.js', 'test/end-to-end/posts/details/*-spec.js'],
    pagedetails:  ['test/end-to-end/pages/*.po.js', 'test/end-to-end/pages/details/*-spec.js'],
    comments:     'test/end-to-end/posts/comments/*-spec.js',
    addcomment:   'test/end-to-end/posts/add-comment/*-spec.js',
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
