GuitarJournalApp.factory('Statistics', function($http, $rootScope, $q, $log) {
	var service = {};
	service.statsOverview = undefined;
	service.weekStats = undefined;
	service.sessionsPerWeek = undefined;
	service.minutesPerDay = undefined;
	service.perWeekday = undefined;

	service.getSessionsPerWeekday = function() {
		var deferred = $q.defer();

		if (!service.perWeekday) {
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
						deferred.resolve(service.perWeekday);
					}
				})
				.error(function(error, status) {
					$rootScope.apiStatus.loading--;
					deferred.reject(error);
				});
		} else {
			deferred.resolve(service.perWeekday);
		}

		return deferred.promise;
	};

	service.getMinutesPerDay = function(days) {
		var deferred = $q.defer();

		if (!service.minutesPerDay) {
			$rootScope.apiStatus.loading++;
			var url = '/api/statistics/minutesperday/' + days;
			service.minutesPerDay = {
				labels: [],
				data: []
			};

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

							if (i % 5 === 0)
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
					deferred.resolve(service.minutesPerDay);
				})
				.error(function(error, status) {
					$rootScope.apiStatus.loading--;
					deferred.reject(error);
				});
		} else {
			deferred.resolve(service.minutesPerDay);
		}

		return deferred.promise;					
	};

	service.getSessionsPerWeek = function (weeks) {
		var deferred = $q.defer();

		if (!service.sessionsPerWeek) {
			service.sessionsPerWeek = {
				labels: [],
				count: [],
				minutes: []
			};

			$rootScope.apiStatus.loading++;
			var url = '/api/statistics/perweek/' + weeks;

			var findWeekData = function(weekDataArray, year, week) {
				for (var i = 0; i < weekDataArray.length; i++) {
					if (weekDataArray[i].year == year && weekDataArray[i].week + 1 == week)
						return weekDataArray[i];
				}

				return null;
			};

			$http.get(url)
				.success(function(data) {
					if (data && data.length && data.length > 0) {
						var currentDataIndex = 0;

						for (var i = 0; i < weeks; i++) {
							var currentWeek = moment().subtract(moment.duration(weeks - i - 1, 'weeks')).isoWeek();
							var currentYear = moment().subtract(moment.duration(weeks - i - 1, 'weeks')).year();

							service.sessionsPerWeek.labels.push(currentWeek);

							var currentWeekData = findWeekData(data, currentYear, currentWeek);
							if (currentWeekData !== null) {
								service.sessionsPerWeek.count.push(currentWeekData.count);
								service.sessionsPerWeek.minutes.push(currentWeekData.minutes);

							}
							else {
								service.sessionsPerWeek.count.push(0);
								service.sessionsPerWeek.minutes.push(0);
							}
						}
					}
					$rootScope.apiStatus.loading--;
					deferred.resolve(service.sessionsPerWeek);
				})
				.error(function(error, status) {
					$rootScope.apiStatus.loading--;
					deferred.reject(error);
				});							
		}
		else {
			deferred.resolve(service.sessionsPerWeek);
		}

		return deferred.promise;
	};

	service.getStatsOverview = function () {
		var deferred = $q.defer();

		if (!service.statsOverview) {
			$rootScope.apiStatus.loading++;
			$http.get('/api/statistics/overview')
				.success(function(data) {
					service.statsOverview = data;
					var firstSession = new Date(service.statsOverview.firstSession);
					var lastSession = new Date(service.statsOverview.latestSession);
					var days = Math.round(lastSession.getTime() - firstSession.getTime())/86400000;
					var weeks = Math.max(days/7, 1);
					service.statsOverview.sessionsPerWeek = Math.round(service.statsOverview.totalSessions / weeks * 100)/100;
					$rootScope.apiStatus.loading--;
					deferred.resolve(service.statsOverview);
				})
				.error(function(error) {
					$rootScope.apiStatus.loading--;
					deferred.reject(error);
				});
		}
		else {
			deferred.resolve(service.statsOverview);
		}

		return deferred.promise;
	};

	service.getWeekStats = function () {
		var deferred = $q.defer();

		if (!service.weekStats) {
			$rootScope.apiStatus.loading++;
			$http.get('/api/statistics/overview/7')
				.success(function(data) {
					service.weekStats = data;
					var firstSession = new Date(service.weekStats.firstSession);
					var lastSession = new Date(service.weekStats.latestSession);
					var days = Math.round(lastSession.getTime() - firstSession.getTime())/86400000;
					var weeks = days/7;
					service.weekStats.sessionsPerWeek = Math.round(service.weekStats.totalSessions / weeks * 100)/100;
					$rootScope.apiStatus.loading--;
					deferred.resolve(service.weekStats);
				})
				.error(function(error) {
					$rootScope.apiStatus.loading++;
					deferred.reject(error);
				});
		}
		else
		{
			deferred.resolve(service.weekStats);
		}

		return deferred.promise;
	};

	service.flushStats = function() {
		service.statsOverview = undefined;
		service.weekStats = undefined;
		service.sessionsPerWeek = undefined;
		service.minutesPerDay = undefined;
		service.perWeekday = undefined;
	};

	return service;
});