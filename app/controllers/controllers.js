function AppCtrl($scope, $http) {
	$scope.pageSettings = {};
	$http.get('/api/users/123/sessions')
		.success(function(data) {
			$scope.sessions = data;
		})
		.error(function(data) {
			alert("Error when getting sessions.")
		});
}

function HomeCtrl($scope) {
	$scope.pageSettings.pageTitle = "Osiris Guitar Journal";
	$scope.pageSettings.active = "home";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = null;
}

function SessionsCtrl($scope, $http) {
	$scope.pageSettings.pageTitle = "Sessions";
	$scope.pageSettings.active = "sessions";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = "New";
	$scope.pageSettings.rightButtonClick = function() {
		alert("New!")
	};
}

function SessionCtrl($scope, $routeParams, $http) {
	$scope.sessionId = $routeParams.id;
	$scope.pageSettings.active = "sessions";
	$scope.pageSettings.showBackButton = true;
	$scope.pageSettings.rightButtonText = "Edit";

	$scope.pageSettings.rightButtonClick = function() {
		alert("Edit!")
	};

	// dummy code
	for (i = 0; i < $scope.sessions.length; i++)  {
		if ($scope.sessions[i].id == $scope.sessionId) {
			$scope.session = $scope.sessions[i];
			break;
		}
	}
}