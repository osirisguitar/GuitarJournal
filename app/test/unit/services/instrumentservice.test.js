describe('InstrumentService', function () {
	var http, rootScope, mockStatistics, instruments;

	var mockInstruments = [
		{ _id: 123, name: 'guitar', description: 'a guitar', imageFile: '123.jpg', type: 'guitar' }
	];

	var otherInstrument = { _id: 456, name: 'other guitar', description: 'another guitar', imageFile: '456.jpg', type: 'guitar' };

	beforeEach(function () {
		module('GuitarJournalApp', function($provide) {
			mockStatistics = { flushStats: sinon.stub() };
			$provide.factory("Statistics", function() { return mockStatistics; });
		});
		inject(function ($rootScope, Instruments, $httpBackend, Statistics) {
			rootScope = $rootScope;
			$rootScope.apiStatus = { loading: 0 };
			$rootScope.showErrorMessage = sinon.stub();
			http = $httpBackend;
			instruments = Instruments;
		});
	});

	afterEach(function() {
		http.verifyNoOutstandingExpectation();
		http.verifyNoOutstandingRequest();
	});

	it("should call /api/instruments when getInstruments is called", function() {
		instruments.getInstruments();
		http.expectGET('/api/instruments').respond(mockInstruments);

		expect(rootScope.apiStatus.loading).to.equal(1);
		http.flush();
		expect(rootScope.apiStatus.loading).to.equal(0);
		expect(instruments.instruments).to.eql(mockInstruments);
	});

	it("should show an error when not able to get instruments", function() {
		instruments.getInstruments();
		http.expectGET('/api/instruments').respond(500, "Something wrong with server");
		expect(rootScope.apiStatus.loading).to.equal(1);
		http.flush();
		expect(rootScope.apiStatus.loading).to.equal(0);
		expect(rootScope.showErrorMessage).calledOnce;
	});

	it("should return an instrument from memory if already retrieved", function() {
		instruments.instruments = mockInstruments;
		var getInstrumentCallback = sinon.stub();
		instruments.getInstrument(mockInstruments[0]._id, getInstrumentCallback);
		expect(getInstrumentCallback).calledWith(mockInstruments[0]);
	});

	it("should get an instrument from API if not already retrieved", function() {
		instruments.instruments = mockInstruments;
		var getInstrumentCallback = sinon.stub();
		http.expectGET('/api/instrument/' + otherInstrument._id).respond(otherInstrument);		
		instruments.getInstrument(otherInstrument._id, getInstrumentCallback);
		http.flush();
		expect(getInstrumentCallback).calledWith(otherInstrument);
	});

	it("should call POST on api/instruments when calling saveInstrument", function() {
		http.expectPOST('/api/instruments', mockInstruments[0]).respond(200, 1);
		var saveCallback = sinon.stub();

		var realGetInstruments = instruments.getInstruments;
		instruments.getInstruments = sinon.stub();

		instruments.saveInstrument(mockInstruments[0], saveCallback);
		expect(rootScope.apiStatus.loading).to.equal(1);
		http.flush();
		expect(mockStatistics.flushStats).calledOnce;
		expect(rootScope.apiStatus.loading).to.equal(0);
		expect(saveCallback).calledOnce;
		expect(instruments.getInstruments).calledOnce;

		instruments.getInstruments = realGetInstruments;
	});

	it("should call DELETE on api/instrument when calling deleteInstrument", function() {
		http.expectDELETE('/api/instrument/' + mockInstruments[0]._id).respond(200, 1);
		realGetInstruments = instruments.getInstruments;
		instruments.getInstruments = sinon.stub();

		var deleteCallback = sinon.stub();

		instruments.deleteInstrument(mockInstruments[0]._id, deleteCallback);
		expect(rootScope.apiStatus.loading).to.equal(1);
		http.flush();
		expect(mockStatistics.flushStats).calledOnce;
		expect(rootScope.apiStatus.loading).to.equal(0);
		expect(deleteCallback).calledOnce;

		expect(instruments.getInstruments).calledOnce;

		instruments.getInstruments = realGetInstruments;
	});

	xit("should call getInstruments when user is logged in", function() {
		var realGetInstruments = instruments.getInstruments;
		instruments.getInstruments = sinon.stub();

		rootScope.loggedIn = true;
		expect(instruments.getInstruments).calledOnce;
		instruments.getInstruments = realGetInstruments;
	});
});