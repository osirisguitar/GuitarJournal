var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;


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
	MongoClient.connect("mongodb://osiris:testmongo123@linus.mongohq.com:10003/app11622295", function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('Sessions');
		collection.find().toArray(function(err, items) {
			res.json(items);
		});
	});
})


var port = process.env.PORT || 1337;
app.listen(port);