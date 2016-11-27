// This single file for all services should be broken into individual files per service.
angular.module("services", [
  "providers"
/**
 * Service for authentication interface methods to back-end server.
 */
]).service("Auth", function ($http, Config) {
  return {
    login: function (authorization) {
      return $http.get(Config.serviceUrl + "/login", {
        headers: {
          "Authorization": authorization,
          "Accept": Config.accept
        }
      });
    },
    register: function (credentials) {
      return $http.post(Config.serviceUrl + "/register", credentials, {
        headers: {
          "Accept": Config.accept,
          "Content-Type": Config.contentType
        }
      });
    },
    forgot: function (credentials) {
      return $http.post(Config.serviceUrl + "/forgot", credentials, {
        headers: {
          "Content-Type": Config.contentType
        }
      });
    },
    reset: {
      get: function (token) {
        return $http.get(Config.serviceUrl + "/forgot/reset/" + token);
      },
      post: function (token, password) {
        return $http.post(Config.serviceUrl + "/forgot/reset/" + token, password, {
          headers: {
            "Content-Type": "text/plain"
          }
        });
      }
    },
    report: function (token) {
      return $http.post(Config.serviceUrl + "/forgot/report/" + token);
    }
  };
});