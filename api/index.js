var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var csrf = require('csurf');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var mongoConnectionString = process.env.GITARRMONGO;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var mongodbService = require('./services/mongodbService');
var sessionRoutes = require('./routes/sessionRoutes');
var statisticsRoutes = require('./routes/statisticsRoutes');
var goalRoutes = require('./routes/goalRoutes');
var instrumentRoutes = require('./routes/instrumentRoutes');
var practiceSessionRoutes = require('./routes/practiceSessionRoutes');
var authenticationRoutes = require('./routes/authenticationRoutes');
var authenticationService = require('./services/authenticationService');
var adminRoutes = require('./routes/adminRoutes');

express.static.mime.define({'application/font-woff': ['woff']});

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
  console.log('error!');
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
      authenticationService.checkLogin(username, password, function(err, user) {
        return done(err, user);
      });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
      callbackURL: process.env.FB_APP_URL + '/auth/facebook/callback',
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
  MongoClient.connect(mongoConnectionString, function(err, db) {
    if(err) { return done(err); }

    var users = db.collection('Users');
    users.findOne({ _id: new ObjectID(id) }, function(err, user) {
      db.close();
      done(err, user);
      });
  });
});

function ensureAuthenticated(req, res, next) {
  req.isAuthenticated = function() {
    return true;
  };

  req.user = {
    _id: new ObjectID("512684441ea176ca050002b7")
  };

  return next();

  /*if (req.isAuthenticated()) { 
    return next(); 
  }
  res.redirect('/login');*/
}

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'publish_actions' }));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback', function(req, res, next) {
  passport.authenticate('facebook', { failureRedirect: '/login' }, function(err, user, info) {
      if (err) { 
        console.error('Login error', err);
        return next(err); 
      }
      if (!user) { 
        console.error('No user');
        return res.redirect('/login'); 
      }
      req.logIn(user, function(err) {
        if (err) { 
          console.error('Error logging user in', err);
          return next(err); 
          }
          var expiration = new Date();
          expiration.setDate(expiration.getDate() + 365);
        res.cookie('hasloggedinwithfb', 'true', { expires: expiration });
        return res.redirect('/');
      });
    })(req, res, next);
});

// Admin
app.use('/admin', express.static(__dirname + '/admin/dist'));

// Route for instrument images
app.use('/images', express.static(__dirname + '/images', { maxAge: 2592000000 }));

// Route for static about-site
app.use('/about', express.static(__dirname + '/about'));

app.get('/login', passport.authenticate('local'), authenticationRoutes.login);
app.get('/logout', authenticationRoutes.logout);
app.get('/auth/allowsimple', authenticationRoutes.allowSimpleLogin);
app.post('/signup', authenticationRoutes.signup);
app.get('/loggedin', authenticationRoutes.loggedIn);
app.post('/forgotpassword', authenticationRoutes.sendPasswordReminder);
app.post('/setpassword', authenticationRoutes.setPassword);

app.get('/profile', ensureAuthenticated, function(req, res) {
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

// Session routes
app.get('/sessions/:skip?', ensureAuthenticated, sessionRoutes.getSessions);
app.post('/sessions', ensureAuthenticated, sessionRoutes.saveSession);
app.get('/session/:id', ensureAuthenticated, sessionRoutes.getSession);
app.delete('/session/:id', ensureAuthenticated, sessionRoutes.deleteSession);

// Statistics routes
app.get('/statistics/overview/:days?', ensureAuthenticated, statisticsRoutes.getOverview);
app.get('/statistics/perweekday', ensureAuthenticated, statisticsRoutes.getPerWeekday);
app.get('/statistics/perweek/:weeks?', ensureAuthenticated, statisticsRoutes.getPerWeek);
app.get('/statistics/minutesperday/:days?', ensureAuthenticated, statisticsRoutes.getMinutesPerDay);

// Goal routes
app.get('/goals', ensureAuthenticated, goalRoutes.getGoals);
app.post('/goals', ensureAuthenticated, goalRoutes.saveGoal);
app.delete('/goal/:id', ensureAuthenticated, goalRoutes.deleteGoal);

// Instrument routes
app.get('/instruments', ensureAuthenticated, instrumentRoutes.getInstruments);
app.post('/instruments', ensureAuthenticated, instrumentRoutes.saveInstrument);
app.delete('/instrument/:id', ensureAuthenticated, instrumentRoutes.deleteInstrument);

// Practice session (public) routes
app.get('/practicesession/:id', practiceSessionRoutes.getPracticeSession);
app.get('/practicesessionimage/:id', practiceSessionRoutes.getPracticeSessionImage);

// Admin routes
app.get('/users', ensureAuthenticated, adminRoutes.getUsers);
app.get('/user-objects/:id', adminRoutes.getUserObjects);

mongodbService.init(mongoConnectionString, function() {
  var port = process.env.PORT || 80;
  console.log('Listening to', port);
  app.listen(port); 
});

