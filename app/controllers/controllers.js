function AppCtrl($scope, $http) {
	$scope.pageSettings = {};
	$scope.loggedInUser = '';
	$http.get('/api/sessions')
		.success(function(data) {
			$scope.sessions = data;
			$scope.sortSessions();
		})
		.error(function(data) {
			alert("Error when getting sessions.")
		});

	$http.get('/api/statistics/overview')
		.success(function(data) {
			$scope.statsOverview = data;
			var firstSession = new Date($scope.statsOverview.firstSession);
			var lastSession = new Date($scope.statsOverview.latestSession);
			var days = Math.round(lastSession.getTime() - firstSession.getTime())/86400000;
			var weeks = days/7;
			$scope.statsOverview.sessionsPerWeek = Math.round($scope.statsOverview.totalSessions / weeks * 100)/100;
		})
		.error(function(data) {
			alert("Error when getting statistics overview.");
		});

	$scope.readGoals = function() {
		$http.get('/api/goals')
			.success(function(data) {
				$scope.goals = data;
			})
			.error(function(data) {
				alert("Error when getting goals.")
			});		
	}
	$scope.readGoals();

	$http.get('/api/profile')
		.success(function(data) {
			$scope.profile = data;
		})
		.error(function(data){
			alert("Error when getting profile.")
		});

	$http.get('/api/instruments')
		.success(function(data) {
			$scope.instruments = data;
		})
		.error(function(data) {
			alert("Error when getting instruments.");
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
	};

	$scope.removeSession = function(sessionId) {
		for (i = 0; i < $scope.sessions.length; i++) {
			if ($scope.sessions[i]._id == sessionId)
			{
				$scope.sessions.splice(i, 1);
			}
		}
	};

	$scope.removeInstrument = function(instrumentId) {
		for (i = 0; i < $scope.instruments.length; i++) {
			if ($scope.instruments[i]._id == instrumentId)
			{
				$scope.instruments.splice(i, 1);
			}
		}		
	}

	$scope.removeGoal = function(goalId) {
		for (i = 0; i < $scope.goals.length; i++) {
			if ($scope.goals[i]._id == goalId)
			{
				$scope.goals.splice(i, 1);
			}
		}		
	}

	$scope.getGoalName = function(goalId) {
		for (index in $scope.goals)
		{
			if ($scope.goals[index]._id == goalId)
				return $scope.goals[index].title;
		}
	};

	$scope.getInstrument = function (instrumentId) {
		for (i = 0; $scope.instruments && i < $scope.instruments.length; i++) {
			if ($scope.instruments[i]._id == instrumentId) {
				return $scope.instruments[i];
			}
		}
	}
}

function HomeCtrl($scope, $http) {
	$scope.pageSettings.pageTitle = "OSIRIS GUITAR Journal";
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

	$scope.getInstrumentName = function(instrumentId) {
		var instrument = $scope.getInstrument(instrumentId);
		if (instrument)
			return instrument.name;
	}
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

function GoalCtrl($scope, $routeParams, $http, $location) {
	$scope.pageSettings.pageTitle = "Goal";
	$scope.pageSettings.active = "goals";
	$scope.pageSettings.showBackButton = true;
	$scope.pageSettings.rightButtonText = "Edit";
	$scope.editMode = false;

	// If id is provided, get session, from memory or DB.
	if ($routeParams.id != null && $routeParams.id != "") {
		// First, try to find session in the loaded array
		for (index in $scope.goals) {
			if ($scope.goals[index]._id == $routeParams.id) {
				$scope.goal = $scope.goals[index];
				break;
			}
		}

		if ($scope.goal == null) {
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
	else {
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

	$scope.getDate = function() {
		return new Date();
	}

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
					$scope.readGoals();
				}
				$scope.rightButtonText = "Edit";
				//$scope.sortSessions();
			})
			.error(function(data) { alert("Error saving goal: " + data)});
	}

	$scope.delete = function() {
		$http.delete('/api/goal/' + $scope.goal._id)
			.success(function(data){
				$scope.removeGoal($scope.goal._id);
				$location.path("/goals/");
			})
			.error(function(data){
				alert("Couldn't delete the goal.");
			});
	};
};

function StatsCtrl($scope, $http) {
	$scope.pageSettings.pageTitle = "OSIRIS GUITAR Journal";
	$scope.pageSettings.active = "stats";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = null;
}

function ProfileCtrl($scope, $http, $location)
{
	$scope.pageSettings.pageTitle = "Profile";
	$scope.pageSettings.active = "profile";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = "New";
	$scope.pageSettings.rightButtonClick = function() {
		$location.path('/instrument/');
	};

};

function InstrumentCtrl($scope, $http, $location, $routeParams)
{
	$scope.pageSettings.pageTitle = "Instrument";
	$scope.pageSettings.active = "profile";
	$scope.pageSettings.showBackButton = true;
	$scope.pageSettings.rightButtonText = "Edit";
	$scope.editMode = false;

	// If id is provided, get session, from memory or DB.
	if ($routeParams.id != null && $routeParams.id != "")
	{
		// First, try to find session in the loaded array
		for (index in $scope.instruments)
		{
			if ($scope.instruments[index]._id == $routeParams.id)
			{
				$scope.instrument = $scope.instruments[index];
				break;
			}
		}

		if ($scope.instrument == null)
		{
			// Not loaded into memory, get from DB.
			$http.get('/api/instrument/' + $routeParams.id)
				.success(function(data) {
					$scope.goal = data;
				})
				.error(function(data) {
					alert("Error getting instrument: " + data);
				});
		}
	}
	else
	{
		$scope.instrument = {};
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

	$scope.save = function() {
		$http.post('/api/instruments', $scope.instrument)
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
			.error(function(data) { alert("Error saving instrument: " + data)});
	}

	$scope.delete = function() {
		$http.delete('/api/instrument/' + $scope.instrument._id)
			.success(function(data){
				$scope.removeInstrument($scope.instrument._id);
				$location.path("/profile/");
			})
			.error(function(data){
				alert("Couldn't delete the instrument.");
			});
	}
}
