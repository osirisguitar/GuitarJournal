var mongoClient = require('mongodb').MongoClient;
var async = require('async');

var connectionString = null;

exports.setConnectionString = function(newConnectionString) {
	connectionString = newConnectionString;
};

// Checks username and password against database, and calls
// callback with either error or user set.
exports.checkLogin = function (username, password, callback) {
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return done(err); }

		var users = db.collection('Users');
		users.findOne({ email: username }, function(err, user) {
			callback(err, user);
			db.close();
    	});
	});
}

// Returns 10 sessions of a user, starting from skipCount. Callback must accept
// two parameters: err, data
exports.getSessions = function(userId, skipCount, callback) {
	// Connect to the db
	mongoClient.connect(connectionString, function(err, db) {
		if(err) { 
			return console.dir(err); 
		}

		var collection = db.collection('Sessions');
		collection.find({ "userId": userId }).sort({ date: -1 }).skip(skipCount).limit(10).toArray(function(err, items) {
			callback(err, items);
			db.close();
		});
	});
}