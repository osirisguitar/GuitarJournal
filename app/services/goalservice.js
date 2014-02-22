GuitarJournalApp.factory('Goals', function($http, $rootScope, Statistics) {
	var service = {};

	service.goals = undefined;

	service.getGoals = function() {
		$rootScope.apiStatus.loading++;
		$http.get('/api/goals')
			.success(function(data) {
				service.goals = data;
				$rootScope.apiStatus.loading--;
			})
			.error(function(data) {
				$rootScope.showErrorMessage("Error when getting sessions.");
				$rootScope.apiStatus.loading--;
			});							
	}

	service.getGoal = function(goalId, successCallback, failureCallback) {
		if (service.goals) {
			// First try to find session in the loaded array
			for (i = 0; i < service.goals.length; i++)
			{
				if (service.goals[i]._id == goalId)
				{
					if (successCallback) {
						successCallback(service.goals[i]);
					}
					return;
				}
			}

			// Not loaded into memory, get from DB.
			$rootScope.apiStatus.loading++;
			$http.get('/api/goal/' + goalId)
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

	service.getGoalTitle = function(goalId) {
		if (service.goals) {
			var title = null;
			service.goals.some(function (goal) {
				if (goal._id == goalId) {
					title = goal.title;
					return true;
				}
			});

			return title;
		}
	}

	service.saveGoal = function(goal, successCallback, failureCallback) {
		$rootScope.apiStatus.loading++;
		$http.post('/api/goals', goal, $rootScope.httpConfig)
			.success(function(data) {
				// 1 means updated, otherwise replace to get proper db id.
				service.getGoals();
				$rootScope.apiStatus.loading--;

				Statistics.flushStats();

				if (successCallback)
					successCallback();
			})
			.error(function(data) { 
				$rootScope.apiStatus.loading--;
				if (failureCallback)
					failureCallback();
			});
	}

	service.deleteGoal = function(goalId, successCallback, failureCallback) {
		$rootScope.apiStatus.loading++;
		$http.delete('/api/goal/' + goalId, $rootScope.httpConfig)
			.success(function(data){
				service.getGoals();
				$rootScope.apiStatus.loading--;

				Statistics.flushStats();

				if (successCallback)
					successCallback();
			})
			.error(function(error){
				$rootScope.apiStatus.loading--;

				if (failureCallback)
					failureCallback();
			});

	}

	service.getActiveGoals = function() {
		if (service.goals) {
			var activeGoals = [];
			service.goals.forEach(function (goal){
				if (!goal.completed)
					activeGoals.push(goal);
			});
			return activeGoals;
		}
		else 
			return [];
	}

	$rootScope.$watch('loggedIn', function() {
		if ($rootScope.loggedIn) {
			service.getGoals();
		}
	});

	return service;
});