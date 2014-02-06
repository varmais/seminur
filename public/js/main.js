(function(window) {

	var openBtn = document.getElementById('open-button');
	var urlContainer = document.getElementById('url-container');

	if(openBtn && urlContainer) {
		openBtn.addEventListener('click', function() {
			var url = urlContainer.value;
			if (url.indexOf('http://') === -1) {
				url = 'http://' + url;
			}
			window.open(url, '_blank');
		});	
	}

}(window));