function AppCtrl($scope) {
	$scope.pageSettings = {};
	$scope.sessions = [
		{ id: "0", date: "2013-01-01", "length": "15", "goal": "Lorem ipsum", "notes": "Bacon ipsum", "goal": "Spela fortare", "bpm": "130", "instrument": "Schecter Omen 7", "grade": "3" },
		{ id: "1", date: "2013-01-03", "length": "47", "goal": "Lorem ipsum", "notes": "Bacon ipsum", "goal": "Spela fortare", "bpm": "140", "instrument": "Ibanez S470", "grade": "4" },
		{ id: "2", date: "2013-01-04", "length": "31", "goal": "Lorem ipsum", "notes": "Bacon ipsum", "goal": "Spela fortare", "bpm": "120", "instrument": "Cort M520", "grade": "3" }
	];
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