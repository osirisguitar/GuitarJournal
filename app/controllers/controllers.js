function AppCtrl($scope, $http, Sessions) {
	$scope.pageSettings = {};
	$scope.loggedInUser = '';

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

	$http.get('/api/statistics/overview/7')
		.success(function(data) {
			$scope.weekStats = data;
			var firstSession = new Date($scope.weekStats.firstSession);
			var lastSession = new Date($scope.weekStats.latestSession);
			var days = Math.round(lastSession.getTime() - firstSession.getTime())/86400000;
			var weeks = days/7;
			$scope.weekStats.sessionsPerWeek = Math.round($scope.weekStats.totalSessions / weeks * 100)/100;
		})
		.error(function(data) {
			alert("Error when getting statistics overview.");
		});

	$http.get('/api/profile')
		.success(function(data) {
			$scope.profile = data;
		})
		.error(function(data){
			alert("Error when getting profile.")
		});
}

function HomeCtrl($scope, $http, Sessions, Goals, Instruments) {
	$scope.pageSettings.pageTitle = "OSIRIS GUITAR Journal";
	$scope.pageSettings.active = "home";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = null;
	$scope.Sessions = Sessions;
	$scope.Goals = Goals;
	$scope.Instruments = Instruments;

	$scope.sessionsThisWeek = function() {
		var currentWeekday = new Date().getDay();
		return 2;
	}
}

function SessionsCtrl($scope, $http, $location, Sessions, Goals, Instruments) {
	$scope.Sessions = Sessions;
	$scope.Goals = Goals;
	$scope.Instruments = Instruments;
	$scope.pageSettings.pageTitle = "Sessions";
	$scope.pageSettings.active = "sessions";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = "New";
	$scope.pageSettings.rightButtonClick = function() {
		$location.path('/session/');
	};
}

function SessionCtrl($scope, $routeParams, $http, $location, Sessions, Goals, Instruments) {
	$scope.Goals = Goals;
	$scope.Instruments = Instruments;
	$scope.pageSettings.pageTitle = "Session";
	$scope.pageSettings.active = "sessions";
	$scope.pageSettings.showBackButton = true;
	$scope.pageSettings.rightButtonText = "Edit";
	$scope.editMode = false;

	// If id is provided, get session, from memory or DB.
	if ($routeParams.id != null && $routeParams.id != "")
	{
		Sessions.getSession($routeParams.id, 
			function(session) {
				$scope.session = session;
			},
			function(error) {
				alert("Couldn't get session");
			});
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
		Sessions.saveSession($scope.session, 
			function() {
				$location.path("/sessions/");
			},
			function() {
				alert("Error saving session");
			}
		);
	};

	$scope.delete = function() {
		Sessions.deleteSession($scope.session._id,
			function() {
				$location.path("/sessions/");
			},
			function(error) {
				alert("Could not delete the session.");
			}
		);
	};
}

function GoalsCtrl($scope, $http, $location, Goals) {
	$scope.Goals = Goals;
	$scope.pageSettings.pageTitle = "Goals";
	$scope.pageSettings.active = "goals";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = "New";
	$scope.pageSettings.rightButtonClick = function() {
		$location.path('/goal/');
	};
}

function GoalCtrl($scope, $routeParams, $http, $location, Goals) {
	$scope.pageSettings.pageTitle = "Goal";
	$scope.pageSettings.active = "goals";
	$scope.pageSettings.showBackButton = true;
	$scope.pageSettings.rightButtonText = "Edit";
	$scope.editMode = false;
	$scope.Goals = Goals;

	// If id is provided, get session, from memory or DB.
	if ($routeParams.id != null && $routeParams.id != "") {
		Goals.getGoal($routeParams.id, function(goal) {
			$scope.goal = goal;
		}, function() { alert("Couldn't get goal");});
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
		Goals.saveGoal($scope.goal, 
			function() {
				$location.path('/goals/');
			}, 
			function() {
				alert("Error saving goal");
			});
	}

	$scope.delete = function() {
		Goals.deleteGoal($scope.goal._id,
			function() {
				$location.path('/goals/');
			}, 
			function() {
				alert("Couldn't delete goal");
			});
	};
};

function StatsCtrl($scope, $http) {
	$scope.pageSettings.pageTitle = "Statistics";
	$scope.pageSettings.active = "stats";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = null;
}

function ProfileCtrl($scope, $http, $location, Instruments)
{
	$scope.Instruments = Instruments;
	$scope.pageSettings.pageTitle = "Profile";
	$scope.pageSettings.active = "profile";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = "New";
	$scope.pageSettings.rightButtonClick = function() {
		$location.path('/instrument/');
	};

};

function InstrumentCtrl($scope, $http, $location, $routeParams, Instruments)
{
	$scope.Instruments = Instruments;
	$scope.pageSettings.pageTitle = "Instrument";
	$scope.pageSettings.active = "profile";
	$scope.pageSettings.showBackButton = true;
	$scope.pageSettings.rightButtonText = "Edit";
	$scope.editMode = false;

	// If id is provided, get session, from memory or DB.
	if ($routeParams.id != null && $routeParams.id != "")
	{
		Instruments.getInstrument($routeParams.id,
			function(instrument) {
				$scope.instrument = instrument;
			},
			function() {
				alert("Could not load instrument");
			});
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
		Instruments.saveInstrument($scope.instrument,
			function() {
				$location.path("/profile/");
			},
			function() {
				alert("Could not save instrument");
			});
	}

	$scope.delete = function() {
		Instruments.deleteInstrument($scope.instrument._id,
			function() {
				$location.path("/profile/");
			},
			function() {
				alert("Could not delete instrument");
			});
	}
}
