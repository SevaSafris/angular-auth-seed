// This single file for all controllers should be broken into individual files per controller.
angular.module("controllers", [
  "providers",
  "services"
/**
 * The parent controller for routes that need the userProfile and have an authenticated context.
 */
]).controller("UserController", function ($scope, $rootScope, $state, userProfile) {
  $rootScope.userProfile = userProfile;
  $scope.logout = function () {
    userProfile.$logout();
    $state.go("home");
  };
/**
 * The controller for the authentication UI/UX, supporting the actions: login, register, and
 * forgot.
 */
}).controller("LoginController", function ($scope, $rootScope, $stateParams, $state, userProfile, HttpStatus, ModalLoading, Crypto) {
  $scope.inputs = {forgot: ["email"]};
  $scope.inputs.login = $scope.inputs.forgot.concat("password");
  $scope.inputs.register = $scope.inputs.login.concat(["firstName", "lastName"]);

  $scope.action = $stateParams.action || "login";
  $scope.credentials = angular.copy(userProfile);

  $scope.onChangeRadio = function () {
    delete $scope["success"];
    delete $scope["error"];
  };

  $scope.formSubmit = function () {
    $scope.onChangeRadio();
    var credentials = angular.copy($scope.credentials);
    credentials.password = Crypto.sha256(credentials.password);
    $scope.working = true;
    userProfile["$" + $scope.action](credentials.filterValues(function (key, object) {
      return $scope.inputs[$scope.action].includes(key);
    }), $scope.credentials.rememberMe).then(function (response) {
      $scope.working = false;
      if ($scope.action === "forgot") {
        $scope.success = "Please check your email for a link to reset your password.";
        return;
      }

      $scope.success = "Success!";
      if ($rootScope.destination) {
        $state.go($rootScope.destination.state, $rootScope.destination.params);
        delete $rootScope["destination"];
      } else {
        $state.go("home");
      }
    }).catch(function (error) {
      $scope.working = false;
      userProfile.$logout();
      if (error.status == HttpStatus.UNAUTHORIZED)
        $scope.error = "Incorrect username or password.";
      else if (error.status == HttpStatus.NOT_ACCEPTABLE)
        $scope.error = "Incorrect information provided.";
      else if (error.status == HttpStatus.CONFLICT)
        $scope.error = "Email already registered.";
      else
        $scope.error = "Unknown error. Please try again later.";
    });
  };
/**
 * Controller for the password reset UI/UX.
 */
}).controller("ResetController", function ($scope, $rootScope, $stateParams, $state, Config, HttpStatus, Auth, Crypto) {
  $scope.credentials = {};
  $scope.$on("$viewContentLoaded", function () {
    $scope.working = true;
    Auth.reset.get($stateParams.token).then(function (result) {
      $scope.showForm = true;
      $scope.working = false;
    }).catch(function (error) {
      $scope.working = false;
      $scope.subject = Config.companyName;
      if (error.status == HttpStatus.NOT_ACCEPTABLE)
        $scope.message = "This is not a valid link.";
      else
        $scope.message = "Unknown error. Please try again later.";
    });
  });

  $scope.formSubmit = function () {
    $scope.working = true;
    Auth.reset.post($stateParams.token, Crypto.sha256($scope.credentials.password)).then(function (result) {
      $scope.working = false;
      $scope.success = true;
    }).catch(function (error) {
      $scope.working = false;
      if (error.status == HttpStatus.NOT_ACCEPTABLE) {
        $scope.expired = true;
      } else {
        $scope.error = "Unknown error. Please try again later.";
      }
    });
  };
/**
 * Controller for UI/UX of reporting a password reset request as invalid.
 */
}).controller("ReportController", function ($scope, $stateParams, Config, HttpStatus, ModalLoading, Auth) {
  $scope.$on("$viewContentLoaded", function () {
    ModalLoading.open();
    Auth.report($stateParams.token).then(function (result) {
      ModalLoading.close();
      $scope.subject = "Thanks!";
      $scope.message = "Thanks for letting us know that you did not request a password reset. Your password has not been changed.";
    }).catch(function (error) {
      ModalLoading.close();
      $scope.subject = Config.companyName;
      $scope.message = error.status == HttpStatus.NOT_ACCEPTABLE ? "This is not a valid link." : "Unknown error. Please try again later.";
    });
  });
});