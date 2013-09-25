var express = require('express');
var app = express();
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

express.static.mime.define({'application/font-woff': ['woff']});

journalStore.setConnectionString(mongoConnectionString);

process.on('uncaughtException', function(err) {
	console.log(err);
});

process.on('error', function(err) {
	console.log(err);
});

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
  		journalStore.checkLogin(username, password, function(err, user) {
  			return done(err, user);
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
			    if (err) {
   				    db.close();
			    	return done(err);
			    }
			    else
			    {
			    	if (user === null) {
			    		var newUser = {};
			    		newUser.facebookId = profile.id;
			    		newUser.fullName = profile.displayName;
			    		newUser.username = profile.username;
			    		users.save(newUser, { safe: true}, function(err, user) {
			    			db.close();
			    			if (err)
			    				return done(err);
			    			else
			    				return done(null, user);
			    		});
			    	}
			    	else {
			    		db.close();
				      	return done(null, user);			    	
			    	}
			    }
	    	});
 		});
  	}
));

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
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

// Route for static about-site
app.use('/about', express.static(__dirname + '/about'));

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
			{ $project: { week: { $week: "$date" }, length: 1 }},
			{ $group: { _id: "$week" , count: { $sum: 1 }, minutes: { $sum: "$length" } } },
			{ $project: { _id: 0, week: "$_id", count: 1, minutes: 1 } },
			{ $sort: { week: -1 } },
			{ $limit: Number(req.params.weeks) },
			{ $sort: { week: 1 } },
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
						req.body.image = imageData;

						save();
					});
				});
		});

	}
	else
	{
		save();
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
		        			html += '<meta property="og:image" content="http://journal.osirisguitar.com/api/practicesessionimage/' + session.instrumentId + '" />\n';
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
		        		html += '<div style="float:left"><h1>A ' + session.length + ' minute Practice Session</h1>\n' +
		        		'<p>';
		        		if (instrument) {
							html += '<img style="float:right;padding-left:10px;margin-top:0px;margin-bottom:20px;" src="http://journal.osirisguitar.com/api/practicesessionimage/' + session.instrumentId + '">\n';
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
			console.log(instrument.image);
			res.send(instrument.image.buffer);
			db.close();
		});
	});
});

var port = process.env.PORT || 80;
app.listen(port);