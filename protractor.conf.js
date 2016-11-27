exports.config = {
  plugins: [{
    package: "protractor-console",
    logLevels: ["severe", "warning", "info", "debug"] // log is not working!!
  }],

  allScriptsTimeout: 99999,

  // The location of the selenium standalone server .jar file, relative
  // to the location of this config. If no other method of starting selenium
  // is found, this will default to
  // node_modules/protractor/selenium/selenium-server...
  // seleniumServerJar: "node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-2.53.1.jar",

  /**
   * Use `seleniumAddress` for faster startup; run `./node_modules/.bin/webdriver-manager start` to launch the Selenium server.
   * Use `seleniumPort` to let Protractor manage its own Selenium server instance (using the server JAR in its default location).
   */
  //seleniumAddress: "http://localhost:4444/wd/hub",
  seleniumPort: 4444,

  /**
   * Properties passed to Selenium -- see https://code.google.com/p/selenium/wiki/DesiredCapabilities for more info.
   */
  capabilities: {
    "browserName": "chrome"
  },

  /**
   * This should point to your running app instance, for relative path resolution in tests.
   * NOTE: This is being passed in as an argument from gulp.
   */
  // baseUrl: "http://localhost:3000"

  framework: "jasmine",

  /**
   * Path to your E2E test files, relative to the location of this configuration file.
   * NOTE: This is being passed in as an argument from gulp.
   */
  // specs: [
  //   "app/test/e2e/**/*.js",
  // ],

  /**
   * Options to be passed to Jasmine-node.
   */
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    isVerbose : true,
    includeStackTrace : true
  }
};