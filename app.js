var express = require('express');
var app = express();

/*app.get("/", function(req, res) {
	res.send("Yippie!");
});*/

app.use('/app', express.static(__dirname + '/app'));
var port = process.env.PORT || 1337;
app.listen(port);