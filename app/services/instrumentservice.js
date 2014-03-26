GuitarJournalApp.factory('Instruments', function($http, $rootScope, Statistics) {
	var service = {};

	service.instruments = undefined;

	service.getInstruments = function() {
		$rootScope.apiStatus.loading++;
		$http.get('/api/instruments')
			.success(function(data) {
				service.instruments = data;
				$rootScope.apiStatus.loading--;
			})
			.error(function(data) {
				$rootScope.showErrorMessage("Error when getting instruments.");
				$rootScope.apiStatus.loading--;
			});
	};

	service.getInstrument = function(instrumentId, successCallback, failureCallback) {
		if (service.instruments) {
			// First, try to find instrument in the loaded array
			for (i = 0; i < service.instruments.length; i++)
			{
				if (service.instruments[i]._id == instrumentId)
				{
					if (successCallback) {
						successCallback(service.instruments[i]);
					}
					return;
				}
			}

			// Not loaded into memory, get from DB.
			$rootScope.apiStatus.loading++;
			$http.get('/api/instrument/' + instrumentId)
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
	};

	service.getInstrumentName = function(instrumentId) {
		if (service.instruments) {
			var name = null;
			service.instruments.some(function (instrument) {
				if (instrument._id == instrumentId) {
					name = instrument.name;
				}
			});

			return name;
		}
	};

	service.getInstrumentImageData = function(instrumentId) {
		if (!instrumentId)
			return "";
		if (service.instruments) {
			var name = null;
			var imageData = null;
			service.instruments.some(function (instrument) {
				if (instrument._id == instrumentId) {
					imageData = instrument.image;
				}
			});

			if (imageData) {
				return "data:image/jpeg;base64," + imageData;			
			}
			else {
				return "";				
			}
		}		
	};

	service.getInstrumentImageUrl = function(instrumentId) {
		if (!instrumentId)
			return "";
		if (service.instruments) {
			var name = null;
			var imageUrl = null;
			service.instruments.some(function (instrument) {
				if (instrument._id == instrumentId) {
					imageUrl = "/api/images/" + instrument.imageFile + ".jpg";
				}
			});

			return imageUrl;
		}		
	};

	service.saveInstrument = function(instrument, successCallback, failureCallback) {
		$rootScope.apiStatus.loading++;

		$http.post('/api/instruments', instrument, $rootScope.httpConfig)
			.success(function(data) {
				// 1 means updated, otherwise replace to get proper db id.
				service.getInstruments();
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
	};

	service.deleteInstrument = function(instrumentId, successCallback, failureCallback) {
		$rootScope.apiStatus.loading++;
		$http.delete('/api/instrument/' + instrumentId, $rootScope.httpConfig)
			.success(function(data){
				service.getInstruments();
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

	};

	$rootScope.$watch('loggedIn', function() {
		if ($rootScope.loggedIn) {
			service.getInstruments();
		}
	});

	return service;
});