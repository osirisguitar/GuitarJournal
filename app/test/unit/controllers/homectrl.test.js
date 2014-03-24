describe('HomeCtrl', function () {
  /* jshint expr:true */

  var scope, ctrl;
  var statistics;

  beforeEach(function () {
    module('GuitarJournalApp');
    inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      $rootScope.apiStatus = { loading: 0 };
      scope.setDefaultPageSettings = sinon.stub();
      statistics = {
        getStatsOverview: sinon.stub(),
        getWeekStats: sinon.stub()
      };
      scope.pageSettings = {};
      ctrl = $controller('HomeCtrl', {$scope: scope, Statistics: statistics});
    });
  });

  it('should set the right page settings', function () {
    expect(scope.setDefaultPageSettings).calledOnce;
    expect(scope.pageSettings.pageTitle).to.equal("OSIRIS GUITAR Journal");
    expect(scope.pageSettings.active).to.equal("home");
  });

  it('should call methods on the Instruments service', function () {
    expect(statistics.getStatsOverview).calledOnce;
    expect(statistics.getWeekStats).calledOnce;
  });
});