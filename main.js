var ocr = require('nodecr');
var sys = require('sys');
var exec = require('child_process').exec;

var imagePath = __dirname + '/test-images/';

function convertImage(image, lang, callback) {
	
	var originalImage = imagePath + image;
	var imageName = "input_" + new Date().getTime() + '.tif';
	
	function saveImage(err, stdout, stderr) { 
		sys.puts(stdout); 
		console.log('Saved temporary image: ' + imagePath + imageName);
		return callback(imageName, lang);
	}

	exec('convert ' + originalImage + ' -resize 500% -type Grayscale ' + imagePath + imageName, saveImage);
}

function getURL(text) {
	var regex = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/;
	var url = text.match(regex)[0];
	return url.indexOf('"') === -1 ? url : url.substr(0, url.indexOf('"'));
}

convertImage('anchor-text-image.png', 'eng', function (image, lang) {
	ocr.process(imagePath + image, function(err, text) {
		if (err) {
			console.log(err);
		} else {
			console.log('** output: ***');
			console.log(getURL(text));
		}
	}, lang);
});