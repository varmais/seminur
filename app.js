var express 	= require('express');
var http 		= require('http');
var path 		= require('path');
var util		= require('./util.js');
var fs			= require('fs');
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
app.use(express.limit('5mb'));
app.use(app.router);
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res) {
	res.render('index', {
		pageTitle: 'OCR Test'
	});
});

app.post('/upload', function(req, res) {

	fs.readFile(req.files.image.path, function(err, data) {

		var imageName = req.files.image.name;

		if(!imageName) {
			console.log('Error during upload.');
			res.redirect('/');
			res.end();
		} else {
			var uploadedImage = __dirname + '/uploads/' + imageName;

			fs.writeFile(uploadedImage, data, function(err) {
				res.redirect('/open/' + imageName);
			});
		}
	});
});

app.get('/open/:image', function(req, res) {
	
    var image = req.params.image;
    var lang = 'eng';
	var originalImage = util.imagePath + image;
	var tempImage = util.tempPath + "input_" + new Date().getTime() + '.tif';
	
	exec('convert ' + originalImage + ' -resize 850% -type Grayscale ' + tempImage, function (err, stdout, stderr) { 
		sys.puts(stdout);
		ocr.process(tempImage, function(err, text) {
			if (err) {
				console.log(err);
				res.render('index', {
					pageTitle: 'OCR Test',
					errorMessage: 'Could not find the image.'
				});
			} else {
				res.send(200, util.getUrl(text));
				util.removeImages();
			} 
		});
	});
});


http.createServer(app).listen(app.get('port'), function() {
	console.log('On port: ' + app.get('port'));
});
