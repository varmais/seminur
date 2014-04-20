var express 	= require('express');
var http 		= require('http');
var path 		= require('path');
var mmm			= require('mmmagic');
var util		= require('./util.js');
var fs			= require('fs');
var ocr 		= require('nodecr');
var sys 		= require('sys');
var exec 		= require('child_process').exec;
var Magic 		= require('mmmagic').Magic;
var magic 		= new Magic();

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser('pipeline'));
app.use(express.session());
app.use(express.compress());
app.use(express.limit('2mb'));
app.use(app.router);
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res) {
	res.render('index');
});

app.post('/upload', function(req, res) {
	console.log('Getting image');
	fs.readFile(req.files.image.path, function(err, data) {

		var imageName = req.files.image.name;

		if(!imageName) {
			console.log('Error occured during upload.')
			res.render('index', {
				error: 'Error during upload.'
			});			
		} else {
			var uploadedImage = __dirname + '/tmp/uploads/' + imageName;
			console.log('Uploaded image: ' + uploadedImage);
			fs.writeFile(uploadedImage, data, function(err) {
				magic.detectFile(uploadedImage, function(err, result) {
					
					if (err) console.log(err);
					console.log('mime: ' + result);
					if (result.indexOf('JPEG image data') === 0 || result.indexOf('PNG image data') === 0) {
						console.log('Redirecting user..');
						res.redirect('/open/' + imageName);	
					} else {
						util.removeImages();
						res.render('index', {
							error: 'Unsupported file type.'
						});
					}
				});	
			});
		}
	});
});

app.get('/open/:image', function(req, res) {
	
    var image = req.params.image;
    var lang = 'eng';
	var originalImage = util.imagePath + image;
	var tempImage = util.tempPath + "input_" + new Date().getTime() + '.tif';
	
	exec('convert ' + originalImage + ' -resize 250% -type Grayscale ' + tempImage, function (err, stdout, stderr) { 
		sys.puts(stdout);
		ocr.process(tempImage, function(err, text) {
			if (err) {
				console.log(err);
				res.render('open', {
					error: 'Could not find the image.'
				});
			} else {
				var response = util.getUrl(text);
				if(response == null) {
					res.render('open', {
						error: 'Could not find URL from the image.'
					});
				} else {
					res.render('open', {
						success: response
					});	
				}
				util.removeImages();
			} 
		});
	});
});


http.createServer(app).listen(app.get('port'), function() {
	console.log('On port: ' + app.get('port'));
});
