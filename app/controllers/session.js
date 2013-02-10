function SessionCtrl($scope, $http) {
	$scope.sessions = [
		{ id: "0", date: "2013-01-01", "length": "15", "goal": "Lorem ipsum", "notes": "Bacon ipsum", "goal": "Spela fortare", "bpm": "130", "instrument": "Schecter Omen 7", "grade": "3" },
		{ id: "1", date: "2013-01-03", "length": "47", "goal": "Lorem ipsum", "notes": "Bacon ipsum", "goal": "Spela fortare", "bpm": "140", "instrument": "Ibanez S470", "grade": "4" },
		{ id: "2", date: "2013-01-04", "length": "31", "goal": "Lorem ipsum", "notes": "Bacon ipsum", "goal": "Spela fortare", "bpm": "120", "instrument": "Cort M520", "grade": "3" }
	];
}