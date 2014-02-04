var sys 			= require('sys');
var exec 			= require('child_process').exec;
var imagePath 		= __dirname + '/test-images/';
var tempImagePath 	= __dirname + '/temp-images/';

function getUrl (text) {
	
	var url,
		regex = /((http|https|ftp|ftps))?\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/;
	
	console.log('text: ' + text);
	
	if (text.match(regex)) {
		url = text.match(regex)[0];
		url = url.indexOf('"') === -1 ? url : url.substr(0, url.indexOf('"'));
	} else {
		url = "No URL found from the image.";
	}

	return url;
};

function cleanTempImageFolder() {
	exec('rm ' + tempImagePath + '*', function (err, stdout, stderr) { 
		console.log('Removing temporary images..');
		sys.puts(stdout);
	});
}


exports.imagePath = imagePath;
exports.tempPath = tempImagePath;
exports.removeTemp = cleanTempImageFolder;
exports.getUrl = getUrl;