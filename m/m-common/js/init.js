(function () {
	var calcFontSize = function() {
		var html            = document.documentElement;
		var defaultWidth    = 320;
		var defaultFontSize = 20;

		return function () {
			var currentWidth    = html.clientWidth;
			var currentFontSize = currentWidth / defaultWidth * defaultFontSize;
			if (currentWidth>1200) {
				html.style.fontSize = '20px';
			} else{
				html.style.fontSize = currentFontSize + 'px';
			}
		}
	}();

	calcFontSize();
	window.addEventListener('resize', calcFontSize);
})();

document.addEventListener('DOMContentLoaded', function(){
    this.documentElement.classList.add('loaded');
});