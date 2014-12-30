'use strict';
/* jshint maxcomplexity: 10 */

var mongoDB = require('./mongodbService');

module.exports = {
  getPracticeSession: function(sessionId, callback) {
    var sessions = mongoDB.collection('Sessions');
    sessions.findOne({ _id: sessionId }, function(err, session) {
      var instruments = mongoDB.collection('Instruments');
      instruments.findOne({ _id: session.instrumentId }, function(err, instrument) {
        if (err) {
          return callback(err);
        }

        var goals = mongoDB.collection('Goals');
        goals.findOne({ _id: session.goalId }, function(err, goal) {
          if (err){
            return callback(err);
          }
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
                html += '<meta property="og:url" content="http://journal.osirisguitar.com/api/practicesession/' + sessionId + '" />\n' +
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
                if (goal) {
                  html += '<b>Goal:</b> ' + goal.title + '<br>\n';
                }
                if (session.rating) {
                  html += '<b>Rating:</b> ' + session.rating + '<br>\n';
                }
                html += '</p></div><div class="about">Read more about the OSIRIS GUITAR Journal and <a href="/about">get your own account</a></div></div></div></body>';
          callback(null, html);
        });
      });
    });
  },

  getPracticeSessionImage: function(sessionId, callback) {
    var instruments = mongoDB.collection('Instruments');
    instruments.findOne({ _id: sessionId }, function(err, instrument) {
      if (err) {
        return callback(err);
      }
      var imageBuffer = new Buffer(instrument.image, 'base64');
      callback(null, imageBuffer);
    });    
  }
};