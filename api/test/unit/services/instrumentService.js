'use strict';
/*jshint node:true */
/*jshint expr:true */

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));

describe('instrumentService', function() {
  var mongoDB;
  var collection = {
    find: null,
    sort: null,
    skip: null,
    limit: null,
    toArray: null
  };
  var instruments;
  var instrumentService;

  beforeEach(function() {
    instruments = [{
      id: 123
    }];

    collection.find = sinon.stub().returns(collection);
    collection.sort = sinon.stub().returns(collection);
    collection.skip = sinon.stub().returns(collection);
    collection.limit = sinon.stub().returns(collection);

    mongoDB = {
      collection: sinon.stub().returns(collection)
    };

    instrumentService = proxyquire(process.cwd() + '/api/services/instrumentService', {
      './mongodbService': mongoDB
    });
  });

  describe('getInstruments', function() {
    beforeEach(function() {
      collection.toArray = sinon.stub().yields(null, instruments);
    });

    it('gets the instruments collection from Mongo DB', function(done) {
      instrumentService.getInstruments(123, function() {
        expect(mongoDB.collection).calledOnce;
        expect(mongoDB.collection).calledWith('Instruments');
        done();
       });
    });

    it('calls find by user id on instruments', function(done) {
      instrumentService.getInstruments(123, function() {
        expect(collection.find).calledOnce.calledWith({ userId: 123 });
        done();
      });
    });

    it('returns an array of instruments', function(done) {
      instrumentService.getInstruments(123, function(err, items) {
        expect(items).to.eql(instruments);
        done();
      });    
    });      
  });

  describe('saveInstrument', function() {
    var instrument;

    beforeEach(function() {
      instrument = {
        _id: '545b64d49025e20000000001',
        userId: 123,
        name: 'Gurka',
        type: '6-string',
        description: 'A gurk'
      };

      collection.save = sinon.stub().yields(null, { 'nInserted': 1 });
    });

    it('calls save on goals', function() {
      instrumentService.saveInstrument(123, instrument, function() {
        expect(collection.save).calledOnce.calledWith({ 
          _id: '545b64d49025e20000000001', 
          userId: 123,
          name: 'Gurka',
          type: '6-string',
          description: 'A gurk'
        }, { safe: true });
      });
    });

    it('returns a result from saving', function() {
      instrumentService.saveInstrument(123, instrument, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.eql({ 'nInserted': 1 });
      });
    });
  });

  describe('deleteInstrument', function() {
    var instrument;

    beforeEach(function() {
      instrument = {
        _id: '5465241dc29dbfa356000001'
      };

      collection.remove = sinon.stub().yields(null, { 'nRemoved': 1 });
    });

    it('calls remove on goals', function() {
      instrumentService.deleteInstrument(123, instrument._id, function() {
        expect(collection.remove).calledOnce.calledWith({
          _id: instrument._id,
          userId: 123
        }, 1);
      });
    }); 

    it('returns a result from deleting', function() {
      instrumentService.deleteInstrument(123, instrument._id, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.eql({ 'nRemoved': 1 });
      });
    }); 
  });
});