var express 	= require('express');
var http 		= require('http');
var path 		= require('path');
var ocr 		= require('nodecr');
var sys 		= require('sys');
var exec 		= require('child_process').exec;

var app = express();
var imagePath = __dirname + '/test-images/';
var tempImagePath = __dirname + '/temp-images/';

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


function convertImage(image, lang, callback) {
	
	var originalImage = imagePath + image;
	var imageName = "input_" + new Date().getTime() + '.tif';
	
	function saveImage(err, stdout, stderr) { 
		sys.puts(stdout);
		return callback(imageName, lang);
	}

	exec('convert ' + originalImage + ' -resize 500% -type Grayscale ' + tempImagePath + imageName, saveImage);
}

function getURL(text) {
	var regex = /((http|https|ftp|ftps))?\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/;
	console.log('text: ' + text);
	var url = text.match(regex)[0];
	return url.indexOf('"') === -1 ? url : url.substr(0, url.indexOf('"'));
}

app.get('/', function(req, res) {
	convertImage('test2.png', 'eng', function (image, lang) {
		ocr.process(tempImagePath + image, function(err, text) {
			if (err) {
				console.log(err);
			} else {
				var text = getURL(text);
				res.send(200, text);
			}
		}, lang);
	});
});



http.createServer(app).listen(app.get('port'), function() {
	console.log('On port: ' + app.get('port'));
});
