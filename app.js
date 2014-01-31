var express 	= require('express');
var http 		= require('http');
var path 		= require('path');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('pipeline'));
app.use(express.session());
app.use(express.compress());
app.use(app.router);
app.use(express.static(path.join(__dirname, '/public')));


app.get('/', function(req, res) {
	res.send(200, 'hello');
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('On port: ' + app.get('port'));
});
