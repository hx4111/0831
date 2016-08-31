(function(win) {
	if (window["context"] == undefined) { //origin在IE8下不兼容
		if (!window.location.origin) {
			window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
		}
		window["context"] = location.origin + "/V6.0";
	}
	var domain = location.origin;
	var deviceID = getCookie('deviceID') || setCookie('deviceID', createDeviceID(), 9999);
	win.CONFIG = {
		ajaxBase: 'http://proxy.icomico.com/', //测试：http://121.201.7.97/ 正式：http://proxy.icomico.com/
		readerBase: domain + '/content/reader.html?',
		detailBase: domain + '/content/detail.html?',
		imgBase: 'http://cdn.icomico.com/',
		imgAlt: '可米酷漫画,comicool,手机漫画,原创漫画,漫画app',
		errorImg: domain + '/images/empty.jpg',
		placeholder: domain + '/images/blank.png',
		deviceID: deviceID,
		iconBase: 'http://cdn.icomicool.cn/images/icon/',
		filter: [263, 141, 142, 144, 145, 213, 223, 150, 185, 276, 202, 190, 283, 191, 139, 161, 170, 171, 215, 174, 175, 176, 181, 143, 183, 208, 184, 180, 178],
		postImgBase: 'http://up.cdn.icomico.com/', //贴吧图片前缀
		isPPTV:(window.location.host).indexOf("pptv.") != -1
	};
})(window);

function isInternal() {
	return getChanel() == 'test' && location.hostname.indexOf('ismanhua') != -1;
}

//渠道号是test调用测试接口
if (isInternal() || (location.hostname.indexOf('192.168') != -1) || (getChanel() == 'test' && location.hostname.indexOf('ismanhua') != -1)) {
	CONFIG.ajaxBase = 'http://121.201.7.97/';
}
//获取渠道号
function getChanel() {
	var urlCH = getQueryString('ch');
	var cookieCH = getCookie('_ch');
	var host = window.location.hostname;
	//	PPTV合作	判断域名是否是pptv.com
	if (CONFIG.isPPTV) {
		//	设置_ch为pptv
		setCookie('_ch', 'pptv','realTime');
	};
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
function setCookie(name, value, day, isGlobal) {
	var Days = day || 7; //此 cookie 将被保存 7 天
	var exp = new Date();
	var ckStr = ''
		//	设置时间为realTime,即关闭浏览器即失效
	if (day == "realTime") {
				ckStr = name + "=" + escape(value)+"";
	} else {
exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		ckStr = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	}

	ckStr += ";path=/";
	document.cookie = ckStr;
	//	return value;
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

//function delCookie(name){ 
//  var exp = new Date(); 
//  exp.setTime(exp.getTime() - 1); 
//  var cval=getCookie(name);
//  if(cval != "" && cval != null){
//      document.cookie= name + "="+cval+";expires="+exp.toGMTString() + ';path=/;domain=comicool.cn'; 
//  }
//};
//删除cookies 
function delCookie(name) {
	setCookie(name, "", -1);
}

//生成deviceID
function createDeviceID() {
	var timeStampToHex = 'a0' + new Date().getTime().toString(16).slice(-10);

	function hex4() {
		return ("0000" + Math.floor(Math.random() * 0x10000).toString(16)).slice(-4);
	}

	function hex8() {
		return ("00000000" + Math.floor(Math.random() * 0x100000000).toString(16)).slice(-8);
	}

	return timeStampToHex + hex8() + hex8() + hex4();
}

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