// This single file for all factories should be broken into individual files per factory.
angular.module("factories", [
  "providers",
  "angular-interpolate"
/**
 * Factory that dereferences templates, interpolates against the properties argument,
 * and caches them in $templateCache.
 */
]).factory("Template", function ($q, $templateCache, $templateRequest, Interpolate) {
  return function (templateName, properties) {
    var html = $templateCache.get(templateName);
    if (html)
      return $q.resolve(Interpolate(html)(properties));

    console.warn("Using non-cached template: " + templateName);
    return $templateRequest(templateName).then(function (html) {
      return Interpolate(html)(properties);
    });
  };
/**
 * Factory for UserProfile functionality, providing authentication functionality and session/local
 * storage.
 */
}).factory("UserProfile", function ($q, $localStorage, $sessionStorage, Auth, Crypto) {
  var userProfile = {
    $login: function (credentials, rememberMe) {
      userProfile.authorization = "Basic " + Crypto.toBase64(credentials.email + ":" + credentials.password);
      userProfile.rememberMe = rememberMe;
      return Auth.login(userProfile.authorization).then(commit);
    },
    $register: function (credentials) {
      return Auth.register(credentials, userProfile.authorization).then(commit);
    },
    $forgot: function (credentials) {
      return Auth.forgot(credentials);
    },
    $logout: function () {
      delete userProfile["authorization"];
      var saved = JSON.parse((userProfile.rememberMe ? $localStorage : $sessionStorage).userProfile);
      delete saved["authorization"];
      (userProfile.rememberMe ? $localStorage : $sessionStorage).userProfile = JSON.stringify(saved);
    },
    $refresh: function () {
      return Auth.login(userProfile.authorization).then(commit).catch(function () {
        delete userProfile["authorization"];
        return userProfile;
      });
    },
    $hasRole: function (role) {
      return userProfile.roles.indexOf(role) >= 0;
    },
    $hasAnyRole: function (roles) {
      return !!userProfile.roles.filter(function (role) {
        return roles.indexOf(role) >= 0;
      }).length;
    },
    $isAuthenticated: function () {
      return !!userProfile.authorization;
    }
  };

  function commit(response) {
    for (var key in userProfile)
      if (key !== "authorization" && key !== "rememberMe" && typeof(userProfile[key]) !== "function" && userProfile.hasOwnProperty(key))
        delete userProfile[key];

    if (angular.extend(userProfile, response.data).rememberMe) {
      delete $sessionStorage["userProfile"];
      $localStorage.userProfile = JSON.stringify(userProfile);
    } else {
      delete $localStorage["userProfile"];
      $sessionStorage.userProfile = JSON.stringify(userProfile);
    }

    return userProfile;
  };

  var storedValue = $localStorage.userProfile || $sessionStorage.userProfile;
  if (!storedValue)
    return $q.resolve(userProfile);

  var storedProfile = JSON.parse(storedValue);
  angular.extend(userProfile, storedProfile);
  return storedProfile.authorization ? userProfile.$refresh() : $q.resolve(userProfile);
/**
 * Factory to create modal overlay with a busy spinner.
 */
}).factory("ModalLoading", function ($uibModal) {
  var instance;
  return {
    open: function () {
      if (!instance) {
        instance = $uibModal.open({
          template: "<img src='data:image/gif;base64,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'>",
          windowTemplateUrl: "templates/modal/loading.html",
          backdrop: false, // For a gray backdrop, use: backdrop: "static"
          keyboard: false
        });
      }
    },
    close: function () {
      if (instance) {
        instance.close();
        instance = null;
      }
    }
  };
/**
 * Factory for validation of access authorization based on UserProfile interface.
 */
}).factory("Access", function ($q, HttpStatus, UserProfile) {
  return {
    hasRole: function (role) {
      return UserProfile.then(function (userProfile) {
        return userProfile.$hasRole(role) ? HttpStatus.OK : $q.reject({status: userProfile.$isAuthenticated() ? HttpStatus.FORBIDDEN : HttpStatus.UNAUTHORIZED});
      });
    },
    hasAnyRole: function (roles) {
      return UserProfile.then(function (userProfile) {
        return userProfile.$hasAnyRole(roles) ? HttpStatus.OK : $q.reject({status: userProfile.$isAuthenticated() ? HttpStatus.FORBIDDEN : HttpStatus.UNAUTHORIZED});
      });
    },
    isAuthenticated: function () {
      return UserProfile.then(function (userProfile) {
        return userProfile.$isAuthenticated() ? HttpStatus.OK : $q.reject({status: HttpStatus.UNAUTHORIZED});
      });
    }
  };
});