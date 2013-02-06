var express = require('express');
var app = express();

/*app.get("/", function(req, res) {
	res.send("Yippie!");
});*/

app.use('/app', express.static(__dirname + '/app'));

app.listen();