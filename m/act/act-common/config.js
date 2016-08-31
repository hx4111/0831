(function(W) {
	var pathHasM = /^\/m\//i.test(location.pathname);
	var base = pathHasM ? location.origin + '/m' : location.origin;

	W.CONFIG = {
		ajaxBase: 'http://proxy.icomico.com/', //测试：http://121.201.7.97/ 正式：http://proxy.icomico.com/
		rootUrl: base,
		readerBase: base + '/content/reader.html?',
		detailBase: base + '/content/detail.html?',
		listBase: base + '/list.html?',
		imgBase: 'http://cdn.icomico.com/',
		imgAlt: '可米酷漫画,comicool,手机漫画,原创漫画,漫画app',
		deviceID: '',
		isLogin: false
	};
})(window);

//页面字体大小全局改变
function caclFontSize() {
	var screenWid = document.documentElement.offsetWidth; //测试window.screen.availWidth,window.screen.width在各平台、各浏览器有差异，故舍弃
	var deviceSizeRatio = window.devicePixelRatio;
	var fixWid = 320; //设置页面宽度基准值
	var htmlFontSize = (screenWid / fixWid) * 20; //字体大小比例，20为页面html样式字体大小
	document.documentElement.style.fontSize = htmlFontSize + 'px';
}

function isIOS() {
	return /iPhone|iPod|iPad/i.test(navigator.userAgent);
}

function isAndroid() {
	return /Android/i.test(navigator.userAgent);
}

//执行函数
caclFontSize();
window.onresize = caclFontSize;

function isInternal() {
	return getChanel() == 'test' && location.hostname.indexOf('ismanhua') != -1; 
}

//渠道号是test调用测试接口
if (isInternal()) {
	CONFIG.ajaxBase = 'http://121.201.7.97/';
}
if (location.hostname.indexOf('192.168') != -1) {
	CONFIG.ajaxBase = 'http://121.201.7.97/';
}

//获取渠道号
function getChanel() {
	var urlCH = getQueryString('ch');
	var cookieCH = getCookie('_ch');
	var host = window.location.hostname;

	if (cookieCH != null) {
		if (urlCH != null) {
			if (urlCH === cookieCH) {
				return urlCH;
			} else {
				document.cookie = '_ch=' + urlCH + ';path=/;domain=' + host;
				return urlCH;
			}
		} else {
			return cookieCH;
		}
	} else {
		if (urlCH != null) {
			document.cookie = '_ch=' + urlCH + ';path=/;domain=' + host;
			return urlCH;
		} else {
			return null;
		}
	}
}
getChanel();

//获取页面URL参数名
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURI(r[2]);
	return null;
};

//设置cookies 
function setCookie(name, value, day) {
	var Days = day || 7;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ';path=/;domain=comicool.cn';
	return value;
};

//读取cookies 
function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg)) {
		return unescape(arr[2]);
	} else {
		return null;
	}
};

//删除cookies 
function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null) {
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ';path=/;domain=comicool.cn';
	}
};
//黑名单
var backlist = [
	1492
];
function blacklistFilter(comic_id) {
	if (isInternal()) {
		return comic_id;
	}
	for (var i = 0, len = backlist.length; i < len; i++) {
		if (comic_id == backlist[i]) {
			return 0;
		}
	}
	return comic_id;
}