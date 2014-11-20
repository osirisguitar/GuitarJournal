'use strict';
/*jshint node:true */
/*jshint expr:true */

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');
var ObjectID = require('mongodb').ObjectID;

chai.use(require('sinon-chai'));

describe('sessionsService', function() {
  var mongoDB;
  var collection = {
    find: null,
    sort: null,
    skip: null,
    limit: null,
    toArray: null
  };
  var sessions;
  var sessionsService;

  beforeEach(function() {
    sessions = [{
      id: 123
    }];

    collection.find = sinon.stub().returns(collection);
    collection.sort = sinon.stub().returns(collection);
    collection.skip = sinon.stub().returns(collection);
    collection.limit = sinon.stub().returns(collection);

    mongoDB = {
      collection: sinon.stub().returns(collection)
    };

    sessionsService = proxyquire(process.cwd() + '/api/services/sessionService', {
      './mongodbService': mongoDB
    });
  });

  describe('getSessions', function() {
    beforeEach(function() {
      collection.toArray = sinon.stub().yields(null, sessions);
    });

    it('gets the sessions collection from Mongo DB', function(done) {
      sessionsService.getSessions(123, 4, function() {
        expect(mongoDB.collection).calledOnce;
        expect(mongoDB.collection).calledWith('Sessions');
        done();
       });
    });

    it('calls find by user id on sessions', function(done) {
      sessionsService.getSessions(123, 4, function() {
        expect(collection.find).calledOnce.calledWith({ userId: 123 });
        done();
      });
    });

    it('sorts the sessions by reverse date', function(done) {
      sessionsService.getSessions(123, 4, function() {
        expect(collection.sort).calledOnce.calledWith({ date: -1 });
        done();
      });    
    });

    it('skips sessions if asked to', function(done) {
      sessionsService.getSessions(123, 4, function() {
        expect(collection.skip).calledOnce.calledWith(4);
        done();
      });    
    });

    it('limits the number of sessions to 10', function(done) {
      sessionsService.getSessions(123, 4, function() {
        expect(collection.limit).calledOnce.calledWith(10);
        done();
      });    
    });

    it('returns an array of sessions', function(done) {
      sessionsService.getSessions(123, 4, function(err, items) {
        expect(items).to.eql(sessions);
        done();
      });    
    });      
  });

  describe('getSession', function() {
    beforeEach(function() {
      collection.findOne = sinon.stub().yields(null, sessions[0]);
    });

    it('calls findOne by session id on sessions', function() {
      sessionsService.getSession(123, '5465241dc29dbfa356000001', function() {
        expect(collection.findOne).calledOnce.calledWith({ _id: new ObjectID('5465241dc29dbfa356000001'), userId: 123 });
      });
    });

    it('returns a session', function() {
      sessionsService.getSession(123, '5465241dc29dbfa356000001', function(err, session) {
        expect(err).to.be.null;
        expect(session).to.eql(sessions[0]);
      });      
    });
  });

  describe('saveSession', function() {
    var session;

    beforeEach(function() {
      session = {
        _id: '5465241dc29dbfa356000001',
        goalId: '5465241dc29dbfa356000002',
        instrumentId: '5465241dc29dbfa356000001',
        startDate: new Date(),
        startTime: '10:00',
        endTime: '12:00'
      };

      collection.save = sinon.stub().yields(null, sessions[0]);
    });

    it('calls save on sessions', function() {
      sessionsService.saveSession(123, session, function() {
        expect(collection.save).calledOnce.calledWith({ 
          _id: new ObjectID('5465241dc29dbfa356000001'), 
          userId: 123,
          goalId: new ObjectID('5465241dc29dbfa356000002'),
          instrumentId: new ObjectID('5465241dc29dbfa356000001'),
          startDate: session.startDate,
          startTime: session.startTime,
          endTime: session.endTime,
          length: 120
        });
      });
    });

    it('returns a result from saving', function() {
      sessionsService.saveSession(123, session, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.eql({ id: 123 });
      });
    });
  });

  describe('deleteSession', function() {
    
  });
});