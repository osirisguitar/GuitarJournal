GuitarJournalApp.factory('Goals', function($http) {
	var service = {};

	service.goals = undefined;

	service.getGoals = function() {
		$http.get('/api/goals')
			.success(function(data) {
				service.goals = data;
			})
			.error(function(data) {
				alert("Error when getting sessions.");
			});							
	}

	service.getGoal = function(goalId, successCallback, failureCallback) {
		if (service.goals) {
			// First, try to find session in the loaded array
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
			$http.get('/api/goal/' + goalId)
				.success(function(data) {
					if (successCallback)
						successCallback(data);
				})
				.error(function(data) {
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
				}
			});

			return title;
		}
	}

	service.saveGoal = function(goal, successCallback, failureCallback) {
		$http.post('/api/goals', goal)
			.success(function(data) {
				// 1 means updated, otherwise replace to get proper db id.
				service.getGoals();

				if (successCallback)
					successCallback();
			})
			.error(function(data) { 
				if (failureCallback)
					failureCallback();
			});
	}

	service.deleteGoal = function(goalId, successCallback, failureCallback) {
		$http.delete('/api/goal/' + goalId)
			.success(function(data){
				service.getGoals();
				if (successCallback)
					successCallback();
			})
			.error(function(error){
				if (failureCallback)
					failureCallback();
			});

	}

	service.getGoals();
	return service;
});