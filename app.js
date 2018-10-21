var express = require('express');
var bodyParser 	= require('body-parser');
var https = require('https');
var http = require('http');
var fs = require('fs');

var app = express();
var router = express.Router({mergeParams: true});

var credentials = {
  key: fs.readFileSync('client-key.pem'),
  cert: fs.readFileSync('client-cert.pem')
};

//this will allow serving files in /bower_components at /bower_components
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use(express.static('views')); //this will allow serving files in /views at /
app.use('/views', express.static('views')); //this will allow serving files in /views at /views

// Parse JSON objects
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database
var mysql = require('mysql')
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'ygmfromthuya',
  database : 'demo',
  insecureAuth : true
});

db.connect();



// API Routes

router.post('/echo', function(req, res){
	res.json(req.body);
});

router.post('/postmessage', function(req, res){
  console.log("post postmessage " + req.body);
  var sql = "INSERT INTO table1 (message, username, parentid, lat, lng, temp) VALUES (?,?,?,?,?,?)";
  db.query(sql, [req.body.message, req.body.username, req.body.parentid, req.body.lat, req.body.lng, req.body.temp], function (err, result) {
    if (err) throw err;
    var insertId = result.insertId;
    console.log("1 record inserted: " + insertId);
    db.query("SELECT * FROM table1 WHERE ID = ?", [insertId], function (err, result) {
      if (err) throw err;
      res.json(result)
    });
  });
});


router.post('/getmessages', function(req, res){
    db.query("SELECT * FROM table1 WHERE username = ? ORDER BY parentid, created_date", [req.body.username], function (err, result) {
      if (err) throw err;
      res.json(result)
    });
});

router.use(function(req, res, next){
	res.status(404).send('API not found');
	next();
});

app.use('/api', router);



// Static pages

app.get('/hello', function(req, res){
	res.sendFile(__dirname+'/views/hello.html');
});

app.get('/*', function(req, res){
	res.sendFile(__dirname+'/views/index.html');
});




// Server config

// var server = app.listen(3000, function () {
//     var host = server.address().address;
//     var port = server.address().port;

//     console.log('Example app listening at http://localhost:3000');
// });


// Create an HTTP service.
// var server = http.createServer(app).listen(3000);
// Create an HTTPS service identical to the HTTP service.
// https.createServer(options, app).listen(443);


// var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

// httpServer.listen(8080);
// httpsServer.listen(8443);


var server = https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(3000, function () {
  console.log('Example app listening on port 3000! Go to https://localhost:3000/')
})


module.exports = server