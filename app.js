var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var GridStore = require('mongodb').GridStore;
var Binary = require('mongodb').Binary;
var mongoConnectionString = "mongodb://osiris:testmongo123@linus.mongohq.com:10003/app11622295";
var loggedInUser = ObjectID("512684441ea176ca050002b7");
var fs = require("fs");
var gm = require("gm");
var imageMagick = gm.subClass({ imageMagick: true });

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
app.get("/profile*", function(req, res) {
	res.sendfile(__dirname + "/app/home.html");
});
app.get("/stats*", function(req, res) {
	res.sendfile(__dirname + "/app/home.html");
});
app.get("/instrument*", function(req, res) {
	res.sendfile(__dirname + "/app/home.html");
});
app.get("/app", function(req, res) {
	res.sendfile(__dirname + "/app/home.html");
});
app.use('/componenttest', express.static(__dirname + '/componenttest'));
app.use('/app', express.static(__dirname + '/app'));

// API stuff
app.get("/api/sessions/:skip?", function(req, res) {
	var skip = req.params.skip ? parseInt(req.params.skip) : 0;

	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('Sessions');
		collection.find({ "userId": loggedInUser }).sort({ date: -1 }).skip(skip).limit(10).toArray(function(err, items) {
			if (err)
			{
				console.log(err);
				return (err);
			}
			res.json(items);
		});
	});
});

app.get("/api/statistics/overview/:days?", function(req, res) {
	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var sessions = db.collection('Sessions');
		var results = {};
		var match = { userId: loggedInUser };
		if (req.params.days) {
			var daysAgo = new Date();
			daysAgo.setDate(daysAgo.getDate() - req.params.days);
			match.date = { $gte: daysAgo };
		}

		sessions.find(match).count(function(error, count) {
   			// Do what you need the count for here.
   			results.totalSessions = count;
   			sessions.aggregate([
   				{
   					$match: match
   				},
	   			{
   					$group: {
	   					_id: "$userId",
	   					averageLength: { $avg: "$length" },
	   					totalLength: { $sum: "$length" },
	   					averageRating: { $avg: "$rating" },
	   					firstSession: { $min: "$date" },
	   					latestSession: { $max: "$date" }
   					}
   				}
   			], function(err, agg) { 
   				if (err) {
   					console.log(err);
   					res.json();
   					return;
   				}
   				if (agg && agg.length > 0) {
	   				results.averageLength = Math.round(agg[0].averageLength);
	   				results.totalLength = agg[0].totalLength;
	   				results.averageRating = Math.round(agg[0].averageRating*100)/100;
	   				results.firstSession = agg[0].firstSession;
	   				results.latestSession = agg[0].latestSession;   					
   				}
	   			sessions.aggregate([
	   			{
	   				$match: match
	   			},
	   			{
	   				$group: 
	   				{
	   					_id: '$instrumentId', 
	   					numUses: { $sum: 1 }
	   				}
	   			},
 				{
   					$sort: { numUses: -1 }
   				}]
	   			, function (err, agg) {
	   				if (err) {
	   					console.log(err);
	   					res.json();
	   					return;	   					
	   				}
	   				if (agg && agg.length > 0) {
	   					results.mostUsedInstrument = agg[0]._id;
	   				}
	   				res.json(results);
	   			});
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

app.delete("/api/session/:id", function(req, res) {
	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('Sessions');
		collection.remove({ _id: ObjectID(req.params.id) }, 1, function(err, item) {
			res.json(item);
		});
	});
});

app.post("/api/sessions", function(req, res) {
	if (req.body._id) {
		req.body._id = ObjectID(req.body._id);
	}
	req.body.userId = loggedInUser;
	if (req.body.goalId) {
		req.body.goalId = ObjectID(req.body.goalId);		
	}
	if (req.body.instrumentId) {
		req.body.instrumentId = ObjectID(req.body.instrumentId);
	}
	if (req.body.date) {
		req.body.date = new Date(req.body.date);
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
		collection.find({ "userId": loggedInUser }).sort({ completionDate: 1, title: 1 }).toArray(function(err, items) {
			if (err) {
				return (err);
			}
			res.json(items);
		});
	});
});

app.post("/api/goals", function(req, res) {
	if (req.body._id) {
		req.body._id = ObjectID(req.body._id);
	}
	if (req.body.userId) {
		req.body.userId = ObjectID(req.body.userId);
	}
	else {
		req.body.userId = loggedInUser;
	}
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('Goals');
		collection.save(req.body, {safe:true}, function(err, savedSession) {
			res.json(savedSession);
		});
	});
});

app.delete("/api/goal/:id", function(req, res) {
	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var goals = db.collection('Goals');
		goals.remove({ _id: ObjectID(req.params.id) }, 1, function(err, item) {
			res.json(item);
		});
	});
});

app.get("/api/profile", function(req, res) {
	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var users = db.collection('Users');
		users.findOne({ _id: loggedInUser }, function(err, item) {
			res.json(item);
		});
	});
});

app.get("/api/instruments", function(req, res) {

	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var instruments = db.collection('Instruments');
		instruments.find({ "userId": loggedInUser }).toArray(function(err, items) {
			if (err)
			{
				console.log(err);
				return (err);
			}
			res.json(items);
		});
	});
});

app.post("/api/instruments", function(req, res) {
	var instrumentId = undefined;
	if (req.body._id) {
		instrumentId = ObjectID(req.body._id);
		// Delete _id, since you can't use it in update.
		delete req.body._id;	
	}
	req.body.userId = loggedInUser;
	if (req.body.image) {
		// This is not recieved in a proper format.
		delete req.body.image;		
	}

	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var instruments = db.collection('Instruments');
		if (instrumentId) {
			instruments.update({ _id: instrumentId }, { $set: req.body }, {safe:true}, function(err, updatedInstrument) {
				if (err) console.log(err);
				res.json(updatedInstrument);
			});
		}
		else {
			instruments.save(req.body, {safe:true}, function(err, insertedInstrument) {
				if (err) console.log(err);
				res.json(insertedInstrument);
			});
		}
	});
});

app.post("/api/instrument/:id/setimage", function(req, res) {
	var imagebytes = [];
	if (req.params.id)
		req.params.id = ObjectID(req.params.id);

	imageMagick(req.files.imagefile.path).size(function(err, size) {
		var width = size.width;
		var height = size.height;

		var targetWidth = 75;
		var targetHeight = 75;
		var cropX = 0;
		var cropY = 0;

		if (width > height) {
			targetWidth = Math.round(width * 75 / height);
			cropX = Math.round((targetWidth - targetHeight)/2);
		}
		else {
			targetHeight = Math.round(height * 75 / width);
			cropY = Math.round((targetHeight - targetWidth)/2);			
		}

		imageMagick(req.files.imagefile.path)
			.resize(targetWidth, targetHeight)
			.crop(75, 75, cropX, cropY)
			.autoOrient()
			.stream(function (err, stdout, stderr) {
				if (err) console.log(err);

				stdout.on('data', function(data) {
					imagebytes.push(data);
				});

				stdout.on('close', function() {
					var image = Buffer.concat(imagebytes);
					var imageData = Binary(image);

					MongoClient.connect(mongoConnectionString, function(err, db) {
						if(err) { return console.dir(err); }
						db.collection('Instruments')
							.update({ _id: req.params.id }, { $set: { image: imageData } }, { safe:true }, function(err, updatedInstrument) {
								if (err) {
									console.log(err);
									res.send(500, "Could not set image for instrument");
								}

								res.set('Content-Type', 'image/jpeg');
								res.send(image);
								return;
							});
					});
				});
			});
	});
});

app.delete("/api/instrument/:id", function(req, res) {
	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var instruments = db.collection('Instruments');
		instruments.remove({ _id: ObjectID(req.params.id) }, 1, function(err, item) {
			res.json(item);
		});
	});
});


var port = process.env.PORT || 1337;
app.listen(port);