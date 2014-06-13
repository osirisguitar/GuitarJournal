function AppCtrl($scope, $http, $location, Sessions, $rootScope, growl, $log, $window, $timeout) {
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

	$scope.iOS = $window.navigator.userAgent.match(/iPhone/i) || $window.navigator.userAgent.match(/iPad/i);

	$rootScope.showErrorMessage = function(message, error) {
		growl.addErrorMessage(message);
		$log.error(message, error); 
	};

	$rootScope.showSuccessMessage = function(message) {
		growl.addSuccessMessage(message, { ttl: 2000 });
		$log.info(message); 	
	};

	$scope.setDefaultPageSettings = function() {
		for (var prop in $scope.defaultPageSettings) {
			if ($scope.defaultPageSettings.hasOwnProperty(prop)) {
				$scope.pageSettings[prop] = $scope.defaultPageSettings[prop];				
			}
		}
	};

	var showSpinnerInterval = null;
	$scope.showSpinner = false;
	var spinnerDelay = 0;
	$scope.$watch("apiStatus.loading", function () {
		if ($scope.apiStatus.loading === 0) {
			$scope.apiStatus.showSpinner = false;

			if (showSpinnerInterval) {
				clearInterval(showSpinnerInterval);
				showSpinnerInterval = null;
			}
		} else {
			if (showSpinnerInterval === null) {
				showSpinnerInterval = setInterval(function () {
					$scope.apiStatus.showSpinner = true;
					spinnerDelay = 500;
				}, spinnerDelay);
			}			
		}
	});

	$http.get('auth/allowsimple').success(function(data) {
		if (data == "true")
			$scope.allowSimpleLogin = true;
	});

	$http.get('/api/loggedin').success(function(data) {
		$timeout(function() {
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
				if (data.autoTryFacebook) {
					$window.location.href = "/auth/facebook";
				}
				else {
					$location.path("/login");
				}
			}

		}, 3000);
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
		$http.get("/api/login", $rootScope.httpConfig).success(function(data) {
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
}

function SessionsCtrl($scope, $http, $location, Sessions, Goals, Instruments, $window) {
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

function SessionCtrl($scope, $rootScope, $routeParams, $http, $location, $log, Sessions, Goals, Instruments, Statistics) {
	$scope.setDefaultPageSettings();
	$scope.pageSettings.pageTitle = "Session";
	$scope.pageSettings.active = "sessions";
	$scope.pageSettings.showBackButton = true;
	$scope.pageSettings.rightButtonText = "Edit";

	$scope.Goals = Goals;
	$scope.Instruments = Instruments;
	$scope.editMode = false;

	// If id is provided, get session, from memory or DB.
	if ($routeParams.id) {
		Sessions.getSession($routeParams.id, 
			function(session) {
				console.log("Session: ", session);
				$scope.session = session;
				$scope.session.date = new Date(Date.parse($scope.session.date)).toISOString().substring(0, 10);
			},
			function(error) {
				$scope.showErrorMessage("Couldn't get session", error);
			});
	} else {
		$scope.session = { date: new Date().toISOString().substring(0, 10) };
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

	$scope.save = function() {
		$scope.session.date = moment($scope.session.date).toDate();

		Sessions.saveSession($scope.session, 
			function(savedSession) {
				//$location.path("/session/" + savedSession._id);
				Statistics.flushStats();
				$scope.showSuccessMessage('Session saved');
				$scope.editMode = false;
				$scope.session = savedSession;
			},
			function() {
				$scope.showErrorMessage("Error saving session");
			}
		);
	};

	$scope.delete = function() {
		if (confirm("Are you sure?")) {
			Sessions.deleteSession($scope.session._id,
				function() {
					$location.path("/sessions/");
				},
				function(error) {
					$scope.showErrorMessage("Could not delete the session.", error);
				}
			);
		}
	};

	$scope.shareToFacebook = function() {
		var url = "https://graph.facebook.com/me/ogjournal:complete?access_token=" + $rootScope.fbAccessToken + 
			"&practice_session=http://journal.osirisguitar.com/api/practicesession/" + $scope.session._id +
			"&fb:explicitly_shared=true";
		$rootScope.apiStatus.loading++;
		$http.post(url, {}, $rootScope.httpConfig)
			.success(function(response) {
				$rootScope.apiStatus.loading--;
				$scope.showSuccessMessage("Session shared to Facebook");
			})
			.error(function(error) {
				$rootScope.apiStatus.loading--;
				$scope.showErrorMessage("An error occured when sharing to Facebook: " + error.error.message, error);
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
	if ($routeParams.id) {
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
		if (confirm('Are you sure?')) {
			Goals.deleteGoal($scope.goal._id,
				function() {
					$location.path('/goals/');
				}, 
				function() {
					$scope.showErrorMessage("Couldn't delete goal");
				});			
		}
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

function ProfileCtrl($scope, $rootScope, $http, $location, Instruments, $window)
{
	$scope.Instruments = Instruments;
	$scope.pageSettings.pageTitle = "Profile";
	$scope.pageSettings.active = "profile";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = null;
	$scope.pageSettings.hideNavigation = false;

	$scope.logout = function() {
		var url = "https://www.facebook.com/logout.php?access_token=" + $rootScope.fbAccessToken +
			"&confirm=1&next=http://" + $window.location.hostname + "/api/logout";
		$window.location.href = url;
	};
}

function InstrumentCtrl($scope, $http, $location, $routeParams, Instruments, $rootScope, $timeout)
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
	if ($routeParams.id)
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
		$scope.imageChanged = true;
		var file = imageField.files[0];
		var destinationSize = 200;

		var reader = new FileReader();
		reader.onload = (function(selectedFile) {
		    return function(e) {
		    	var dataUrl = e.target.result;
		    	var sourceImage = new Image();
		    	sourceImage.onload = function() {
		    		var canvas = document.createElement("canvas");
		    		canvas.width = destinationSize;
		    		canvas.height = destinationSize;
		    		var context = canvas.getContext("2d");

		 			var smallestBound = Math.min(sourceImage.naturalWidth, sourceImage.naturalHeight);

		    		var sourceWidth = smallestBound;
		    		var sourceHeight = smallestBound;
		    		var sourceX = Math.round((sourceImage.naturalWidth - smallestBound)/2);
		    		var sourceY = Math.round((sourceImage.naturalHeight - smallestBound)/2);
		    		var destWidth = destinationSize;
		    		var destHeight = destinationSize;
		    		var destX = 0;
		    		var destY = 0;
		    		drawImageIOSFix(context, sourceImage, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
		    		var resultData = canvas.toDataURL("image/jpeg", 0.9);
		    		$scope.instrument.image = resultData.split(',')[1];
		    	};
		    	sourceImage.src = dataUrl;
		    };
		})(file);
		reader.readAsDataURL(file);
		$scope.imageChanged = true;
		$scope.$apply();
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
		if (confirm('Are you sure?')) {
		Instruments.deleteInstrument($scope.instrument._id,
			function() {
				$location.path("/profile/");
			},
			function() {
				$scope.showErrorMessage("Could not delete instrument");
			});			
		}
	};
}
