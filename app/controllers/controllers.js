function AppCtrl($scope, $http, $location, Sessions, $rootScope) {
	$scope.pageSettings = {};
	$rootScope.apiStatus = {};
	$rootScope.apiStatus.loading = 0;
	$scope.apiStatus = $rootScope.apiStatus;

	$http.get('/api/loggedin').success(function(data) {
		$rootScope.apiStatus.loading++;
		$rootScope.csrf = data._csrf;
		$rootScope.httpConfig = {
			headers: { "X-CSRF-Token": $rootScope.csrf }
		};
		if (data._id) {
			$rootScope.loggedIn = true;
			$rootScope.apiStatus.loading--;
		}
		else {
			$rootScope.apiStatus.loading--;
			$location.path("/login");
		}
	}).error(function(data) { console.log("Couldn't check logged in status"); });

	$rootScope.$watch('loggedIn', function () {
		if ($rootScope.loggedIn) {
			$http.get('/api/profile')
				.success(function(data) {
					$scope.profile = data;
				})
				.error(function(data){
					alert("Error when getting profile.")
				});			
		}
	});

	$scope.Sessions = Sessions;

	$scope.$watch('Sessions.sessions', function () {
		if ($rootScope.loggedIn) {
			$rootScope.apiStatus.loading++;
			$http.get('/api/statistics/overview')
				.success(function(data) {
					$scope.statsOverview = data;
					var firstSession = new Date($scope.statsOverview.firstSession);
					var lastSession = new Date($scope.statsOverview.latestSession);
					var days = Math.round(lastSession.getTime() - firstSession.getTime())/86400000;
					var weeks = Math.max(days/7, 1);
					$scope.statsOverview.sessionsPerWeek = Math.round($scope.statsOverview.totalSessions / weeks * 100)/100;
					$rootScope.apiStatus.loading--;
				})
				.error(function(data) {
					$rootScope.apiStatus.loading--;
					alert("Error when getting statistics overview.");
				});

				$rootScope.apiStatus.loading++;
				$http.get('/api/statistics/overview/7')
				.success(function(data) {
					$scope.weekStats = data;
					var firstSession = new Date($scope.weekStats.firstSession);
					var lastSession = new Date($scope.weekStats.latestSession);
					var days = Math.round(lastSession.getTime() - firstSession.getTime())/86400000;
					var weeks = days/7;
					$scope.weekStats.sessionsPerWeek = Math.round($scope.weekStats.totalSessions / weeks * 100)/100;
					$rootScope.apiStatus.loading--;
				})
				.error(function(data) {
					$rootScope.apiStatus.loading++;
					alert("Error when getting statistics overview.");
				});		
			
		}
	}, true);
}

function LoginCtrl($scope, $http, $location, $cookies, $cookieStore, $rootScope) {
	$scope.pageSettings.hideNavigation = true;
	$scope.login = function() {
			$http.post("/api/login", {email: $scope.email, password: $scope.password}, $rootScope.httpConfig).success(function(data) {
				if (data._id)
					$rootScope.loggedIn = true;
				$location.path("/");
			}).error(function(data) { console.log("Could not log in") });
	};
}

function HomeCtrl($scope, $http, $location, $rootScope, Sessions, Goals, Instruments) {
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
		console.log("Getting session", $routeParams.id);
		Sessions.getSession($routeParams.id, 
			function(session) {
				console.log("Got session", session);
				$scope.session = session;
			},
			function(error) {
				alert("Couldn't get session");
			});
	}
	else
	{
		console.log("New session...")
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

function StatsCtrl($scope, $http, Statistics, Goals, Instruments) {
	$scope.Goals = Goals;	
	$scope.Statistics = Statistics;
	$scope.Instruments = Instruments;
	Statistics.getSessionsPerWeekday();
	Statistics.getMinutesPerDay(30);
	Statistics.getSessionsPerWeek(10);
	$scope.pageSettings.pageTitle = "Statistics";
	$scope.pageSettings.active = "stats";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = null;

	$scope.$watch("Statistics.minutesPerDay", function() {
		$scope.last30days = {
			labels: Statistics.minutesPerDay.labels,
			datasets: [ {
	            fillColor : "#BD934F",
	            strokeColor : "#f1c40f",
	            pointColor : "#BD934F",
	            pointStrokeColor : "#f1c40f",
	            data : Statistics.minutesPerDay.data
			} ]
		};
	});

	$scope.weekdayColors = [ "#bb0000", "#bbbb00", "#00bb00", "#00bbbb", "#0000bb", "#bb00bb", "#000000"];

	$scope.$watch("Statistics.perWeekday", function() {
		$scope.perWeekday = [];
		for (i = 1; i <= 7; i++) {
			$scope.perWeekday.push({ value: Statistics.perWeekday[i % 7], color: $scope.weekdayColors[i % 7] });
		}
	}, true);

	$scope.$watch("Statistics.sessionsPerWeek", function() {
		$scope.sessionsPerWeek = {
			labels: Statistics.sessionsPerWeek.labels,
			datasets: [{
	            fillColor : "#BD934F",
	            strokeColor : "#f1c40f",
	            pointColor : "#BD934F",
	            pointStrokeColor : "#f1c40f",
	            data : Statistics.sessionsPerWeek.count		
			}]
		};

		$scope.minutesPerWeek = {
			labels: Statistics.sessionsPerWeek.labels,
			datasets: [{
	            fillColor : "#BD934F",
	            strokeColor : "#f1c40f",
	            pointColor : "#BD934F",
	            pointStrokeColor : "#f1c40f",
	            data : Statistics.sessionsPerWeek.minutes	
			}]
		};
	}, true);

	$scope.Math = Math;
}

function ProfileCtrl($scope, $rootScope, $http, $location, Instruments)
{
	$scope.Instruments = Instruments;
	$scope.pageSettings.pageTitle = "Profile";
	$scope.pageSettings.active = "profile";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = "New instrument";
	$scope.pageSettings.rightButtonClick = function() {
		$location.path('/instrument/');
	};

	$scope.logout = function() {
		fbLogout();

		$http.post('/api/logout', {}, $rootScope.httpConfig)
			.success(function() {
				$location.path("/login");
			})
			.error(function() {
				$location.path("/login");
			});
	}
};

function InstrumentCtrl($scope, $http, $location, $routeParams, Instruments, $rootScope)
{
	$scope.Instruments = Instruments;
	$scope.pageSettings.pageTitle = "Instrument";
	$scope.pageSettings.active = "profile";
	$scope.pageSettings.showBackButton = true;
	$scope.pageSettings.rightButtonText = "Edit";
	$scope.editMode = false;
	$scope._csrf = $rootScope.csrf;

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

	$scope.setImage = function(imageField) {
		$scope.files = imageField.files;
		var file = $scope.files[0];

		var reader = new FileReader();
		reader.onload = (function(selectedFile) {
		    return function(e) {
		      $scope.instrument.image = e.target.result.split(',')[1];
		    };

		})(file);
		reader.readAsDataURL(file);
	}

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
