function AppCtrl($scope, $http) {
	$scope.pageSettings = {};
	$scope.loggedInUser = ''
	$http.get('/api/sessions')
		.success(function(data) {
			$scope.sessions = data;
			$scope.sortSessions();
		})
		.error(function(data) {
			alert("Error when getting sessions.")
		});

	$http.get('/api/goals')
		.success(function(data) {
			$scope.goals = data;
		})
		.error(function(data) {
			alert("Error when getting goals.")
		});

	$scope.sortSessions = function()
	{
		// Sort sessions in reverse chronological order.
		$scope.sessions.sort(function(s1, s2) {
			if (s1.date < s2.date)
				return 1;
			else if (s1.date > s2.date)
				return -1;
			else return 0;
		});
	}

	$scope.removeSession = function(sessionId) {
		for (i = 0; i < $scope.sessions.length; i++) {
			if ($scope.sessions[i]._id == sessionId)
			{
				$scope.sessions.splice(i, 1);
			}
		}
	};

	$scope.getGoalName = function(goalId) {
		for (index in $scope.goals)
		{
			if ($scope.goals[index]._id == goalId)
				return $scope.goals[index].title;
		}
	};
}

function HomeCtrl($scope, $http) {
	$scope.pageSettings.pageTitle = "OSIRIS GUITAR Journal";
	$scope.pageSettings.active = "home";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = null;

	$http.get('/api/sessions/statistics')
		.success(function(data) {
			$scope.sessionStats = data;
		})
		.error(function(data) {
			alert("Error when getting statistics overview.");
		});
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

function SessionCtrl($scope, $routeParams, $http, $location) {
	$scope.pageSettings.pageTitle = "Session";
	$scope.pageSettings.active = "sessions";
	$scope.pageSettings.showBackButton = true;
	$scope.pageSettings.rightButtonText = "Edit";
	$scope.editMode = false;

	// If id is provided, get session, from memory or DB.
	if ($routeParams.id != null && $routeParams.id != "")
	{
		// First, try to find session in the loaded array
		for (index in $scope.sessions)
		{
			if ($scope.sessions[index]._id == $routeParams.id)
			{
				$scope.session = $scope.sessions[index];
				break;
			}
		}

		if ($scope.session == null)
		{
			// Not loaded into memory, get from DB.
			$http.get('/api/session/' + $routeParams.id)
				.success(function(data) {
					$scope.session = data;
				})
				.error(function(data) {
					alert("Error getting session: " + data);
				});
		}
	}
	else
	{
		$scope.session = { date: new Date() };
		$scope.editMode = true;
	}

	$scope.pageSettings.rightButtonClick = function() {
		$scope.editMode = !$scope.editMode;
		$scope.pageSettings.showBackButton = !$scope.pageSettings.showBackButton;
		if ($scope.pageSettings.rightButtonText == "Edit")
			$scope.pageSettings.rightButtonText = "Cancel";
		else
			$scope.pageSettings.rightButtonText = "Edit";
	};

	$scope.save = function()
	{
		$http.post('/api/sessions', $scope.session)
			.success(function(data) {
				$scope.editMode = false;
				$scope.pageSettings.showBackButton = true;
				// 1 means updated, otherwise replace to get proper db id.
				if (data != 1)
				{
					$scope.session = data;					
					$scope.sessions.push(data);
				}
				$scope.rightButtonText = "Edit";
				$scope.sortSessions();
			})
			.error(function(data) { alert("Error saving session: " + data)});
	};

	$scope.delete = function() {
		$http.delete('/api/session/' + $scope.session._id)
			.success(function(data){
				$scope.removeSession($scope.session._id);
				$location.path("/sessions/");
			})
			.error(function(data){
				alert("Couldn't delete the session.");
			});
	};
}

function GoalsCtrl($scope, $http, $location) {
	$scope.pageSettings.pageTitle = "Goals";
	$scope.pageSettings.active = "goals";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = "New";
	$scope.pageSettings.rightButtonClick = function() {
		$location.path('/goal/');
	};
}

function GoalCtrl($scope, $routeParams, $http) {
	$scope.pageSettings.pageTitle = "Goal";
	$scope.pageSettings.active = "goals";
	$scope.pageSettings.showBackButton = true;
	$scope.pageSettings.rightButtonText = "Edit";
	$scope.editMode = false;

	// If id is provided, get session, from memory or DB.
	if ($routeParams.id != null && $routeParams.id != "")
	{
		// First, try to find session in the loaded array
		for (index in $scope.goals)
		{
			if ($scope.goals[index]._id == $routeParams.id)
			{
				$scope.goal = $scope.goals[index];
				break;
			}
		}

		if ($scope.goal == null)
		{
			// Not loaded into memory, get from DB.
			$http.get('/api/goal/' + $routeParams.id)
				.success(function(data) {
					$scope.goal = data;
				})
				.error(function(data) {
					alert("Error getting goal: " + data);
				});
		}
	}
	else
	{
		$scope.goal = { date: new Date() };
		$scope.editMode = true;
	}

	$scope.pageSettings.rightButtonClick = function() {
		$scope.editMode = !$scope.editMode;
		$scope.pageSettings.showBackButton = !$scope.pageSettings.showBackButton;
		if ($scope.pageSettings.rightButtonText == "Edit")
			$scope.pageSettings.rightButtonText = "Cancel";
		else
			$scope.pageSettings.rightButtonText = "Edit";
	};

	$scope.save = function()
	{
		$http.post('/api/goals', $scope.goal)
			.success(function(data) {
				$scope.editMode = false;
				$scope.pageSettings.showBackButton = true;
				// 1 means updated, otherwise replace to get proper db id.
				if (data != 1)
				{
					$scope.goal = data;					
					$scope.goals.push(data);
				}
				$scope.rightButtonText = "Edit";
				//$scope.sortSessions();
			})
			.error(function(data) { alert("Error saving goal: " + data)});
	}

}
