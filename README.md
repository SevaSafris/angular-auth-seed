# `angular-auth-seed` — <font size="6">the complete basic auth pattern, and seed for AngularJS</font>

**Why do we keep reinventing the wheel? The authentication patten has been done and done again 1,000,000 times. Instead of spending the first two weeks of development on the authentication requirement, get a jump start on implementing your business logic immediately.**

This project is based on [angular-seed][angular-seed], with the addition of **a complete and functional basic auth pattern**. The added features include **registration**, **login**, and **forgot password** functionality.

*This project is countepart (the front-end component) of the [`jax-rs-auth-seed`][jax-rs-auth-seed] project. Together, these two projects provide a developer with a fully functional platform for authenticated applications based on AngularJS and Java's JAX-RS.*

**NOTE:** This project is intended for a developer looking for a platform that has a front-end and back-end component.

This project has been configured with a build setup based on [Gulp][gulp] for workflow management, [Karma][karma] for unit testing, [Protractor][protractor] for end-to-end testing, [LESS][less] for a CSS pre-processor, template pre-caching using [gulp-angular-templatecache][templatecache], app.js concatenation and minification for production builds.

**Created with the highest standard of development in mind, this project uses best practices and patterns to empower the developer to write code that is clear, cohesive, and easily testable.**

The `angular-auth-seed` project is a complete solution, intended to be bug-free and an instant "plug-and-play" base to get you started fast and easy. Preconfigured to install the Angular framework, development prerequisites, and testing tools for instant web deployment gratification, this solution can be used to quickly bootstrap your Angular project and dev environment.

## Getting Started

To get you started, you can simply clone the `angular-auth-seed` repository. A detailed walkthrough is described below.

### Prerequisites

1. [git][git] - The version control system client needed to clone the `angular-auth-seed` repository.
2. [Node.js][node] - The JavaScript runtime for the development tools.

### Clone `angular-auth-seed`

Clone the `angular-auth-seed` repository using git:

```tcsh
git clone git@github.com:SevaSafris/angular-auth-seed.git
cd angular-auth-seed
```

If you want to start a new project without the `angular-auth-seed` commit history, then you can do:

```tcsh
git clone --depth=1 git@github.com:SevaSafris/angular-auth-seed.git <your-project-name>
```

The `depth=1` tells git to only pull down one commit worth of historical data.

### Install Dependencies

The `angular-auth-seed` project has two kinds of dependencies:

#### 1. Tools for development

The tools are necessary to create the environment for the project to be installed, developed, tested, and deployed.

1. [`bower`][bower] - The client-side package manager needed to install Angular framework libraries.

  ```tcsh
  npm -g install bower
  ```

  This installs `bower` in the npm's global context, making it available on the `$PATH` for CLI execution.

1. [`gulp`][gulp] - The automation tool used to build, run, and test the application.

  ```tcsh
  npm -g install gulp
  ```

  This installs `gulp` in the npm's global context, making it available on the `$PATH` for CLI execution.

1. `npm` dependencies - The tools needed in the development process.

  ```tcsh
  npm install
  ```

  This installs `npm` dependencies in the `node_modules` subdirectory of the project's root.

1. [Java Development Kit (JDK)][jdk] - In order to run the end-to-end tests, you will also need to have Java installed on your machine. Check out the section on [end-to-end testing](#e2e-testing) for more info.

#### 1. Angular framework libraries

The runtime platform of the application.

1. `bower` dependencies - The framework and supplementary libraries.

  ```tcsh
  bower install
  ```

  This installs `bower` dependencies in the `app/lib` path off the project's root.

  __NOTE:__ *The `app/lib` directory is the custom path configured for `bower` to install its components, as specified in the `.bowerrc` file in the project's root. By default, this path would be `bower_components`, and is overridden to make it easier to serve the files from a web server.*

### Run the Application

The project is preconfigured with a simple development web server, which can be easily started with:

```tcsh
gulp start
```

Now browse to the app at [`localhost:3000`][local-app-url].

#### Build and Development Workflow

The `angular-auth-seed` project uses `gulp` for workflow management, which refers to `gulpfile.js` for definitions of the following tasks:

1. `build:html` - Pre-cache html templates located in `app/templates/**/*.html` to `app/js/templates.js`.
1. `clean:html` - Remove `js/templates.js`.
1. `build:css` - Translate LESS templates in `app/less/**/*.less` to `app/css` directory.
1. `clean:css` - Remove `app/css` directory.
1. `build:js` - *Build JavaScript source.*
  * Without `--prod` argument: Concatenate, annotate and sourcemap JavaScript source files located in `src/js/**/*.js` to `app/js/app.js` and `app/js/app.js.map`.
  * With `--prod` argument: Concatenate, annotate, uglify and sourcemap JavaScript source files located in `src/js/**/*.js`, as well as the html templates to `app/js/app.min.js` and `app/js/app.min.js.map`.
1. `clean:js` - Remove `app/js`.
1. `test:unit` - *Run unit tests and put reports in `test` directory. See [here](#unit-testing) for more details.*
  * Without `--watch` argument: Run unit tests in "singleRun mode".
  * With `--watch` argument: Run unit tests in "watch mode".
1. `clean:test:unit` - Remove `test` directory.
1. `test:e2e` - *Run end-to-end tests. See [here](#e2e-testing) for more details.*

1. **`test`** - Run `test:unit` and `test:e2e` tasks.

1. **`clean`** - Run `clean:css`, `clean:html`, `clean:js`, and `clean:test:unit` tasks.

1. **`build`** - Run `build:css`, `build:html`, and `build:js` tasks.

1. **`start`** - Run `build` task; start watching for changes on the `src.js`, `src.less`, and `src.html` paths; start the development webserver.

`build` - Task to build `js/app.sj`

#### Concatenation, Annotation, and Pre-Caching

The `angular-auth-seed` project is designed with cohesion in mind. The build workflow pushes a lot of complexity of the JavaScript loading and template pre-caching to "build time", instead of "run time". This policy allows developers to catch many errors before the applicatioin is loaded in the browser -- errors that would otherwise be realized only once the application is executed. To accomplish this, the project has been configured with the [Gulp Workflow Manager][gulp] to concatenate and annotate the JavaScript source, and pre-cache the html templates into `app/js/app.js` and `app/js/templates.js` for development, and a single `app/js/app.min.js` for production (with the `--prod` argument passed to gulp).

When developing, the webserver is accompanied by watch tasks that detect changes to source files, CSS, and templates. When a change is detected, the relevant task is performed to regenerate the appropriate compiled asset. When executed, the compilation tasks send messages to the OS's notification system upon successful execution.

#### Adding Dependencies with Bower

[Bower][bower] is the dependency management tool used for import of client-side code, modules, and frameworks. When installing a new package via bower, you must include the package's *main file* to be loaded by your application. This is most commony done by editing `index.html` in most projects. However, in this project, this is different, because all JavaScript and html template resources are combined (concatenated, annotated, and pre-cached) into a single `app/js/app.js` (or `app/js/app.min.js` for `--prod` builds) file. To include newly installed bower packages to the build, you must edit the `lib` array defined in the `// Paths` section of `gulpfile.js`.

#### Production Builds

For production builds, one can execute the same `gulp` tasks, but with a `--prod` argument. To switch the application to use the minified `app/js/app.min.js` file, a modification has to be made in `index.html`. Please see `index.html` for details on how to switch to use the minified files.

## Directory Layout

```
.bowerrc            --> `bower` configuration
.gitignore          --> `git` ignored paths
.jshintrc           --> `jshint` configuration
.travis.yml         --> Travis Cl configuration
bower.json          --> `bower` specification for project
gulpfile.js         --> `gulp` specification for project
karma.conf.js       --> `Karma` unit test tool configuration
package.json        --> `npm` specification for project
protractor.conf.js  --> `Protractor` end-to-end test tool configuration
README.md           --> this file
app/                --> distribution path of the application assets
  .gitignore        --> `git` ignored paths
  index.html        --> app layout file (the main html template file of the app)
  index-async.html  --> just like index.html, but loads js files asynchronously
src/                --> application source files
  js/               --> JavaScript source files
    app.js          --> application module, configuration, and initialization
    controllers.js  --> controller modules
    directives.js   --> directive modules
    factories.js    --> factories modules
    providers.js    --> providers modules
    services.js     --> services modules
  less/             --> LESS CSS source files
    app.less        --> main LESS file
  template/        --> html templates
    about.html      --> About page
    contact.html    --> Contact page
    home.html       --> Home page
    login.html      --> Login page
    profile.html    --> Profile page
    reset.html      --> Reset Password page
    template.html   --> general template
    component/     --> template components
      footer.html   --> footer component
      navbar.html   --> navbar component
      sidebar.html  --> sidebar component
    modal/          --> templates for modal overlays
      loading.html  --> loading overlay
  test/             --> application test sources
    e2e/            --> end-to-end test sources
      login.js      --> end-to-end test for login
    unit/           --> unit test sources
      factories.js  --> unit test for factory modules
```

## Testing

There are two kinds of tests in the `angular-auth-seed` application: Unit tests and end-to-end tests.

<a name="unit-testing"></a>
### Running Unit Tests

The `angular-auth-seed` app contains example unit tests. The tests are written in [Jasmine][jasmine], which runs with the [Karma][karma] test runner. A Karma configuration file is provided, and is integrated to the `gulp` workflow manager.

* The unit tests are located at `src/test/unit`.
* The configuration is found in `karma.conf.js`, as well as `gulpfile.js`.

To run the unit tests as a single execution, use `gulp` to launch the tests:

```tcsh
gulp unit:test
```

This script will start the Karma test runner to execute the unit tests in "singleRun mode". 

The "singleRun mode" is useful if you want to check that a particular version of the code is operating as expected.

Karma is initially configured to use the PhantomJS runtime for testing, to make the execution as unintrusive as possible. Running PhantomJS with `singleRun = true` will cause the process to hang for up to 30s before it quits. This is a known issue that is still pending to be fixed.

Karma can also be used to run without exiting, and to start watching the source and test files for changes. In this "watch mode", Karma will watch for changes and re-run tests automatically. To launch the tests in "watch mode", simply:

```tcsh
gulp unit:test --watch
```

Running unit tests in "watch mode" is the recommended strategy; if your unit tests are being run every time you save a file then you receive instant feedback on any changes that break the expected code functionality.

#### Unit Test Reports

The unit tests are configured to produce reports of the tests, which are put in the `test-results` directory off the project's root. These include:

1. JUnit Report - A JUnit-style report file with test results.
1. Coverage Report - A code coverage report site.

<a name="e2e-testing"></a>
### Running End-to-End Tests

The `angular-auth-seed` app comes with end-to-end tests, which are also written in [Jasmine][jasmine]. These tests
are run with the [Protractor][protractor] End-to-End test runner. It uses native events and has
special features for Angular applications.

* The configuration is found in `protractor-conf.js`.
* The end-to-end tests are found in `test/e2e`.

Protractor simulates interaction with the application and verifies that the application responds
correctly. As the application requires a back-end component for end-to-end execution, Protractor must use its webDriver to simulate the back-end functionality.

Before end-to-end tests can execute successfully, the Protractor webDriver must be initialized.

```tesh
npm run update-webdriver
```

Once `webDriver` is configured, ensure that the application is started:

```tcsh
gulp start
```

Finally, you can run end-to-end tests:

```tcsh
gulp test:e2e
```

This script will execute the end-to-end tests against the application being hosted in the local development environment.

**Note:** Under the hood, Protractor uses the [Selenium Standalone Server][selenium], which in turn requires the [Java Development Kit (JDK)][jdk] to be installed on your local machine. Check this by running `java -version` from the command line.

If JDK is not already installed, you can download it [here][jdk-download].

## Updating Angular

Since the Angular framework library code and tools are acquired through package managers (npm and bower) you can use these tools to easily update the dependencies:

```tcsh
npm -g update
npm update
bower update
```

## Loading Angular Asynchronously

The `angular-auth-seed` project supports loading the framework and application scripts asynchronously. The special `index-async.html` is designed to support this style of loading. For it to work you must inject a piece of Angular JavaScript into the HTML page. The project has a predefined script to help do this:

```tcsh
npm run update-index-async
```

This will copy the contents of the `angular-loader.js` library file into the `index-async.html` page. You can run this every time you update the version of Angular that you are using.

## Serving the Application Files

As Angular is client-side-only technology, you will need to complement your application stack with a back-end component. The `angular-auth-seed` project is designed to communicate with a server
using RESTful APIs. As a complement to the `angular-auth-seed` project, we provide a similar back-end project that implements the server-side RESTful service providers based on Java's [JAX-RS][jax-rs] specification. The back-end server project can be found [here][jax-rs-auth-seed];

### Running the App in Production

This really depends on how complex your app is and the overall infrastructure of your system, but the general rule is that all you need in production are the files under the `app/` directory. Everything else should be omitted.

Angular apps are really just a bunch of static HTML, CSS and JavaScript files that need to be hosted somewhere they can be accessed by browsers.

If your Angular app is talking to the backend server via XHR or other means, you need to figure out what is the best way to host the static files to comply with the same origin policy if applicable. Usually this is done by hosting the files by the backend server or through reverse-proxying the backend server(s) and web server(s).

## Continuous Integration

### Travis CI

[Travis CI][travis] is a continuous integration service, which can monitor GitHub for new commits to your repository and execute scripts such as building the app or running tests. The `angular-seed` project contains a Travis configuration file, `.travis.yml`, which will cause Travis to run your tests when you push to GitHub.

You will need to enable the integration between Travis and GitHub. See the [Travis website][travis-docs] for instructions on how to do this.

## Contact

[Comments and Issues][angular-auth-seed-issues]

For more information on AngularJS please check out [angularjs.org][angularjs].

## License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.

[angular-auth-seed-issues]: https://github.com/SevaSafris/angular-auth-seed/issues
[angular-seed]: https://github.com/angular/angular-seed/
[angularjs]: https://angularjs.org/
[bower]: http://bower.io/
[git]: https://git-scm.com/
[gulp]: http://gulpjs.com/
[http-server]: https://github.com/indexzero/http-server
[jasmine]: https://jasmine.github.io/
[jax-rs-auth-seed]: https://github.com/SevaSafris/jax-rs-auth-seed
[jax-rs-auth-seed]: https://github.com/SevaSafris/jax-rs-auth-seed/
[jax-rs]: https://jax-rs-spec.java.net/
[jdk-download]: http://www.oracle.com/technetwork/java/javase/downloads
[jdk]: https://wikipedia.org/wiki/Java_Development_Kit
[karma]: https://karma-runner.github.io/
[less]: http://lesscss.org/
[local-app-url]: http://localhost:3000/
[node]: https://nodejs.org/en/download/
[npm]: https://www.npmjs.org/
[protractor]: http://www.protractortest.org/
[selenium]: http://docs.seleniumhq.org/
[templatecache]: https://github.com/miickel/gulp-angular-templatecache
[travis-docs]: https://docs.travis-ci.com/user/getting-started
[travis]: https://travis-ci.org/