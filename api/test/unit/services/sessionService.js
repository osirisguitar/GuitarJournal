'use strict';
/*jshint node:true */
/*jshint expr:true */

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');

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
    collection.toArray = sinon.stub().yields(null, sessions);

    mongoDB = {
      collection: sinon.stub().returns(collection)
    };

    sessionsService = proxyquire(process.cwd() + '/api/services/sessionService', {
      './mongodbService': mongoDB
    });
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