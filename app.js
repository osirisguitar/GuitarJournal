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
app.get("/api/users/123/sessions", function(req, res) {

// Connect to the db
	MongoClient.connect("mongodb://osiris:testmongo123@linus.mongohq.com:10003/app11622295", function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('Sessions');
		collection.find().toArray(function(err, items) {
			res.json(items);
		});
	});
	/*var session = [
		{ id: "1", date: "2013-01-01", "length": "15", "goal": "Lorem ipsum", "notes": "Bacon ipsum", "goal": "Spela fortare", "bpm": "130", "instrument": "Schecter Omen 7", "grade": "3" },
		{ id: "4", date: "2013-01-03", "length": "47", "goal": "Lorem ipsum", "notes": "Bacon ipsum", "goal": "Spela fortare", "bpm": "140", "instrument": "Ibanez S470", "grade": "4" },
		{ id: "6", date: "2013-01-04", "length": "31", "goal": "Lorem ipsum", "notes": "Bacon ipsum", "goal": "Spela fortare", "bpm": "120", "instrument": "Cort M520", "grade": "3" },
		{ id: "7", date: "2013-01-01", "length": "22", "goal": "Lorem ipsum", "notes": "Bacon ipsum", "goal": "Spela fortare", "bpm": "130", "instrument": "Schecter Omen 7", "grade": "3" },
		{ id: "12", date: "2013-01-03", "length": "147", "goal": "Lorem ipsum", "notes": "Bacon ipsum", "goal": "Spela fortare", "bpm": "140", "instrument": "Ibanez S470", "grade": "4" },
		{ id: "24", date: "2013-01-04", "length": "118", "goal": "Lorem ipsum", "notes": "Bacon ipsum", "goal": "Spela fortare", "bpm": "120", "instrument": "Cort M520", "grade": "3" }
	];*/

//	res.json(session);
})


var port = process.env.PORT || 1337;
app.listen(port);