var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
//var mongoose = require('mongoose');
var mongoConnectionString = "mongodb://osiris:testmongo123@linus.mongohq.com:10003/app11622295";

/*var schema = mongoose.Schema({ 

});*/

app.use(express.bodyParser());
// App stuff, static files
app.get("/", function(req, res) {
	res.sendfile(__dirname + "/app/home.html");
});
app.get("/session*", function(req, res) {
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
		collection.find().toArray(function(err, items) {
			res.json(items);
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
	console.log("Body:");
	console.log(req.body);
	if (req.body._id)
	{
		req.body._id = ObjectID(req.body._id);
	}
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('Sessions');
		collection.save(req.body, {safe:true}, function(err, savedSession) {
			res.json(savedSession);
		});
	});
});


var port = process.env.PORT || 1337;
app.listen(port);