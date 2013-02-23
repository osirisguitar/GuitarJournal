var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var mongoConnectionString = "mongodb://osiris:testmongo123@linus.mongohq.com:10003/app11622295";
var loggedInUser = ObjectID("512684441ea176ca050002b7");

app.use(express.bodyParser());
// App stuff, static files
app.get("/", function(req, res) {
	res.sendfile(__dirname + "/app/home.html");
});
app.get("/session*", function(req, res) {
	res.sendfile(__dirname + "/app/home.html");
});
app.get("/goal*", function(req, res) {
	res.sendfile(__dirname + "/app/home.html");
});
app.get("/app", function(req, res) {
	res.sendfile(__dirname + "/app/home.html");
});
app.use('/app', express.static(__dirname + '/app'));

// API stuff
app.get("/api/sessions", function(req, res) {

	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('Sessions');
		collection.find({ "userId": loggedInUser }).toArray(function(err, items) {
			if (err)
			{
				console.log(err);
				return (err);
			}
			res.json(items);
		});
	});
});

app.get("/api/sessions/statistics", function(req, res) {

	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var sessions = db.collection('Sessions');
		var results = {};
		sessions.find({ "userId": loggedInUser }).count(function(error, count) {
   			// Do what you need the count for here.
   			results.totalSessions = count;
   			sessions.aggregate({
   				$match: {
   					userId: loggedInUser
   				},
   				$group: {
   					_id: "$userId",
   					averageLength: { $avg: "$length" },
   					totalLength: { $sum: "$length" }
   				}
   			}, function(err, agg) 
   			{ 
   				console.log(agg);
   				results.averageLength = agg[0].averageLength;
   				results.totalLength = agg[0].totalLength;
   				res.json(results);
   			});
		});
	});
});

app.get("/api/session/:id", function(req, res) {

	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('Sessions');
		collection.findOne({ _id: ObjectID(req.params.id) }, function(err, item) {
			res.json(item);
		});
	});
});

app.post("/api/sessions", function(req, res) {
	if (req.body._id) {
		req.body._id = ObjectID(req.body._id);
	}
	if (req.body.userId) {
		req.body.userId = ObjectID(req.body.userId);
	}
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('Sessions');
		collection.save(req.body, {safe:true}, function(err, savedSession) {
			res.json(savedSession);
		});
	});
});

app.get("/api/goals", function(req, res) {

	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('Goals');
		collection.find({ "userId": loggedInUser }).toArray(function(err, items) {
			if (err)
			{
				console.log(err);
				return (err);
			}
			console.log(items);
			res.json(items);
		});
	});
});

app.post("/api/goals", function(req, res) {
	if (req.body._id)
	{
		req.body._id = ObjectID(req.body._id);
	}
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('Goals');
		collection.save(req.body, {safe:true}, function(err, savedSession) {
			res.json(savedSession);
		});
	});
});


var port = process.env.PORT || 1337;
app.listen(port);