describe('HomeCtrl', function () {

  var scope, ctrl;
  var statistics;

  beforeEach(function () {
    module('GuitarJournalApp');
    inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      $rootScope.apiStatus = { loading: 0 };
      scope.setDefaultPageSettings = sinon.stub();
      scope.pageSettings = {};
      ctrl = $controller('LoginCtrl', {$scope: scope, Statistics: statistics});
    });
  });

  it('should reset the page settings', function() {
    expect(scope.setDefaultPageSettings).calledOnce;
  });

  it('should redirect to / on successful login', function () {
    expectGET('/api/login').respond()
  });

  it('should call methods on the Instruments service', function () {
    expect(statistics.getStatsOverview).calledOnce;
    expect(statistics.getWeekStats).calledOnce;
  });
});