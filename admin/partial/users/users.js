angular.module('admin').controller('UsersCtrl', function ($scope, $http) {
  'use strict';

  $http.get('/api/users').success(function(data) {
  	$scope.users = data;
  });
});

angular.module('admin').controller('UserCtrl', function ($scope, $http) {
  'use strict';

  $scope.showUserDetails = function(userId) {
  	if ($scope.userDetails) {
  		$scope.showDetails = !$scope.showDetails;
  	} else {
	  $http.get('/api/user-objects/' + userId).success(function(data) {
	  	$scope.userDetails = data;
	  	$scope.showDetails = true;
	  });
  	}
  }
});