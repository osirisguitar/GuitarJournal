GuitarJournalApp.factory('Statistics', function($http, $rootScope) {
	var service = {};
	service.perWeekday = undefined;

	service.getSessionsPerWeekday = function() {
		$rootScope.apiStatus.loading++;
		var url = '/api/statistics/perweekday';
		service.perWeekday = [];
		console.log(service.perWeekday);

		$http.get(url)
			.success(function(data) {
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