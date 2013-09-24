GuitarJournalApp.factory('Sessions', function($http, $rootScope) {
	var service = {};
	service.sessions = undefined;

	service.getSessions = function(loadMore) {
		$rootScope.apiStatus.loading++;
		var url = '/api/sessions';
		if (!loadMore) {
			service.sessions = [];
		}
		else {
			url += '/' + service.sessions.length;
		}

		$http.get(url)
			.success(function(data) {
				service.sessions = service.sessions.concat(data);
				$rootScope.apiStatus.loading--;
			})
			.error(function(data, status) {
				alert("Error when getting sessions");
				$rootScope.apiStatus.loading--;
			});							
	}

	service.getSession = function(sessionId, successCallback, failureCallback) {
		console.log("Getting session");
		if (service.sessions) {
			// First, try to find session in the loaded array
			for (i = 0; i < service.sessions.length; i++)
			{
				if (service.sessions[i]._id == sessionId)
				{
					if (successCallback) {
						successCallback(service.sessions[i]);
					}
					return;
				}
			}
		}
		else
		{
			// Not loaded into memory, get from DB.
			$rootScope.apiStatus.loading++;
			$http.get('/api/session/' + sessionId)
				.success(function(data) {
					$rootScope.apiStatus.loading--;
					if (successCallback)
						successCallback(data);
				})
				.error(function(data) {
					$rootScope.apiStatus.loading--;
					failureCallback(data);
				});
		}
	}

	service.saveSession = function(session, successCallback, failureCallback) {
		$rootScope.apiStatus.loading++;
		$http.post('/api/sessions', session, $rootScope.httpConfig)
			.success(function(data) {
				// 1 means updated, otherwise replace to get proper db id.
				service.getSessions();
				$rootScope.apiStatus.loading--;

				if (successCallback)
					successCallback();
			})
			.error(function(data) { 
				$rootScope.apiStatus.loading--;

				if (failureCallback)
					failureCallback();
			});
	}

	service.deleteSession = function(sessionId, successCallback, failureCallback) {
		$rootScope.apiStatus.loading++;

		$http.delete('/api/session/' + sessionId, $rootScope.httpConfig)
			.success(function(data){
				service.getSessions();
				$rootScope.apiStatus.loading--;

				if (successCallback)
					successCallback();
			})
			.error(function(error){
				$rootScope.apiStatus.loading--;

				if (failureCallback)
					failureCallback();
			});

	}

	$rootScope.$watch('loggedIn', function() {
		if ($rootScope.loggedIn) {
			service.getSessions();
		}
	})
	return service;
});