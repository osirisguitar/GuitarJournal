GuitarJournalApp.factory('Instruments', function($http) {
	var service = {};

	service.instruments = undefined;

	service.getInstruments = function() {
		$http.get('/api/instruments')
			.success(function(data) {
				service.instruments = data;
			})
			.error(function(data) {
				alert("Error when getting instruments.");
			});							
	}

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
			$http.get('/api/instrument/' + instrumentId)
				.success(function(data) {
					if (successCallback)
						successCallback(data);
				})
				.error(function(data) {
					failureCallback(data);
				});
		}
	}

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
	}

	service.saveInstrument = function(instrument, successCallback, failureCallback) {
		$http.post('/api/instruments', instrument)
			.success(function(data) {
				// 1 means updated, otherwise replace to get proper db id.
				service.getInstruments();

				if (successCallback)
					successCallback();
			})
			.error(function(data) { 
				if (failureCallback)
					failureCallback();
			});
	}

	service.deleteInstrument = function(instrumentId, successCallback, failureCallback) {
		$http.delete('/api/instrument/' + instrumentId)
			.success(function(data){
				service.getInstruments();
				if (successCallback)
					successCallback();
			})
			.error(function(error){
				if (failureCallback)
					failureCallback();
			});

	}

	service.getInstruments();
	return service;
});