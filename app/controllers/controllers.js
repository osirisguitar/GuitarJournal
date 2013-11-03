function AppCtrl($scope, $http, $location, Sessions, $rootScope, growl, $log) {
	$scope.pageSettings = {};
	$rootScope.apiStatus = {};
	$rootScope.apiStatus.loading = 0;
	$scope.apiStatus = $rootScope.apiStatus;
	$scope.allowSimpleLogin = false;
	$scope.defaultPageSettings = {
		pageTitle: "",
		active: null,
		showBackButton: false,
		rightButtonText: null,
		hideNavigation: false,
		hideTopNavigation: false
	};

	$scope.showErrorMessage = function(message, error) {
		growl.showErrorMessage(message);
		$log.error(message, error); 
	};

	$scope.showSuccessMessage = function(message) {
		growl.showErrorMessage(message, { ttl: 4000 });
		$log.info(message, error); 		
	};

	$scope.setDefaultPageSettings = function() {
		for (var prop in $scope.defaultPageSettings) {
			if ($scope.defaultPageSettings.hasOwnProperty(prop)) {
				$scope.pageSettings[prop] = $scope.defaultPageSettings[prop];				
			}
		}
	};

	$http.get('auth/allowsimple').success(function(data) {
		if (data == "true")
			$scope.allowSimpleLogin = true;
	});

	$http.get('/api/loggedin').success(function(data) {
		$rootScope.apiStatus.loading++;
		$rootScope.csrf = data._csrf;
		$rootScope.httpConfig = {
			headers: { "X-CSRF-Token": $rootScope.csrf }
		};
		if (data._id) {
			$rootScope.loggedIn = true;
			$rootScope.fbAccessToken = data.fbAccessToken;
			$rootScope.apiStatus.loading--;
		}
		else {
			$rootScope.apiStatus.loading--;
			$location.path("/login");
		}
	}).error(function(error) {
		$scope.showErrorMessage("Error when logging in", error);
	});

	$rootScope.$watch('loggedIn', function () {
		if ($rootScope.loggedIn) {
			$http.get('/api/profile')
				.success(function(data) {
					$scope.profile = data;
				})
				.error(function(error){
					$scope.showErrorMessage("Error when getting profile", error);
				});			
		}
	});

	$scope.Sessions = Sessions;
	$rootScope.sessionsReload = true;

	$scope.$watch('Sessions.sessions', function () {
		if ($rootScope.loggedIn) {
			$rootScope.sessionsReload = true;
		}
	}, true);

}

function LoginCtrl($scope, $http, $location, $cookies, $cookieStore, $rootScope) {
	$scope.setDefaultPageSettings();
	$scope.pageSettings.hideNavigation = true;
	$scope.pageSettings.hideTopNavigation = true;
	$scope.login = function() {
		$http.post("/api/login", {email: $scope.email, password: $scope.password}, $rootScope.httpConfig).success(function(data) {
			if (data._id) {
				$rootScope.loggedIn = true;
				$scope.pageSettings.hideNavigation = false;
			}
			$location.path("/");
		}).error(function(error) { $scope.showErrorMessage("Could not log in", error); });
	};
}

function HomeCtrl($scope, $http, $location, $rootScope, Sessions, Goals, Instruments, Statistics) {
	$scope.setDefaultPageSettings();
	$scope.pageSettings.pageTitle = "OSIRIS GUITAR Journal";
	$scope.pageSettings.active = "home";

	$scope.Sessions = Sessions;
	$scope.Goals = Goals;
	$scope.Instruments = Instruments;
	$scope.Statistics = Statistics;
	$scope.statsOverview = Statistics.statsOverview;
	Statistics.getStatsOverview();
	Statistics.getWeekStats();

	$scope.sessionsThisWeek = function() {
		var currentWeekday = new Date().getDay();
		return 2;
	};
}

function SessionsCtrl($scope, $http, $location, Sessions, Goals, Instruments) {
	$scope.setDefaultPageSettings();
	$scope.pageSettings.pageTitle = "Sessions";
	$scope.pageSettings.active = "sessions";
	$scope.pageSettings.rightButtonText = "New";
	$scope.pageSettings.rightButtonClick = function() {
		$location.path('/session/');
	};

	$scope.Sessions = Sessions;
	$scope.Goals = Goals;
	$scope.Instruments = Instruments;
}

function SessionCtrl($scope, $rootScope, $routeParams, $http, $location, $log, Sessions, Goals, Instruments, Statistics, growl) {
	$scope.setDefaultPageSettings();
	$scope.pageSettings.pageTitle = "Session";
	$scope.pageSettings.active = "sessions";
	$scope.pageSettings.showBackButton = true;
	$scope.pageSettings.rightButtonText = "Edit";

	$scope.Goals = Goals;
	$scope.Instruments = Instruments;
	$scope.editMode = false;

	// If id is provided, get session, from memory or DB.
	if ($routeParams.id !== null && $routeParams.id !== "")
	{
		Sessions.getSession($routeParams.id, 
			function(session) {
				$scope.session = session;
			},
			function(error) {
				$scope.showErrorMessage("Couldn't get session", error);
			});
	}
	else
	{
		$scope.session = { date: new Date() };
		$scope.editMode = true;
	}

	$scope.pageSettings.rightButtonClick = function() {
		$scope.editMode = !$scope.editMode;
	};

	$scope.$watch("editMode", function() {
		$scope.pageSettings.hideNavigation = $scope.editMode;
		if ($scope.editMode) {
			$scope.pageSettings.hideNavigation = true;
			$scope.pageSettings.rightButtonText = "Cancel";
			$scope.pageSettings.showBackButton = false;			
		} 
		else {
			$scope.pageSettings.hideNavigation = false;
			$scope.pageSettings.rightButtonText = "Edit";
			$scope.pageSettings.showBackButton = true;						
		}
	});

	$scope.save = function()
	{
		Sessions.saveSession($scope.session, 
			function() {
				$location.path("/sessions/");
				Statistics.flushStats();
				growl.addSuccessMessage('Session saved', { ttl:3000 });
				$scope.editMode = false;
			},
			function() {
				$scope.showErrorMessage("Error saving session");
			}
		);


	};

	$scope.delete = function() {
		Sessions.deleteSession($scope.session._id,
			function() {
				$location.path("/sessions/");
			},
			function(error) {
				$scope.showErrorMessage("Could not delete the session.", error);
			}
		);
	};

	$scope.shareToFacebook = function() {
		var url = "https://graph.facebook.com/me/ogjournal:complete?access_token=" + $rootScope.fbAccessToken + 
			"&practice_session=http://journal.osirisguitar.com/api/practicesession/" + $scope.session._id +
			"&fb_explicitly_shared=true";
		$http.post(url, {}, $rootScope.httpConfig)
			.success(function(response) {
				growl.showSuccessMessage("Session shared to Facebook");
			})
			.error(function(error) {
				growl.showErrorMessage("An error occured when sharing to Facebook", error);
			});
	};
}

function GoalsCtrl($scope, $http, $location, Goals) {
	$scope.setDefaultPageSettings();
	$scope.pageSettings.pageTitle = "Goals";
	$scope.pageSettings.active = "goals";
	$scope.pageSettings.rightButtonText = "New";
	$scope.pageSettings.rightButtonClick = function() {
		$location.path('/goal/');
	};

	$scope.Goals = Goals;
}

function GoalCtrl($scope, $routeParams, $http, $location, Goals) {
	$scope.setDefaultPageSettings();
	$scope.pageSettings.pageTitle = "Goal";
	$scope.pageSettings.active = "goals";
	$scope.pageSettings.showBackButton = true;
	$scope.pageSettings.rightButtonText = "Edit";
	$scope.editMode = false;
	$scope.Goals = Goals;

	// If id is provided, get session, from memory or DB.
	if ($routeParams.id !== null && $routeParams.id !== "") {
		Goals.getGoal($routeParams.id, function(goal) {
			$scope.goal = goal;
		}, function() { $scope.showErrorMessage("Couldn't get goal");});
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
	};

	$scope.save = function()
	{
		Goals.saveGoal($scope.goal, 
			function() {
				$location.path('/goals/');
			}, 
			function() {
				$scope.showErrorMessage("Error saving goal");
			});
	};

	$scope.delete = function() {
		Goals.deleteGoal($scope.goal._id,
			function() {
				$location.path('/goals/');
			}, 
			function() {
				$scope.showErrorMessage("Couldn't delete goal");
			});
	};
}

function StatsCtrl($scope, $http, Statistics, Goals, Instruments) {
	$scope.Goals = Goals;	
	$scope.Statistics = Statistics;
	$scope.Instruments = Instruments;
	$scope.setDefaultPageSettings();
	$scope.pageSettings.pageTitle = "Statistics";
	$scope.pageSettings.active = "stats";
	Statistics.getStatsOverview();
	Statistics.getWeekStats();

	Statistics.getMinutesPerDay(30).then(
		function(minutesPerDay) {
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
		},
		function(error) {
			$scope.showErrorMessage("Could not get minutes per day", error);			
		}
	);

	Statistics.getSessionsPerWeek(10).then(
		function(sessionsPerWeek) {
			$scope.sessionsPerWeek = {
				labels: sessionsPerWeek.labels,
				datasets: [{
		            fillColor : "#BD934F",
		            strokeColor : "#f1c40f",
		            pointColor : "#BD934F",
		            pointStrokeColor : "#f1c40f",
		            data : sessionsPerWeek.count		
				}]
			};

			$scope.minutesPerWeek = {
				labels: sessionsPerWeek.labels,
				datasets: [{
		            fillColor : "#BD934F",
		            strokeColor : "#f1c40f",
		            pointColor : "#BD934F",
		            pointStrokeColor : "#f1c40f",
		            data : sessionsPerWeek.minutes	
				}]
			};			
		},
		function(error) {
			$scope.showErrorMessage("Could not get sessions per week", error);
		}
	);

	$scope.weekdayColors = [ "#bb0000", "#bbbb00", "#00bb00", "#00bbbb", "#0000bb", "#bb00bb", "#000000"];

	Statistics.getSessionsPerWeekday().then(
		function(perWeekday) {
			$scope.perWeekday = [];
			for (i = 1; i <= 7; i++) {
				$scope.perWeekday.push({ value: perWeekday[i % 7], color: $scope.weekdayColors[i % 7] });
			}
		},
		function(error) {
			$scope.showErrorMessage("Could not get weekday statistics", error);
		}
	);

	$scope.Math = Math;
}

function ProfileCtrl($scope, $rootScope, $http, $location, Instruments)
{
	$scope.Instruments = Instruments;
	$scope.pageSettings.pageTitle = "Profile";
	$scope.pageSettings.active = "profile";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = null;
	$scope.pageSettings.hideNavigation = false;

	$scope.logout = function() {
		fbLogout();

		$http.post('/api/logout', {}, $rootScope.httpConfig)
			.success(function() {
				$location.path("/login");
			})
			.error(function() {
				$location.path("/login");
			});
	};
}

function InstrumentCtrl($scope, $http, $location, $routeParams, Instruments, $rootScope)
{
	$scope.Instruments = Instruments;
	$scope.pageSettings.pageTitle = "Instrument";
	$scope.pageSettings.active = "profile";
	$scope.pageSettings.showBackButton = true;
	$scope.pageSettings.rightButtonText = "Edit";
	$scope.pageSettings.hideNavigation = false;
	$scope.editMode = false;
	$scope._csrf = $rootScope.csrf;

	// If id is provided, get session, from memory or DB.
	if ($routeParams.id !== null && $routeParams.id !== "")
	{
		Instruments.getInstrument($routeParams.id,
			function(instrument) {
				$scope.instrument = instrument;
			},
			function() {
				$scope.showErrorMessage("Could not load instrument");
			});
	}
	else
	{
		$scope.instrument = {};
		$scope.editMode = true;
		$scope.pageSettings.hideNavigation = true;
	}

	$scope.pageSettings.rightButtonClick = function() {
		$scope.editMode = !$scope.editMode;
		$scope.pageSettings.hideNavigation = $scope.editMode;
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
	};

	$scope.save = function() {
		Instruments.saveInstrument($scope.instrument,
			function() {
				$location.path("/profile/");
			},
			function() {
				$scope.showErrorMessage("Could not save instrument");
			});
	};

	$scope.delete = function() {
		Instruments.deleteInstrument($scope.instrument._id,
			function() {
				$location.path("/profile/");
			},
			function() {
				$scope.showErrorMessage("Could not delete instrument");
			});
	};
}
