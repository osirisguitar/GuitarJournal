describe('GoalService', function () {
	var http, rootScope, mockStatistics, goals;

	var mockGoals = [
		{ _id: 123, title: 'goal', description: 'a goal', date: '2014-03-23T20:58:46.158Z', userId: '789' },
		{ _id: 456, title: 'goal 2', description: 'second goal', date: '2014-03-25T20:58:46.158Z', userId: '789' },
	];

	var otherGoal = { _id: 789, title: 'other goal', description: 'another goal', date: new Date(), userId: '789' };

	beforeEach(function () {
		module('GuitarJournalApp', function($provide) {
			mockStatistics = { flushStats: sinon.stub() };
			$provide.factory("Statistics", function() { return mockStatistics; });
		});
		inject(function ($rootScope, Goals, $httpBackend, Statistics) {
			rootScope = $rootScope;
			$rootScope.apiStatus = { loading: 0 };
			$rootScope.showErrorMessage = sinon.stub();
			http = $httpBackend;
			goals = Goals;
		});
	});

	afterEach(function() {
		http.verifyNoOutstandingExpectation();
		http.verifyNoOutstandingRequest();
	});

	it("should call /api/goals when getGoals is called", function() {
		goals.getGoals();
		http.expectGET('/api/goals').respond(mockGoals);

		expect(rootScope.apiStatus.loading).to.equal(1);
		http.flush();
		expect(rootScope.apiStatus.loading).to.equal(0);
		expect(goals.goals).to.eql(mockGoals);
	});

	it("should show an error when not able to get goals", function() {
		goals.getGoals();
		http.expectGET('/api/goals').respond(500, "Something wrong with server");
		expect(rootScope.apiStatus.loading).to.equal(1);
		http.flush();
		expect(rootScope.apiStatus.loading).to.equal(0);
		expect(rootScope.showErrorMessage).calledOnce;
	});

	it("should return a goal from memory if already retrieved", function() {
		goals.goals = mockGoals;
		var getGoalCallback = sinon.stub();
		goals.getGoal(mockGoals[0]._id, getGoalCallback);
		expect(getGoalCallback).calledWith(mockGoals[0]);
	});

	it("should get a goal from API if not already retrieved", function() {
		goals.goals = mockGoals;
		var getGoalCallback = sinon.stub();
		http.expectGET('/api/goal/' + otherGoal._id).respond(otherGoal);		
		goals.getGoal(otherGoal._id, getGoalCallback);
		http.flush();
		expect(getGoalCallback).calledWith(otherGoal);
	});

	it("should call POST on api/goal when calling saveGoal", function() {
		http.expectPOST('/api/goals', mockGoals[0]).respond(200, 1);
		var saveCallback = sinon.stub();

		var realGetGoals = goals.getGoals;
		goals.getGoals = sinon.stub();

		goals.saveGoal(mockGoals[0], saveCallback);
		expect(rootScope.apiStatus.loading).to.equal(1);
		http.flush();
		expect(mockStatistics.flushStats).calledOnce;
		expect(rootScope.apiStatus.loading).to.equal(0);
		expect(saveCallback).calledOnce;
		expect(goals.getGoals).calledOnce;

		goals.getGoals = realGetGoals;
	});

	it("should call DELETE on api/goal when calling deleteGoal", function() {
		http.expectDELETE('/api/goal/' + mockGoals[0]._id).respond(200, 1);
		var realGetGoals = goals.getGoals;
		goals.getGoals = sinon.stub();

		var deleteCallback = sinon.stub();

		goals.deleteGoal(mockGoals[0]._id, deleteCallback);
		expect(rootScope.apiStatus.loading).to.equal(1);
		http.flush();
		expect(mockStatistics.flushStats).calledOnce;
		expect(rootScope.apiStatus.loading).to.equal(0);
		expect(deleteCallback).calledOnce;

		expect(goals.getGoals).calledOnce;

		goals.getGoals = realGetGoals;
	});
});