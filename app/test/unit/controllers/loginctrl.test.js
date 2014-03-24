describe('LoginCtrl', function () {
  /* jshint expr:true */

  var scope, ctrl, http, rootScope;
  var user = {
    _id: 123
  };

  var location = {
    path: sinon.stub()
  };

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
    http.expectGET('/api/login').respond(user);
    scope.login();
    http.flush();
    expect(rootScope.loggedIn).to.equal(true);
    expect(location.path).calledWith("/");
  });

  it('should show an error message on failed login and not redirect', function() {
    http.expectGET('/api/login').respond(401);
    scope.login();
    http.flush();
    expect(rootScope.loggedIn).to.not.exist;
    expect(scope.showErrorMessage).calledOnce;
    expect(location.path).notCalled;
  });
});