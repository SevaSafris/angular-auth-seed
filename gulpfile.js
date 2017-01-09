"use strict";

var gulp = require("gulp");
var moment = require("moment");
var addStream = require("add-stream");
var karma = require("karma");

var concat = require("gulp-concat");
var connect = require("gulp-connect");
var cssmin = require("gulp-cssmin");
var del = require("del");
var gulpif = require("gulp-if");
var htmlmin = require("gulp-htmlmin");
var less = require("gulp-less");
var ngAnnotate = require("gulp-ng-annotate");
var notify = require("gulp-notify");
var plumber = require("gulp-plumber");
var protractor = require("gulp-protractor");
var rename = require("gulp-rename");
var replace = require("gulp-just-replace");
var sourcemaps = require("gulp-sourcemaps");
var templateCache = require("gulp-angular-templatecache");
var uglify = require("gulp-uglify")
var util = require("gulp-util");

var argv = require("yargs").argv;

// Config

var host = "localhost";
var port = 3000;

// Paths

var srcdir = "src";
var distdir = "app";

var platform = {
  angular: distdir + "/lib/angular/angular.js",
  angularMocks: distdir + "/lib/angular-mocks/angular-mocks.js"
};

var lib = [
  distdir + "/lib/angular-route/angular-route.js",
  distdir + "/lib/angular-ui-router/release/angular-ui-router.js",
  distdir + "/lib/object-prototype-filter/object-prototype-filter.min.js",
  distdir + "/lib/object-traverse/object-traverse.min.js",
  distdir + "/lib/angular-bootstrap/ui-bootstrap.js",
  distdir + "/lib/angular-interpolate/angular-interpolate.js",
  distdir + "/lib/spin.js/spin.js",
  distdir + "/lib/angular-spinner/angular-spinner.js",
  distdir + "/lib/ngstorage/ngStorage.js",
  distdir + "/lib/cryptojslib/rollups/sha256.js",
  distdir + "/lib/cryptojslib/components/enc-base64.js"
];

var src = {
  index: srcdir + "/index*.html",
  js: srcdir + "/js/**/*.js",
  less: srcdir + "/less/**/*.less",
  html: srcdir + "/template/**/*.html"
};

var test = {
  unit: srcdir + "/test/unit/**/*.js",
  e2e: srcdir + "/test/e2e/**/*.js"
}

var target = {
  js: distdir + "/js",
  css: distdir + "/css",
  test: distdir + "/test"
}

var templates = target.js + "/templates.js";

// Utils

function log(text) {
  return {
    title: moment().format("h:mm:ss A"),
    message: text
  }
}

function plumberStream() {
  return plumber({
    handleError: function (error) {
      notify.onError("Error: <%= error.message %>");
      this.emit("end", new util.PluginError(taskName, error, {
        showStack: true
      }));
    }
  });
}

function buildHtmlStream() {
  return gulp.src(src.html)
  .pipe(htmlmin({
    minimize: true,
    removeComments: true,
    collapseWhitespace: true,
    preserveLineBreaks: false,
    conservativeCollapse: false,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    removeCDATASectionsFromCDATA: true
  }))
  .pipe(templateCache({
    root: "template",
    module: distdir,
  }));
}

// Tasks: build

gulp.task("build:index", function () {
  var appJs;
  var css;
  var config;
  if (argv.prod) {
    appJs = "<script src=\"js/app.min.js\"></script>";
    css = "css/app.min.css";
    config = "scheme: '" + (argv.scheme ? argv.scheme : "https") + "',\n        host: '" + (argv.host ? argv.host : "prod.mycompany") + "',";
  } else {
    var js = [platform.angular.substring(distdir.length + 1), platform.angularMocks.substring(distdir.length + 1)].concat(["js/app.js", "js/templates.js"]);
    appJs = "<script src=\"" + js.join("\"></script>\n  <script src=\"") + "\"></script>";
    css = "css/app.css";
    config = "scheme: '" + (argv.scheme ? argv.scheme : "http") + "',\n\        host: '" + (argv.host ? argv.host : "localhost:8180") + "',";
  }

  gulp.src(src.index)
  .pipe(replace([{
    search: /{{APP_JS}}/g,
    replacement: appJs
  }, {
    search: /{{CSS}}/g,
    replacement: css
  }, {
    search: /{{CONFIG}}/g,
    replacement: config
  }]))
  .pipe(gulp.dest(distdir))
  .pipe(notify(log("Finished build:index")));
});

gulp.task("build:html", function () {
  buildHtmlStream()
  .pipe(rename(templates))
  .pipe(gulp.dest("."))
  .pipe(notify(log("Finished build:html")));
});

gulp.task("clean:html", function (callback) {
  del.sync([target.css], callback);
});

gulp.task("build:css", function () {
  var stream = gulp.src(src.less)
  .pipe(plumberStream())
  .pipe(less());

  if (argv.prod) {
    stream = stream
    .pipe(cssmin())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(target.css));
  }

  stream.pipe(gulp.dest(target.css))
  .pipe(notify(log("Finished build:css")));
});

gulp.task("clean:css", function (callback) {
  del.sync([target.css], callback);
});

gulp.task("build:js", function () {
  gulp.src((argv.prod ? [platform.angular] : []).concat(lib).concat([src.js]))
  .pipe(plumberStream())
  .pipe(gulpif(argv.prod, addStream.obj(buildHtmlStream())))
  .pipe(gulpif(!argv.prod, sourcemaps.init()))
  .pipe(concat(argv.prod ? "app.min.js" : "app.js"))
  .pipe(ngAnnotate())
  .pipe(gulpif(argv.prod, uglify()))
  .pipe(gulpif(!argv.prod, sourcemaps.write()))
  .pipe(gulp.dest(target.js))
  .pipe(notify(log("Finished build:js")));
});

gulp.task("clean:js", function (callback) {
  del.sync([target.js], callback);
});

// Tasks: Test

gulp.task("test:unit", ["build"], function (done) {
  var config = {
    configFile: require("path").resolve("karma.conf.js"),
    browsers: ["PhantomJS"/*, "Chrome"*/], // Set to Chrome to show a chrome window // NOTE: Running PhantomJS with singleRun = true will cause the process to hang for 30s before it quits.. this is a known issue
    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true
    },
    files: [
      platform.angular,
      platform.angularMocks
    ].concat(lib).concat([{
        pattern: src.js,
        watched: true
      }, {
        pattern: templates,
        watched: true
      },
      test.unit
    ]),
    preprocessors: {},

    // test results reporter to use
    // possible values: "dots", "progress"
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["mocha", "junit", "coverage"],

    junitReporter: {
      outputDir: target.test + "/karma-reports", // results will be saved as $outputDir/$browserName.xml
      outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
      suite: "", // suite will become the package name attribute in xml testsuite element
      useBrowserName: true, // add browser name to report and classes names
      nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
      classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
      properties: {} // key value pair of properties to add to the <properties> section of the report
    },
    coverageReporter: {
      dir: target.test + "/karma-coverage", // specify a common output directory
      instrumenterOptions: {
        istanbul: {
          noCompact: true // When using the istanbul instrumenter (default), you can disable code compaction by adding the following to your configuration.
        }
      },
      reporters: [{
        type: "html", subdir: "report-html" // reporters not supporting the `file` property
      }, {
        type: "lcov", subdir: "report-lcov"
      }, {
        type: "cobertura", subdir: ".", file: "cobertura.txt" // reporters supporting the `file` property, use `subdir` to directly output them in the `dir` directory
      }, {
        type: "lcovonly", subdir: ".", file: "report-lcovonly.txt"
      }, {
        type: "teamcity", subdir: ".", file: "teamcity.txt"
      }, {
        type: "text", subdir: ".", file: "text.txt"
      }, {
        type: "text-summary", subdir: ".", file: "text-summary.txt"
      }]
    }
  };

  if (!argv.watch)
    config.singleRun = true;

  config.preprocessors[target.js + "/*.js"] = ["coverage"];
  new karma.Server(config, function () {
    console.log("done");
    // TODO: Notify of success.
    done();
  }).start();
});

gulp.task("clean:test:unit", function (callback) {
  del.sync([target.test], callback);
});

gulp.task("test:e2e", ["build"], function () {
  gulp.src(test.e2e)
  .pipe(plumberStream())
  .pipe(protractor.protractor({
    configFile: "protractor.conf.js",
    args: ["--baseUrl", "http://" + host + ":" + port]
  }));
});

gulp.task("test", ["test:unit", "test:e2e"]);

gulp.task("clean", ["clean:css", "clean:html", "clean:js", "clean:test:unit"]);

gulp.task("build", ["build:index", "build:css", "build:html", "build:js"]);

gulp.task("start", ["build"], function () {
  gulp.watch(src.index, ["build:index"]);
  gulp.watch(src.js, ["build:js"]);
  gulp.watch(src.less, ["build:css"]);
  gulp.watch(src.html, ["build:html"]);
  connect.server({
    root: distdir,
    port: port
  });
});