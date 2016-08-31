(function(){
	var topBarEle = document.querySelector("#topBar");
	var downlondEle = document.querySelector('#downlond');
	var pagesTopEle = document.querySelector('.pages_top');
	var pagesBotEle = document.querySelector('.pages_bot');
	var errorControl = document.querySelector('.item_loading_done');

	topBarEle.style.height = 0;
	downlondEle.style.height = 0;
	pagesTopEle.style.height = 0;
	pagesBotEle.style.height = 0;

	topBarEle.style.overflow = 'hidden';
	downlondEle.style.overflow = 'hidden';
	pagesTopEle.style.overflow = 'hidden';
	pagesBotEle.style.overflow = 'hidden';
	pagesTopEle.style.marginTop = 0;
	pagesBotEle.style.marginBottom = 0;

	if(errorControl != null){
		errorControl.style.paddingTop = '35%';
	}

})();