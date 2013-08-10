GuitarJournalApp.factory('Statistics', function($http, $rootScope) {
	var service = {};

	service.getSessionsPerWeekday = function() {
		$rootScope.apiStatus.loading++;
		var url = '/api/statistics/perweekday';
		service.perWeekday = [];

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

						while (currentDataIndex < data.length - 1 && currentDataDate < currentDate) {
							currentDataIndex++;
							currentDataDate = new Date(data[currentDataIndex]._id.year, data[currentDataIndex]._id.month - 1, data[currentDataIndex]._id.day);
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

				$rootScope.apiStatus.loading--;
			})
			.error(function(data, status) {
				alert("Error when getting sessions");
				$rootScope.apiStatus.loading--;
			});							
	};

	service.getSessionsPerWeek = function (weeks) {
		$rootScope.apiStatus.loading++;
		var url = '/api/statistics/perweek/' + weeks;
		service.sessionsPerWeek = {};
		service.sessionsPerWeek.labels = [];
		service.sessionsPerWeek.count = [];
		service.sessionsPerWeek.minutes = [];

		$http.get(url)
			.success(function(data) {
				if (data && data.length && data.length > 0) {
					var currentDataIndex = 0;

					for (i = 0; i < weeks; i++) {
						var currentWeek = moment().subtract(moment.duration(weeks - i, 'weeks')).isoWeek();
						service.sessionsPerWeek.labels.push(currentWeek);

						while (currentDataIndex < data.length && data[currentDataIndex].week < currentWeek) {
							currentDataIndex++;
						}

						if (data[currentDataIndex].week == currentWeek) {
							service.sessionsPerWeek.count.push(data[currentDataIndex].count);
							service.sessionsPerWeek.minutes.push(data[currentDataIndex].minutes);

						}
						else {
							service.sessionsPerWeek.count.push(0);
							service.sessionsPerWeek.minutes.push(0);
						}
					}
				}
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