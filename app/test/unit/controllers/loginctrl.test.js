describe('LoginCtrl', function () {
  /* jshint expr:true */

  var scope, ctrl, http, rootScope;
  var user = {
    _id: 123
  };

  var location = {
    path: sinon.stub()
  };

  var email = "test@user.com";
  var password = "1234";

  beforeEach(function () {
    module('GuitarJournalApp');
    inject(function ($rootScope, $controller, $httpBackend) {
      scope = $rootScope.$new();
      rootScope = $rootScope;
      $rootScope.apiStatus = { loading: 0 };
      scope.setDefaultPageSettings = sinon.stub();
      scope.pageSettings = {};
      scope.showErrorMessage = sinon.stub();
      http = $httpBackend;
      ctrl = $controller('LoginCtrl', {$scope: scope, $rootScope: $rootScope, $location: location });
    });
  });

  afterEach(function() {
    http.verifyNoOutstandingExpectation();
    http.verifyNoOutstandingRequest();
  });

  it('should reset the page settings', function() {
    expect(scope.setDefaultPageSettings).calledOnce;
  });

  it('should redirect to / on successful login', function () {
    scope.email = email;
    scope.password = password;
    http.expectGET('/api/login?email=' + email + '&password=' + password).respond(user);
    scope.login();
    http.flush();
    expect(rootScope.loggedIn).to.equal(true);
    expect(location.path).calledWith("/");
  });

  it('should show an error message on failed login and not redirect', function() {
    scope.email = email;
    scope.password = password;
    http.expectGET('/api/login?email=' + email + '&password=' + password).respond(401);
    scope.login();
    http.flush();
    expect(rootScope.loggedIn).to.not.exist;
    expect(scope.showErrorMessage).calledOnce;
    expect(location.path).notCalled;
  });
});