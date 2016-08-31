//页面字体大小全局改变
function caclFontSize() {
	var screenWid = document.documentElement.offsetWidth;	//测试window.screen.availWidth,window.screen.width在各平台、各浏览器有差异，故舍弃
	var fixWid = 320;	//设置页面宽度基准值
	var htmlFontSize = (screenWid / fixWid) * 20;	//字体大小比例，20为页面html样式字体大小
	document.documentElement.style.fontSize = htmlFontSize + 'px';
	//console.log(screenWid);
}


//执行函数
caclFontSize();
window.onresize = caclFontSize;
