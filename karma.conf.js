module.exports = function (config) {
  config.set({
    /**
     * Base path that will be used to resolve all patterns (eg. files, exclude).
     * NOTE: This is replaced with a "files" parameter of patterns that include the full path relative to gulpfile.js
     */
    // basePath: "app",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine"],

    /*
     * List of files / patterns to load in the browser.
     * NOTE: This is being passed in as an argument from gulp.
     */
    // files: [
    //   "lib/angular/angular.js",
    //   "lib/angular-mocks/angular-mocks.js",
    //   "js/*.js",
    //   "test/unit/**/*.js"
    // ],

    // list of files to exclude
    // exclude: [
    // ],

    /**
     * preprocess matching files before serving them to the browser
     * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
     * NOTE: This is being passed in as an argument from gulp.
     */
    // preprocessors: {
    //   "app/js/**/*.js": ["coverage"]
    // },

    /**
     * test results reporter to use
     * possible values: "dots", "progress"
     * available reporters: https://npmjs.org/browse/keyword/karma-reporter
     * NOTE: This is being passed in as an argument from gulp.
     */
    // reporters: ["mocha", "junit", "coverage"],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //* NOTE: This is being passed in as an argument from gulp.
    // browsers: ["PhantomJS", "Chrome", "Firefox"],

     /**
     * Continuous Integration mode
     * if true, Karma captures browsers, runs the tests and exits
     * NOTE: This is being passed in as an argument from gulp.
     */
    // singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};