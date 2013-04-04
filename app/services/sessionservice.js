GuitarJournalApp.factory('Sessions', function($http) {
	var service = {};
	service.sessions = undefined;

	service.getSessions = function(loadMore) {
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
			})
			.error(function(data) {
				alert("Error when getting sessions.");
			});							
	}

	service.getSession = function(sessionId, successCallback, failureCallback) {
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

			// Not loaded into memory, get from DB.
			$http.get('/api/session/' + sessionId)
				.success(function(data) {
					if (successCallback)
						successCallback(data);
				})
				.error(function(data) {
					failureCallback(data);
				});
		}
	}

	service.saveSession = function(session, successCallback, failureCallback) {
		$http.post('/api/sessions', session)
			.success(function(data) {
				// 1 means updated, otherwise replace to get proper db id.
				service.getSessions();

				if (successCallback)
					successCallback();
			})
			.error(function(data) { 
				if (failureCallback)
					failureCallback();
			});
	}

	service.deleteSession = function(sessionId, successCallback, failureCallback) {
		$http.delete('/api/session/' + sessionId)
			.success(function(data){
				service.getSessions();
				if (successCallback)
					successCallback();
			})
			.error(function(error){
				if (failureCallback)
					failureCallback();
			});

	}

	service.getSessions();
	return service;
});