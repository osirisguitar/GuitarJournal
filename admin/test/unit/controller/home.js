describe('HomeCtrl', function () {

  var scope, ctrl;

  beforeEach(function () {
    module('admin');
    inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('HomeCtrl', {$scope: scope});
    });
  });

  xit('should have tests', function () {
    
  });

});