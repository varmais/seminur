var sys 			= require('sys');
var exec 			= require('child_process').exec;
var imagePath 		= __dirname + '/uploads/';
var tempImagePath 	= __dirname + '/temp-images/';

function getUrl (text) {
	
	var url,
		regex = /((http|https|ftp|ftps))?\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/;
	
	text = text.replace(/\n/g, ' ');
	console.log('text: ' + text);
	
	if (text.match(regex)) {
		url = text.match(regex)[0];
		url = url.indexOf('"') === -1 ? url : url.substr(0, url.indexOf('"'));
	} else {
		url = null;
	}

	return url;
};

function cleanImageFolders() {
	exec('rm ' + tempImagePath + '*', function (err, stdout, stderr) { 
		console.log('Removing temporary images..');
		sys.puts(stdout);
	});
	exec('rm ' + imagePath + '*', function (err, stdout, stderr) { 
		console.log('Removing uploaded images..');
		sys.puts(stdout);
	});
}


exports.imagePath = imagePath;
exports.tempPath = tempImagePath;
exports.removeImages = cleanImageFolders;
exports.getUrl = getUrl;