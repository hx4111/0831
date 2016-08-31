(function(W) {
	var pathHasM = /^\/m\//i.test(location.pathname);
	var base = pathHasM ? location.origin + '/m' : location.origin;

	W.CONFIG = {
		ajaxBase: 'http://proxy.icomico.com/', //测试：http://121.201.7.97/ 正式：http://proxy.icomico.com/
		rootUrl: base,
		readerBase: base + '/content/reader.html?',
		detailBase: base + '/content/detail.html?',
		postBase: base + '/content/post-detail.html?',
		listBase: base + '/list.html?',
		imgBase: 'http://cdn.icomico.com/',
		imgAlt: '可米酷漫画,comicool,手机漫画,原创漫画,漫画app',
		iconBase: 'http://cdn.icomicool.cn/gcommon/images/icon/',
		postImgBase: 'http://up.cdn.icomico.com/', //贴吧图片前缀
		deviceID: '',
		isLogin: false,
		errorImg: 'http://www.comicool.cn/images/empty.jpg',
		defaultAvatar: 'http://cdn.icomicool.cn/m/act/act-common/images/default_avatar.png'
	};
})(window);

// 判断类型
var ua = navigator.userAgent.toLowerCase(),
	isMobile = ua.indexOf('mobile') > 0,
	isWeixin = (/micromessenger/.test(ua)) ? true : false,
	isQQ = (/qq\//.test(ua)) ? true : false,
	isIOS = ua.indexOf('(ip') > 0 && isMobile,
	isWeibo = (/Weibo/i.test(ua)) ? true : false,
	isApp = (/icomico/i.test(ua)) ? true : false,
	isIOSApp = (/icomico_ios./i.test(ua)) ? true : false,
	isAndroidApp = (/icomico_adr./i.test(ua)) ? true : false,
	isChrome = /crios/.test(ua) ? true : false,
	isUC = /ucbrowser/.test(ua) ? true : false,
	isQQ = /mqq/.test(ua) ? true : false,
	isOpera = /opios/.test(ua) ? true : false;

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
if (location.hostname.indexOf('192.168') != -1 || isInternal()) {
	CONFIG.ajaxBase = 'http://121.201.7.97/';
}
//获取渠道号
function getChanel() {
	var urlCH = getQueryString('ch'),
		cookieCH = getCookie('_ch'),
		host = window.location.hostname,
		isPptvUrl = host.indexOf("pptv.") != -1;
	//	PPTV合作	判断域名是否是pptv.com
	if (urlCH != null && urlCH != cookieCH) {
		setCookie('_ch', urlCH, 'realTime');
		return urlCH;
	} else if (isPptvUrl && (urlCH = '' || urlCH == null)) {
		//	设置_ch为pptv
		setCookie('_ch', 'pptv', 'realTime');
		return getCookie('_ch');
	} else if (cookieCH) {
		return getCookie('_ch');
	} else {
		return '';
	}
}
(function() {
	var channel = getCookie('_ch');
	if (channel == 'pptv') {
		try {
			$('.publish_betting').hide();
		} catch (e) {
			//TODO handle the exception
		}
	}
})();

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
		ckStr = name + "=" + escape(value) + ";domain=comicool.cn";
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

//删除cookies 
function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null) {
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	}
};

//pause活动关闭
function status(messages) {
	var status = getQueryString("status");
	if ((status !== undefined || status != null) && status == "pause") {
		document.body.innerHTML = '<div style="background:#000;position: fixed;text-align: center;width: 100%;height: 100%;top: 0;color:#fff;z-index: 9999;overflow: hidden;font-size: .8rem;"><li style="position: absolute;left:50%;top:50%;-webkit-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);transform: translate(-50%, -50%);">' + messages + '</li></div>';
	}
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
// 分类颜色背景色
function getCategoryColorByID(categoryID, alpha) {
	if (categoryID == 10 || categoryID == 16 || categoryID == 21) {
		//		科幻 历史 动作
		var color = alpha ? 'rgba(56,164,214,' + alpha + ')' : '#2cafe6';
	} else if (categoryID == 11 || categoryID == 20 || categoryID == 22 || categoryID == 24) {
		//		恋爱 美食 耽美 情感
		var color = alpha ? 'rgba(255,91,152,' + alpha + ')' : '#ff5b98';
	} else if (categoryID == 12 || categoryID == 17 || categoryID == 19) {
		//		校园 冒险 体育
		var color = alpha ? 'rgba(72,204,141,' + alpha + ')' : '#48cc8d';
	} else if (categoryID == 13 || categoryID == 14 || categoryID == 28) {
		//		恐怖 悬疑 剧情
		var color = alpha ? 'rgba(168,117,237,' + alpha + ')' : '#a875ed';
	} else if (categoryID == 15 || categoryID == 18 || categoryID == 23) {
		//		搞笑 幻想 日常
		var color = alpha ? 'rgba(255,103,23,' + alpha + ')' : '#ff6717';
	} else if (categoryID >= 100 && categoryID < 200) {
		var color = alpha ? 'rgba(44,175,230,' + alpha + ')' : '#2cafe6';
	} else if (categoryID >= 200 && categoryID < 300) {
		var color = alpha ? 'rgba(255,91,152,' + alpha + ')' : '#ff5b98';
	} else if (categoryID >= 300 && categoryID < 400) {
		var color = alpha ? 'rgba(72,204,141,' + alpha + ')' : '#48cc8d';
	} else if (categoryID >= 400 && categoryID < 500) {
		var color = alpha ? 'rgba(255,103,23,' + alpha + ')' : '#ff6717';
	} else {
		var color = alpha ? 'rgba(168,117,237,' + alpha + ')' : '#a875ed';
	}
	return color;
}