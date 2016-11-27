"use strict";

describe("login", function () {
  beforeEach(function () {
    browser.addMockModule("httpMocker", function () {
      console.warn("Adding httpMocker...");
      angular.module("httpMocker", ["ngMockE2E"]).run(function ($httpBackend) {
        $httpBackend.whenPOST("http://localhost:8180/login").respond(function (method, url, data, headers) {
          console.warn(method + " " + url + " " + data + " " + JSON.stringify(headers));
          data = JSON.parse(data);
          return data.email == "user@domain" && data.password == "066b91577bc547e21aa329c74d74b0e53e29534d4cc0ad455abba050121a9557" ?
            [200, {
              id: "7754D1B9-B967-43D1-87E3-0F709AC21A46",
              firstName: "Test",
              lastName: "User",
              email: "user@domain"
            }, {}] :
            [401, {}, {}];
        });

        console.warn("...added httpMocker");
      });
    });

    browser.get("/#/login");
  });

  afterEach(function () {
    // Remove the mock modules again as this isn't done automatically.
    browser.clearMockModules();        
  });

  it("Should redirect to /login when location hash is login", function () {
    expect(browser.getLocationAbsUrl()).toMatch("/login");
  }); 
 
  it("Should show the signin panel on page load", function () {
    expect(element(by.id("email")).isDisplayed()).toBeTruthy();
    expect(element(by.id("password")).isDisplayed()).toBeTruthy();
  });
 
  it("Should not authenticate invalid login", function () {
    var email = element(by.id("email"));
    email.clear();
    email.sendKeys("user@domain");

    var password = element(by.id("password"));
    password.clear();
    password.sendKeys("wrong password");

    element(by.id("submit")).click().then(function () {
      expect(browser.getLocationAbsUrl()).toMatch("/login");
    });
  });
 
  it("Should authenticate valid login", function () {
    var email = element(by.id("email"));
    email.clear();
    email.sendKeys("user@domain");

    var password = element(by.id("password"));
    password.clear();
    password.sendKeys("w3lcome");

    element(by.id("submit")).click().then(function () {
      expect(browser.getLocationAbsUrl()).toMatch("/home");
    });
  });
});