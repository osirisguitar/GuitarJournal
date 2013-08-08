GuitarJournalApp.factory('Statistics', function($http, $rootScope) {
	var service = {};

	service.getSessionsPerWeekday = function() {
		$rootScope.apiStatus.loading++;
		var url = '/api/statistics/perweekday';
		service.perWeekday = [];
		console.log(service.perWeekday);

		$http.get(url)
			.success(function(data) {
				if (data) {
					var dataWeekday = 0;
	
					for (currentWeekday = 0; currentWeekday < 7; currentWeekday++) {
						var sessionCount = 0;
	
						while (dataWeekday < data.length && data[dataWeekday].weekDay < currentWeekday) {
							dataWeekday++;
						}
	
						if (dataWeekday < data.length && data[dataWeekday].weekDay == currentWeekday)
							service.perWeekday.push(data[dataWeekday].sessionCount);
						else
							service.perWeekday.push(0);
					}
					console.log(service.perWeekday);
					$rootScope.apiStatus.loading--;
				}
			})
			.error(function(data, status) {
				alert("Error when getting sessions");
				$rootScope.apiStatus.loading--;
			});			
	};

	service.getMinutesPerDay = function(days) {
		$rootScope.apiStatus.loading++;
		var url = '/api/statistics/minutesperday/' + days;
		service.minutesPerDay = {};
		service.minutesPerDay.labels = [];
		service.minutesPerDay.data = [];

		$http.get(url)
			.success(function(data) {
				if (data && data.length && data.length > 0) {
					var start = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0);
					var currentDataIndex = 0;
					var currentDataDate = null;
					currentDataDate = new Date(data[currentDataIndex]._id.year, data[currentDataIndex]._id.month - 1, data[currentDataIndex]._id.day);

					for (i = 29; i >= 0; i--) {
						var currentDate = new Date(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0).setDate(new Date().getDate() - i));

						console.log("Checking", currentDate, "against", currentDataDate, "comparison", currentDate - currentDataDate === 0);
						while (currentDataIndex < data.length && currentDataDate < currentDate) {
							currentDataIndex++;
							currentDataDate = new Date(data[currentDataIndex]._id.year, data[currentDataIndex]._id.month - 1, data[currentDataIndex]._id.day);
							console.log("Checking", currentDate, "against", currentDataDate, "comparison", currentDate - currentDataDate === 0);
						}

						if (i % 5 == 0)
							service.minutesPerDay.labels.push(moment(currentDate).format('MM-DD'));
						else
							service.minutesPerDay.labels.push("");
							

						if (currentDataIndex < data.length && currentDate - currentDataDate === 0)
							service.minutesPerDay.data.push(data[currentDataIndex].totalMinutes);
						else
							service.minutesPerDay.data.push(0);
					}						
				}

				console.log(service.minutesPerDay);
				$rootScope.apiStatus.loading--;
			})
			.error(function(data, status) {
				alert("Error when getting sessions");
				$rootScope.apiStatus.loading--;
			});							
	};

/*	$rootScope.$watch('loggedIn', function() {
		if ($rootScope.loggedIn) {
		}
	})*/

	return service;
});