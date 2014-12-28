'use strict';
/*jshint node:true */
/*jshint expr:true */

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');
var ObjectID = require('mongodb').ObjectID;

chai.use(require('sinon-chai'));

describe('goalService', function() {
  var mongoDB;
  var collection = {
    find: null,
    sort: null,
    skip: null,
    limit: null,
    toArray: null
  };
  var goals;
  var goalService;

  beforeEach(function() {
    goals = [{
      id: 123
    }];

    collection.find = sinon.stub().returns(collection);
    collection.sort = sinon.stub().returns(collection);
    collection.skip = sinon.stub().returns(collection);
    collection.limit = sinon.stub().returns(collection);

    mongoDB = {
      collection: sinon.stub().returns(collection)
    };

    goalService = proxyquire(process.cwd() + '/api/services/goalService', {
      './mongodbService': mongoDB
    });
  });

  describe('getGoals', function() {
    beforeEach(function() {
      collection.toArray = sinon.stub().yields(null, goals);
    });

    it('gets the goals collection from Mongo DB', function(done) {
      goalService.getGoals(123, function() {
        expect(mongoDB.collection).calledOnce;
        expect(mongoDB.collection).calledWith('Goals');
        done();
       });
    });

    it('calls find by user id on goals', function(done) {
      goalService.getGoals(123, function() {
        expect(collection.find).calledOnce.calledWith({ userId: 123 });
        done();
      });
    });

    it('sorts the goals by completion date and title', function(done) {
      goalService.getGoals(123, function() {
        expect(collection.sort).calledOnce.calledWith({ completionDate: 1, title: 1 });
        done();
      });    
    });

    it('returns an array of goals', function(done) {
      goalService.getGoals(123, function(err, items) {
        expect(items).to.eql(goals);
        done();
      });    
    });      
  });

  describe('saveSession', function() {
    var goal;

    beforeEach(function() {
      goal = {
        _id: '54a016166f69b6ae11000001',
        userId: 123,
        date: new Date(10000),
        title: 'Fix unit tests',
        description: 'Unit hest',
        completed: true,
        completionDate: new Date(20000)
      };

      collection.save = sinon.stub().yields(null, { 'nInserted': 1 });
    });

    it('calls save on goals', function() {
      goalService.saveGoal(123, goal, function() {
        expect(collection.save).calledOnce.calledWith({ 
          _id: '54a016166f69b6ae11000001', 
          userId: 123,
          date: new Date(10000),
          title: 'Fix unit tests',
          description: 'Unit hest',
          completed: true,
          completionDate: new Date(20000)
        }, { safe: true });
      });
    });

    it('returns a result from saving', function() {
      goalService.saveGoal(123, goal, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.eql({ 'nInserted': 1 });
      });
    });
  });

  describe('deleteGoal', function() {
    var goal;

    beforeEach(function() {
      goal = {
        _id: '5465241dc29dbfa356000001'
      };

      collection.remove = sinon.stub().yields(null, { 'nRemoved': 1 });
    });

    it('calls remove on goals', function() {
      goalService.deleteGoal(123, goal._id, function() {
        expect(collection.remove).calledOnce.calledWith({
          _id: goal._id,
          userId: 123
        }, 1);
      });
    }); 

    it('returns a result from deleting', function() {
      goalService.deleteGoal(123, goal._id, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.eql({ 'nRemoved': 1 });
      });
    }); 
  });
});