var express 	= require('express');
var http 		= require('http');
var path 		= require('path');
var util		= require('./util.js');
var ocr 		= require('nodecr');
var sys 		= require('sys');
var exec 		= require('child_process').exec;

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
	res.send(200, 'jooh');
});

app.get('/test', function(req, res) {
	
    var image = 'test1.png', lang = 'eng';
	var originalImage = util.imagePath + image;
	var tempImage = util.tempPath + "input_" + new Date().getTime() + '.tif';
	
	exec('convert ' + originalImage + ' -resize 850% -type Grayscale ' + tempImage, function (err, stdout, stderr) { 
		sys.puts(stdout);
		ocr.process(tempImage, function(err, text) {
			if (err) {
				console.log(err);
				res.send(200, err);
			} else {
				res.send(200, util.getUrl(text));
				util.removeTemp();
			} 
		});
	});
});


http.createServer(app).listen(app.get('port'), function() {
	console.log('On port: ' + app.get('port'));
});
