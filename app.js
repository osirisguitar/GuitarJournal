if (process.env.USE_NODETIME == "true") {
	require('nodetime').profile({
	    accountKey: 'fafe6e5e9c7f53864d60e809e821f1ca87521d82', 
	    appName: 'OSIRIS GUITAR'
	  });
	
	require('newrelic');
	console.log("Using production logging");
}
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var csrf = require('csurf');
var journalStore = require('./api/guitarjournalstore');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var GridStore = require('mongodb').GridStore;
var Binary = require('mongodb').Binary;
var mongoConnectionString = process.env.GITARRMONGO;
console.log("Connecting to ", mongoConnectionString);
var fs = require("fs");
var gm = require("gm");
var imageMagick = gm.subClass({ imageMagick: true });
var crypto = require("crypto");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var moment = require("moment");

express.static.mime.define({'application/font-woff': ['woff']});
journalStore.setConnectionString(mongoConnectionString);

process.on('uncaughtException', function(err) {
	var stacktrace;

	if (err && err.stack) {
		stacktrace = err.stack;
	} else {
		stacktrace = new Error().stack;
	}

	console.error(err, stacktrace);
});

process.on('error', function(err) {
	console.log("error!");
	console.log(err);
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({ key: 'GuitarJournal', secret: 'mongoVoldemort', cookie: { secure: true } }));
app.use(csrf());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
	    usernameField: 'email',
	    passwordField: 'password'
	},
  	function(username, password, done) {
  		console.log("Local strategy login", username, password);
  		journalStore.checkLogin(username, password, function(err, user) {
  			console.log("Checklogin callback", err, user);
  			return done(err, user);
  		});
 	}
));

passport.use(new FacebookStrategy({
		clientID: process.env.FB_APP_ID,
	    clientSecret: process.env.FB_APP_SECRET,
	    callbackURL: process.env.FB_APP_URL + "/auth/facebook/callback",
	    passReqToCallback: true
  	},
  	function(req, accessToken, refreshToken, profile, done) {
 		MongoClient.connect(mongoConnectionString, function(err, db) {
			if(err) { return done(err); }

			var users = db.collection('Users');
			users.findOne({ facebookId: profile.id }, function(err, user) {
			    if (err) {
   				    db.close();
			    	return done(err);
			    }
			    else
			    {
			    	req.session.fbAccessToken = accessToken;
			    	if (user === null) {
			    		user = {};
			    	}
		    		user.facebookId = profile.id;
		    		user.fullName = profile.displayName;
		    		user.username = profile.username;
		    		user.fbAccessToken = accessToken;
		    		users.save(user, { safe: true }, function(err, savedUser) {
		    			db.close();
		    			if (err)
		    				return done(err);
		    			else
		    				return done(null, user);
		    		});
			    }
	    	});
 		});
  	}
));

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	console.log('Trying to deserialize', id);
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return done(err); }

		var users = db.collection('Users');
		users.findOne({ _id: ObjectID(id) }, function(err, user) {
			db.close();
			done(err, user);
    	});
	});
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
  	return next(); 
  }
  res.redirect('/login');
}

app.get('/auth/allowsimple', function(req, res) {
	if (process.env.ALLOWSIMPLELOGIN)
		res.send(true);
	else
		res.send(false);
});

app.get("/api/sessiontest", function(req, res) {
	if (!req.session.created)
		req.session.created = new Date();

	res.json({"session": req.session, "port": process.env.PORT });
});

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'publish_actions' }));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback', function(req, res, next) {
	passport.authenticate('facebook', { failureRedirect: "/login" }, function(err, user, info) {
		console.log("Getting callback from FB", info);
	    if (err) { 
	    	console.log("Login error", err);
	    	return next(err); 
	    }
	    if (!user) { 
	    	console.log("No user");
	    	return res.redirect('/login'); 
	    }
	    req.logIn(user, function(err) {
	    	console.log("Logging in user");
	    	if (err) { 
	    		console.log("Error logging user in", err);
	    		return next(err); 
	      	}
	      	var expiration = new Date();
	      	expiration.setDate(expiration.getDate() + 365);
	    	res.cookie("hasloggedinwithfb", "true", { expires: expiration });
	    	console.log('Cookies', res.cookies);
	    	return res.redirect('/');
	    });
	  })(req, res, next);
});
/*app.get('/auth/facebook/callback',
 passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));*/

// One page app routing, the client-side app
// handles the internal routing.
app.get("/", function(req, res) {
	res.sendfile(__dirname + "/app/home.html");
});
app.get("/about", function(req, res) {
	res.sendfile(__dirname + "/about/about.html");
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

// Route for app resources like css and javascript
app.use('/app', express.static(__dirname + '/app'));

// Admin
app.use('/admin', express.static(__dirname + '/admin/dist'));

// Route for instrument images
app.use('/api/images', express.static(__dirname + '/api/images', { maxAge: 2592000000 }));

// Route for static about-site
app.use('/about', express.static(__dirname + '/about'));

app.get('/api/login',
	passport.authenticate('local'),
	function (req, res) {
		res.cookie('userid', req.user._id, { maxAge: 2592000000 });
		res.json(req.user);
	}
);

app.get('/api/logout', function(req, res) {
	res.clearCookie('userid');
	res.clearCookie('hasloggedinwithfb');
	req.logout();
	console.log("Logged out!");
	res.redirect("/");
});

app.post('/api/signup', function(req, res) {
	journalStore.checkIfUserExists(req.body.email, function(err, user) {
		if (err) {
			console.error(err);
		}

		if (user) {
			res.send(500, { message: "User already exists" });
		} else {
			journalStore.createUser(req.body, function(err, user) {
				//res.redirect('/api/login?email=' + req.body.email + '&password=' + req.body.password);
				res.json(user);
			});
		}
	});
});

app.get('/api/loggedin', function(req, res) {
	console.log('isAuthenticated', req.isAuthenticated());
	if (req.isAuthenticated()) {
		req.user._csrf = req.csrfToken();
		res.json(req.user);		
	} else {
		if (req.cookies.hasloggedinwithfb) {
			res.json({ _csrf: req.csrfToken(), autoTryFacebook: true });		
		}
		else {
			res.json({ _csrf: req.csrfToken(), autoTryFacebook: false });		
		}
	}
});

function checkLogin(req, res) {
	if (!req.session.loggedInUser)
	{
		res.send("401", "Not logged in");
		return null;
	}
	else
		return ObjectID(req.session.loggedInUser);
}

// API stuff
app.get("/api/sessions/:skip?", ensureAuthenticated, function(req, res) {
	var skip = req.params.skip ? parseInt(req.params.skip, 10) : 0;

	data = journalStore.getSessions(req.user._id, skip, function(err, items) {
		if (err) {
			console.error("Error when getting sessions", err);
			res.send(500, "An error occured when getting sessions");
		} else {
			res.json(items);
		}
	});
});

app.get("/api/statistics/overview/:days?", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;

	console.log('Request to', process.env.PORT);


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
   				}],
	   			function (err, agg) {
	   				if (err) {
	   					console.log(err);
	   					res.json();
	   					db.close();
	   					return;	   					
	   				}
	   				if (agg && agg.length > 0) {
	   					results.mostUsedInstrument = agg[0]._id;
	   				}
	   				db.close();
	   				res.json(results);
	   			});
   			});
		});
	});
});

app.get("/api/statistics/perweekday", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;

	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var sessions = db.collection('Sessions');
		sessions.aggregate(
			{ $match: { userId: loggedInUser } },
			{ $project: { weekDay: { $dayOfWeek: "$date" } }},
			{ $group: { _id: "$weekDay" , sessionCount: { $sum: 1 } } },
			{ $project: { _id: 0, weekDay: { $subtract: ["$_id", 1] }, sessionCount: 1 }},
			{ $sort: { weekDay: 1 } },
			function(err, aggregate) {
				if (err) {
					console.log(err);
				}
				db.close();
				res.json(aggregate);
			}
		);
	});
});

app.get("/api/statistics/perweek/:weeks?", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;

	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var sessions = db.collection('Sessions');
		sessions.aggregate(
			{ $match: { userId: loggedInUser } },
			{ $project: { week: { $week: "$date" }, year: { $year: "$date" }, length: 1 }},
			{ $group: { _id: { week: "$week", year: "$year" }, count: { $sum: 1 }, minutes: { $sum: "$length" } } },
			{ $project: { _id: 0, week: "$_id.week", year: "$_id.year", count: 1, minutes: 1 } },
			{ $sort: { year: -1, week: -1 } },
			{ $limit: Number(req.params.weeks) },
			{ $sort: { year: 1, week: 1 } },
			function(err, aggregate) {
				if (err) {
					console.log("Error", err);
				}

				db.close();
				res.json(aggregate);
			}
		);
	});
});

app.get("/api/statistics/minutesperday/:days?", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;
	var date = new Date();
	date = new Date(date.setDate(date.getDate() - req.params.days)); // Is this REALLY the easiest way?

	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var sessions = db.collection('Sessions');
		sessions.aggregate(
			{ $match: { userId: loggedInUser, date: { $gte: date } } },/*
			{ $project: { weekDay: { $dayOfWeek: "$date" } }},*/
			{ $group: { _id: { year: { $year: "$date" }, month: { $month: "$date" }, day: { $dayOfMonth: "$date" } }, totalMinutes: { $sum: "$length" } } },
			{ $sort: { _id: 1 } },
			function(err, aggregate) {
				db.close();
				res.json(aggregate);
			}
		);
	});
});


app.get("/api/session/:id", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;
	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('Sessions');
		collection.findOne({ _id: ObjectID(req.params.id), userId: loggedInUser }, function(err, item) {
			db.close();
			res.json(item);
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
			db.close();
			res.json(item);
		});
	});
});

app.post("/api/sessions", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;
	req.body.userId = req.user._id;

	console.log("/api/sessions: authed", loggedInUser, req.body.userId);

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
	if (req.body.startTime && req.body.endTime) {
		var start = moment(req.body.startDate);
		start.hour(req.body.startTime.split(":")[0]);
		start.minute(req.body.startTime.split(":")[1]);
		var end = moment(req.body.startDate);
		end.hour(req.body.endTime.split(":")[0]);
		end.minute(req.body.endTime.split(":")[1]);

		req.body.length = Math.round(moment.duration(end - start) / 60000);
	}
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('Sessions');
		collection.save(req.body, {safe:true}, function(err, savedSession) {
			db.close();
			res.json(savedSession);
		});
	});
});

app.get("/api/goals", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;

	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('Goals');
		collection.find({ "userId": loggedInUser }).sort({ completionDate: 1, title: 1 }).toArray(function(err, items) {
			if (err) {
				return (err);
			}
			db.close();
			res.json(items);
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
			db.close();
			res.json(savedSession);
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
			db.close();
			res.json(item);
		});
	});
});

app.get("/api/profile", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;

	console.log('Request to', process.env.PORT);

	// Connect to the db
	MongoClient.connect(mongoConnectionString, function(err, db) {
		if(err) { return console.dir(err); }

		var users = db.collection('Users');
		users.findOne({ _id: loggedInUser }, function(err, item) {
			db.close();
			res.json(item);
		});
	});
});

app.get("/api/instruments", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;

	console.log('Request to', process.env.PORT);

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
			db.close();
			res.json(items);
		});
	});
});

app.post("/api/instruments", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;
	var instrumentId;
	if (req.body._id) {
		req.body._id = ObjectID(req.body._id);
	}
	req.body.userId = loggedInUser;


	// Local function that saves, needed since the image resize ends in a callback
	var save = function() {
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
	};

	if (req.body.image) {
		var filename = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    		return v.toString(16);
		});
		console.log("saving");
		fs.writeFile("api/images/" + filename + ".jpg", req.body.image, 'base64', function(err) {
			if (err)
				return console.dir(err);
  			req.body.image = null;
  			req.body.imageFile = filename;
			save();
  		});
	}
	else {
		save();
	}

/*	if (req.body.image) {
		var imagebytes = [];
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
						req.body.image = Binary(imageStream);

						save();
					});
				});
		});

	}
	else
	{
		save();
	}*/


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
			var instruments = db.collection('Instruments');
			instruments.findOne({ _id: session.instrumentId }, function(err, instrument) {
				if (err)
					console.dir(err);
				else
					console.log("Instrument", session.instrumentId);
				var goals = db.collection('Goals');
				goals.findOne({ _id: session.goalId }, function(err, goal) {
					if (err)
						console.dir(err);
					var html = '<html>' +
						'<style>body { font-family:Arial,Helvetica; }</style>' +
						'<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# ogjournal: http://ogp.me/ns/fb/ogjournal#">\n' +
						'<link rel="stylesheet" href="/about/style.css">\n' +
						'<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Nobile%3A700&#038;subset=latin%2Clatin-ext&#038;ver=All" type="text/css" media="all" />\n' +
						'<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no">\n' +
						'<meta property="fb:app_id" content="151038621732407" />\n' +
		        		'<meta property="og:title" content="a ' + session.length + ' minute Practice Session" />\n';
		        		if (instrument) {
		        			html += '<meta property="og:image" content="http://journal.osirisguitar.com/api/images/' + instrument.imageFile + '.jpg" />\n';
		        			html += '<meta property="ogjournal:session_instrument" content="' + instrument.name + '" />';
		        		}
		        		html += '<meta property="og:url" content="http://journal.osirisguitar.com/api/practicesession/' + req.params.id + '" />\n' +
		        		/*'<meta property="fb:explicitly_shared" content="true"/>\n' + */
		        		'<meta property="og:type" content="ogjournal:practice_session" />\n';
		        		if (session.length)
		        			html += '<meta property="ogjournal:session_length" content="' + session.length + '" />\n';
		        		if (session.rating)
		        			html += '<meta property="ogjournal:session_rating" content="' + session.rating + '" />\n';	        		
		        		if (goal) {
		        			html += '<meta property="ogjournal:session_goal" content="' + goal.title + '" />\n';
		        		}
		        		html += '</head><body>' +
		        		'<div id="wrapper">\n' +
						'<img src="/about/og-logo.png">\n' +
						'<div class="content">\n';
		        		html += '<div class="session"><h1>A ' + session.length + ' minute Practice Session</h1>\n' +
		        		'<p>';
		        		if (instrument && instrument.imageFile) {
							html += '<img style="float:right;padding-left:10px;margin-top:0px;margin-bottom:20px;" src="http://journal.osirisguitar.com/api/images/' + instrument.imageFile + '.jpg">\n';
						}
		        		if (instrument) {
		        			html += '<b>Instrument:</b> ' + instrument.name + '<br>\n';
		        		}
		        		if (goal)
			        		html += '<b>Goal:</b> ' + goal.title + '<br>\n';
		        		if (session.rating)
			        		html += '<b>Rating:</b> ' + session.rating + '<br>\n';
		        		html += '</p></div><div class="about">Read more about the OSIRIS GUITAR Journal and <a href="/about">get your own account</a></div></div></div></body>';
					res.send(html);
					db.close();
				});
			});
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
			var imageBuffer = new Buffer(instrument.image, "base64");
			console.log("Sending image");
			res.send(imageBuffer);
			db.close();
		});
	});
});

app.get("/api/users", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;

	console.log("Checking user");

	if (loggedInUser != "512684441ea176ca050002b7") {
		res.status(401).send("You are not authorized to use this resource");
		return;
	}
	else {
		MongoClient.connect(mongoConnectionString, function(err, db) {
			if (err)
				return console.error(err);
			db.collection("Users").find().toArray(function(err, users) {
				if (err)
					return console.error(err);
				res.json(users);
				db.close();
			});
		});
	}
});

app.get("/api/user-objects/:id", ensureAuthenticated, function(req, res) {
	var loggedInUser = req.user._id;

	console.log("Checking user");

	if (loggedInUser != "512684441ea176ca050002b7") {
		res.status(401).send("You are not authorized to use this resource");
		return;
	}
	else {
		var userId = ObjectID(req.params.id);
		console.log("userId", userId);
		var returnData = {};

		MongoClient.connect(mongoConnectionString, function(err, db) {
			if (err)
				return console.error(err);
			db.collection("Users").findOne({ _id: userId }, function(err, user) {
				if (err)
					return console.error(err);
				returnData.user = user;
				db.collection("Sessions").find({ userId: userId }).toArray(function(err, sessions) {
				 	if (err)
				 		return console.error(err);
				 	returnData.sessions = sessions;

					db.collection("Instruments").find({ userId: userId }).toArray(function(err, instruments) {
					 	if (err)
					 		return console.error(err);
					 	returnData.instruments = instruments;
	
						db.collection("Goals").find({ userId: userId }).toArray(function(err, goals) {
							returnData.goals = goals;

							res.json(returnData);
							db.close();
						});
					});
				});
			});
		});
	}
});


var port = process.env.PORT || 80;
console.log("Listening to", port);
app.listen(port);