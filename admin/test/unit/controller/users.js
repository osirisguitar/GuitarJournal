describe('UsersCtrl', function () {

  var scope, ctrl;

  beforeEach(function () {
    module('admin');
    inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('UsersCtrl', {$scope: scope});
    });
  });

  xit('should have tests', function () {
    
  });

});