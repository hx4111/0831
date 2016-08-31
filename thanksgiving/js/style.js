//页面字体大小全局改变
function caclFontSize() {
	var screenWid = document.documentElement.offsetWidth;	//测试window.screen.availWidth,window.screen.width在各平台、各浏览器有差异，故舍弃
	var deviceSizeRatio = window.devicePixelRatio;
	var fixWid = 320;	//设置页面宽度基准值
	var htmlFontSize = (screenWid / fixWid) * 20;	//字体大小比例，20为页面html样式字体大小
	document.documentElement.style.fontSize = htmlFontSize + 'px';
}

//执行函数
caclFontSize();
window.onresize = caclFontSize;

//设置常用变量
var ua = navigator.userAgent.toLowerCase();
var isMobile = ua.indexOf('mobile') > 0;
var isWeixin = (/micromessenger/.test(ua)) ? true : false;
var isQQ = (/qq\//.test(ua)) ? true : false;
var isIOS = ua.indexOf('(ip') > 0 && isMobile;
var isWeibo = (/Weibo/i.test(ua)) ? true : false;
var isAndr = ua.indexOf('android') > -1 || ua.indexOf('linux') > -1;
var isApp = (/icomico/i.test(ua)) ? true : false;

	//获取页面URL参数名
	function getQueryString(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) return decodeURI(r[2]); return null;
	}
var cc_id = getQueryString('cc_id');

if(isQQ || isWeixin){
	$(".install_comi").on("click",function(e){
		e.preventDefault();
		$("#ShareBg").show();
		$(".share_tip").show();
	})
	
$(".share_tip").on("click",function(){
	$("#ShareBg").hide();
		$(".share_tip").hide();
})	
}