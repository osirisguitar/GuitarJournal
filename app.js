var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var GridStore = require('mongodb').GridStore;
var Binary = require('mongodb').Binary;
var mongoConnectionString = "mongodb://osiris:testmongo123@linus.mongohq.com:10003/app11622295";
//var loggedInUser = ObjectID("512684441ea176ca050002b7");
var fs = require("fs");
var gm = require("gm");
var imageMagick = gm.subClass({ imageMagick: true });
var crypto = require("crypto");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy;


app.use(express.cookieParser('hejpa'));
app.use(express.cookieSession({ secret: 'mongoVoldemort' }));
app.use(express.csrf());
app.use(express.bodyParser());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
	    usernameField: 'email',
	    passwordField: 'password'
	},
  	function(username, password, done) {
  		console.log("Passport logging in", username, password);

		MongoClient.connect(mongoConnectionString, function(err, db) {
			if(err) { return done(err); }

			var users = db.collection('Users');
			users.findOne({ email: username }, function(err, user) {
			    if (err)
			    	return done(err);
			    else
			      	return done(null, user);
	    	});
 		});
 	}
));

passport.use(new FacebookStrategy({
		clientID: '151038621732407',
	    clientSecret: '6a29a4ca71df925e48be56e21b5ec832',
	    callbackURL: "http://journal.osirisguitar.com/auth/facebook/callback"
  	},
  	function(accessToken, refreshToken, profile, done) {
 		MongoClient.connect(mongoConnectionString, function(err, db) {
			if(err) { return done(err); }

			var users = db.collection('Users');
			users.findOne({ facebookId: profile.id }, function(err, user) {
			    if (err)
			    	return done(err);
			    else
			    {
			    	if (user == null) {
			    		var newUser = {};
			    		newUser.facebookId = profile.id;
			    		newUser.fullName = profile.displayName;
			    		newUser.username = profile.username;
			    		users.save(newUser, { safe: true}, function(err, user) {
			    			if (err)
			    				return done(err);
			    			else
			    				return done(null, user);
			    		});
			    	}
			    	else
				      	return done(null, user);			    	
			    }
			    db.close();
	    	});
 		});
  	}
));

passport.serializeUser(function(user, done) {
	console.log('serialize', user);
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	console.log('deserialize', id);
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return done(err); }

		var users = db.collection('Users');
		users.findOne({ _id: ObjectID(id) }, function(err, user) {
			console.log('deserialize: found', user);
			db.close();
			done(err, user);
    	});
	});
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'publish_actions' }));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

// App stuff, static files
app.get("/", function(req, res) {
	res.sendfile(__dirname + "/app/home.html");
});
app.get("/login*", function(req, res) {
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

app.post('/api/login',
	passport.authenticate('local'),
	function (req, res) {
		res.json(req.user);
	}
);

app.post('/api/logout', function(req, res) {
	req.logout();
	res.send(200, "OK");
});

/*app.post('/api/login', function(req, res) {
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var users = db.collection('Users');
		users.findOne({ email: req.body.email }, function(err, user) {
			if (err)
				console.log(err);
			console.log("Logged in user", user);
			req.session.loggedInUser = user._id;
			res.json(user);
		});
	});
});*/

app.get('/api/loggedin', function(req, res) {
	if (req.isAuthenticated())
	{
		req.user._csrf = req.session._csrf;
		res.json(req.user);		
	}
	else 
		res.json({ _csrf: req.session._csrf});
});

function checkLogin(req, res) {
	if (!req.session.loggedInUser)
	{
		console.log("No logged in user");
		res.send("401", "Not logged in");
		return null;
	}
	else
		return ObjectID(req.session.loggedInUser);
}

// API stuff
app.get("/api/sessions/:skip?", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;

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
			db.close();
		});
	});
});

app.get("/api/statistics/overview/:days?", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;

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
   					db.close();
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
	   					db.close();
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

app.get("/api/session/:id", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;
	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('Sessions');
		collection.findOne({ _id: ObjectID(req.params.id), userId: loggedInUser }, function(err, item) {
			res.json(item);
			db.close();
		});
	});
});

app.delete("/api/session/:id", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;
	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('Sessions');
		collection.remove({ _id: ObjectID(req.params.id), userId: loggedInUser }, 1, function(err, item) {
			res.json(item);
			db.close();
		});
	});
});

app.post("/api/sessions", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;
	req.body.userId = req.user._id;

	if (req.body._id) {
		req.body._id = ObjectID(req.body._id);
	}
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
			db.close();
		});
	});
});

app.get("/api/goals", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id

	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('Goals');
		collection.find({ "userId": loggedInUser }).sort({ completionDate: 1, title: 1 }).toArray(function(err, items) {
			if (err) {
				return (err);
			}
			res.json(items);
			db.close();
		});
	});
});

app.post("/api/goals", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;
	if (req.body._id) {
		req.body._id = ObjectID(req.body._id);
	}
	req.body.userId = loggedInUser;
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('Goals');
		collection.save(req.body, {safe:true}, function(err, savedSession) {
			res.json(savedSession);
			db.close();
		});
	});
});

app.delete("/api/goal/:id", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;
	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var goals = db.collection('Goals');
		goals.remove({ _id: ObjectID(req.params.id), userId: loggedInUser }, 1, function(err, item) {
			res.json(item);
			db.close();
		});
	});
});

app.get("/api/profile", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;
	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var users = db.collection('Users');
		users.findOne({ _id: loggedInUser }, function(err, item) {
			res.json(item);
			db.close();
		});
	});
});

app.get("/api/instruments", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;

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
			db.close();
		});
	});
});

app.post("/api/instruments", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;
	var instrumentId = undefined;
	if (req.body._id) {
		req.body._id = ObjectID(req.body._id);
	}
	req.body.userId = loggedInUser;
	var imagebytes = [];
	if (req.body.image) {
		var imageStream = new Buffer(req.body.image, 'base64');
		imageMagick(imageStream).size(function(err, size) {
			if (err)
				console.log(err);
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

			imageMagick(imageStream)
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
						req.body.image = imageData;

						MongoClient.connect(mongoConnectionString, function(err, db) {
							if(err) { return console.dir(err); }
							db.collection('Instruments')
								.save(req.body, { safe:true }, function(err, updatedInstrument) {
									if (err) {
										console.log(err);
										res.send(500, "Could not set image for instrument");
									}

									res.json(updatedInstrument);
									db.close();
									return;
								});
						});
					});
				});
		});

	}
	else
	{
		console.log("No image");
		res.send(500, "Not yet");
	}


/*
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
	});*/
});

app.post("/api/instrument/:id/setimage", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;
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
							.update({ _id: req.params.id, userId: loggedInUser }, { $set: { image: imageData } }, { safe:true }, function(err, updatedInstrument) {
								if (err) {
									console.log(err);
									res.send(500, "Could not set image for instrument");
								}

								res.set('Content-Type', 'image/jpeg');
								res.send(image);
								db.close();
								return;
							});
					});
				});
			});
	});
});

app.delete("/api/instrument/:id", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;

	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var instruments = db.collection('Instruments');
		instruments.remove({ _id: ObjectID(req.params.id), userId: loggedInUser }, 1, function(err, item) {
			res.json(item);
			db.close();
		});
	});
});

app.get("/api/practicesession/:id", function(req, res) {
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var sessions = db.collection('Sessions');
		sessions.findOne({ _id: ObjectID(req.params.id) }, function(err, session) {
			res.send('<html>' +
				'<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# ogjournal: http://ogp.me/ns/fb/ogjournal#">' +
				'<meta property="fb:app_id" content="151038621732407" />' +
        		'<meta property="og:title" content="A ' + session.length + ' Minute Practice Session" />' +
        		'<meta property="og:image" content="http://journal.osirisguitar.com/api/practicesessionimage/' + session.instrumentId + '" />' +
        		'<meta property="og:url" content="http://journal.osirisguitar.com/api/practicesession/' + req.params.id + '" />' +
        		'<meta property="og:type" content="ogjournal:practice_session" />' +
        		'<meta property="session_length" content="' + session.length + '" />' +
        		'<meta property="session_instrument" content="' + "Gurka" + '" />' +
				'</head>');
			db.close();
		});
	});
});

app.get("/api/practicesessionimage/:id", function(req, res) {
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var instruments = db.collection('Instruments');
		instruments.findOne({ _id: ObjectID(req.params.id) }, function(err, instrument) {
			if (err)
				return console.dir(err);
			res.type("image/jpeg");
			console.log(instrument.image);
			res.send(instrument.image.buffer);
			db.close();
		});
	});
});

var port = process.env.PORT || 80;
app.listen(port);