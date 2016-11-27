"use strict";

describe("factories", function () {

  beforeEach(module("factories"));

  describe("Template", function () {
    var templateName = "template/foo.html";
    var templateContents = "<div>Test template</div>";

    beforeEach(function () {
      module(function ($provide) {
        $provide.factory("$templateRequest", function ($q) {
          return function (templateName) {
            return {
              then: function () {
                return $q.resolve(templateContents);
              }
            };
          }
        });
      });
    });

    it("$templateCache", inject(function () {
      inject(function ($rootScope, $templateCache, Template) {
        $templateCache.put(templateName, templateContents);

        var template;
        Template(templateName).then(function (html) {
          expect(html).toBe(templateContents);
        }).catch(function (error) {
          fail(error);
        });

        $rootScope.$digest();
      });
    }));

    it("$templateRequest", inject(function () {
      inject(function ($rootScope, $httpBackend, Template) {
        $httpBackend.whenGET(templateName).respond(templateContents);

        Template(templateName).then(function (html) {
          expect(html).toBe(templateContents);
        }).catch(function (error) {
          fail(error);
        });

        $rootScope.$digest();
      });
    }));
  });
});