function AppCtrl($scope, $http) {
	$scope.pageSettings = {};
	$http.get('/api/sessions')
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

function SessionsCtrl($scope, $http, $location) {
	$scope.pageSettings.pageTitle = "Sessions";
	$scope.pageSettings.active = "sessions";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = "New";
	$scope.pageSettings.rightButtonClick = function() {
		$location.path('/session/');
	};
}

function SessionCtrl($scope, $routeParams, $http) {
	$scope.pageSettings.pageTitle = "Session";
	$scope.pageSettings.active = "sessions";
	$scope.pageSettings.showBackButton = true;
	$scope.pageSettings.rightButtonText = "Edit";
	$scope.editMode = false;

	if ($routeParams.id != null && $routeParams.id != "")
	{
		$http.get('/api/session/' + $routeParams.id)
			.success(function(data) {
				$scope.session = data;
			})
			.error(function(data) {
				alert("Error getting session: " + data);
			});
	}
	else
	{
		$scope.session = { date: new Date() };
		$scope.editMode = true;
	}

	$scope.pageSettings.rightButtonClick = function() {
		$scope.editMode = true;
		$scope.pageSettings.showBackButton = false;
	};

	$scope.save = function()
	{
		$http.post('/api/sessions', $scope.session)
			.success(function(data) {
				$scope.editMode = false;
				$scope.pageSettings.showBackButton = true;
				$scope.session = data;
			})
			.error(function(data) { alert("Error saving session: " + data)});
	}

}