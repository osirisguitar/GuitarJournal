var mongoClient = require('mongodb').MongoClient;
var cryptoHelper = require('./cryptoHelper');

var connectionString = null;

module.exports = {
	setConnectionString: function(newConnectionString) {
		connectionString = newConnectionString;
	},

	// Checks username and password against database, and calls
	// callback with either error or user set.
	checkLogin: function (username, password, callback) {
		mongoClient.connect(connectionString, function(err, db) {
			if (err) { return done(err); }

			var passwordHash = cryptoHelper.createPasswordHash(password);

			var users = db.collection('Users');
			users.findOne({ email: username, password: passwordHash }, function(err, user) {
				callback(err, user);
				db.close();
	    	});
		});
	},

	checkIfUserExists: function(username, callback) {
		mongoClient.connect(connectionString, function(err, db) {
			if (err) { return done(err); }

			var users = db.collection('Users');
			console.log('Checking user', username);
			users.findOne({ email: username }, function(err, user) {
				callback(err, user);
				db.close();
	    	});
		});
	},

	createUser: function(user, callback) {
		mongoClient.connect(connectionString, function(err, db) {
			if (err) { return done(err); }

			user.password = cryptoHelper.createPasswordHash(user.password);

			var users = db.collection('Users');
			users.save(user, { safe:true }, function(err, savedUser) {
				db.close();
				callback(err, savedUser);
			});
		});
	}
};
