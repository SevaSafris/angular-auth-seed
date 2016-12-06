/**
 * The main app module.
 */
angular.module("app", [
  "controllers",
  "directives",
  "factories",
  "providers",
  "services",
  "ui.router",
  "ui.bootstrap",
  "ngStorage",
  "angular-interpolate",
  "angularSpinner"
/**
 * State and route config.
 */
]).config(["$urlRouterProvider", "$stateProvider", function ($urlRouterProvider, $stateProvider) {
  console.log("configuring $stateProvider");

  $stateProvider.state("user", {
    abstract: true,
    template: "<ui-view/>",
    controller: "UserController",
    resolve: {
      userProfile: "UserProfile"
    }
  }).state("login", {
    url: "/login",
    parent: "user",
    templateUrl: "template/login.html",
    controller: "LoginController",
    title: "Login",
    params: {
      action: {
        value: "login"
      },
      hiddenParam: "YES"
    }
  }).state("reset", {
    url: "/forgot/reset/{token}",
    templateUrl: "template/reset.html",
    controller: "ResetController",
    title: "Reset"
  }).state("report", {
    url: "/forgot/report/{token}",
    templateProvider: function (Template) {
      return Template("template/template.html");
    },
    controller: "ReportController",
    title: "Report"
  }).state("home", {
    url: "/home",
    parent: "user",
    templateUrl: "template/home.html",
    // controller: "HomeController",
    title: "Home"
  }).state("contact", {
    url: "/contact",
    templateUrl: "template/contact.html",
    // controller: "ContactController",
    title: "Contact"
  }).state("about", {
    url: "/about",
    templateUrl: "template/about.html",
    // controller: "ContactController",
    title: "About"
  }).state("profile", {
    url: "/profile",
    parent: "user",
    templateUrl: "template/profile.html",
    // controller: "ProfileController",
    resolve: {
      userProfile: "UserProfile",
      access: function (Access) {
        return Access.isAuthenticated();
      },
    },
    title: "Profile"
  }).state("admin", {
    /* ... */
    parent: "user",
    resolve: {
      access: function (Access) {
        return Access.hasRole("ROLE_ADMIN");
      },
    },
    title: "Admin"
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise("/home");
}]).config(function ($httpProvider) {
  console.log("configuring $http interceptor");

  $httpProvider.interceptors.push(function ($q) {
    return {
      request: function (config) {
        console.log("$http[request]", config);
        return config;
      },

      response: function (response) {
        // URL-decode all strings
        if (typeof(response.data) === "object") {
          Object.traverse(response.data, function(node, value, key, path, depth) {
            if (typeof(value) === "string")
              node[key] = decodeURIComponent(value);
          });
        }

        console.log("$http[response]", response);
        return response;
      },

      responseError: function (error) {
        console.log("$http[error]", error);
        return $q.reject(error);
      }
    };
  });
/**
 * Registration of state and route -related event callbacks.
 */
}).run(function ($rootScope, $state, HttpStatus) {
  $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) { 
    console.log("$stateChangeStart:", toState.name);
  });

  $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
    if (current.hasOwnProperty("$$route")) {
      $rootScope.title = current.$$route.title;
    }
  });

  $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
    console.log("$stateChangeError:", event);
    if (error.status == HttpStatus.UNAUTHORIZED) {
      if (!$rootScope.destination) {
        $rootScope.destination = {
          state: toState,
          params: toParams
        }
      }

      event.preventDefault();
      $state.go("login", {}, {
        location: false
      });
    } else if (error.status == HttpStatus.FORBIDDEN) {
      event.preventDefault();
      $state.go("forbidden", {}, {
        location: false
      });
    }
  });
});