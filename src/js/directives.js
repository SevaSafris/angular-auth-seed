// This single file for all directives should be broken into individual files per directive.
angular.module("directives", [
  "factories",
  "providers"
/**
 * Directive for <include compile="true|false"> tag that uses the Template factory for
 * interpolation of variables. The compile attribute specifies whether the added html
 * should be $compile(d).
 */
]).directive("include", function ($compile, Template, Config) {
  var cache = {};

  return {
    restrict: "E",
    link: function (scope, element, attrs, controller, transcludeFn) {
      var templateName = attrs.src;
      var compile = attrs.compile === "true";
      if (cache[templateName]) {
        element.html(cache[templateName]);
        if (compile)
          $compile(element.contents())(scope);
      } else {
        Template(templateName, Config).then(function (html) {
          cache[templateName] = html;
          element.html(html);
          if (compile)
            $compile(element.contents())(scope);
        });
      }
    }
  };
});