'use strict';
/* jshint expr:true */

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));

describe('statisticsService', function() {
  var mongoDB;
  var collection = {
    find: null,
    count: null,
    aggregate: null
  };
  var statisticsService;

  beforeEach(function() {
    collection.find = sinon.stub().returns(collection);
    collection.count = sinon.stub().yields(null, 1337);
    collection.aggregate = sinon.stub();

    mongoDB = {
      collection: sinon.stub().returns(collection)
    };

    statisticsService = proxyquire(process.cwd() + '/api/services/statisticsService', {
      './mongodbService': mongoDB
    });
  });

  describe('getOverview', function() {
    var aggregate1;
    var aggregate2;

    beforeEach(function() {
      aggregate1 = [{
        averageLength: 111,
        totalLength: 2222,
        averageRating: 3.1415,
        firstSession: new Date(1974, 6, 26),
        latestSession: new Date(2000, 1, 1)
      }];

      aggregate2 = [{
        _id: 1,
        numUses: 42
      }];

      collection.aggregate.onFirstCall().yields(null, aggregate1);
      collection.aggregate.onSecondCall().yields(null, aggregate2);
    });

    it('gets the sessions collection from Mongo DB', function(done) {
      statisticsService.getOverview(123, 4, function() {
        expect(mongoDB.collection).calledOnce;
        expect(mongoDB.collection).calledWith('Sessions');
        done();
       });
    });

    it('gets count of sessions', function(done) {
      statisticsService.getOverview(123, 4, function() {
        expect(collection.count).calledOnce;
        done();
       });
    });

    it('returns statistics overview', function(done) {
      statisticsService.getOverview(123, 4, function(err, results) {
        expect(collection.aggregate).calledTwice;
        expect(err).to.be.null;
        var stats = {
          totalSessions: 1337,
          averageLength: aggregate1[0].averageLength,
          totalLength: aggregate1[0].totalLength,
          averageRating: 3.14,
          firstSession: aggregate1[0].firstSession,
          latestSession: aggregate1[0].latestSession,
          mostUsedInstrument: aggregate2[0]._id
        };
        expect(results).to.eql(stats);
        done();
       });
    });
  });

  describe('getPerWeekday', function () {
    var aggregate;

    beforeEach(function() {
      aggregate = [
        {
          sessionCount: 2,
          weekDay: 0
        },
        {
          sessionCount: 3,
          weekDay: 4
        }
      ];

      collection.aggregate.onFirstCall().yields(null, aggregate);
    });

    it('gets the session collection from Mongo DB', function (done) {
      statisticsService.getPerWeekday(123, function() {
        expect(mongoDB.collection).calledOnce;
        expect(mongoDB.collection).calledWith('Sessions');
        done();
       });      
    });

    it('returns statistics per weekday', function (done) {
      statisticsService.getPerWeekday(123, function(err, results) {
        expect(collection.aggregate).calledOnce;
        expect(results).to.eql(aggregate);
        done();
      });
    });
  });
});