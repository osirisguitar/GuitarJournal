var express = require('express');
var app = express();

app.get("/", function(req, res) {
	res.redirect("/app/");
});

app.get("/app", function(req, res) {
	res.sendfile(__dirname + "/app/home.html");
});

app.use('/app', express.static(__dirname + '/app'));
var port = process.env.PORT || 1337;
app.listen(port);