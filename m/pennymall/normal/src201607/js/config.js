// var debug = true;
var isTest = /192.168|localhost/i.test(location.origin);
var pathHasM = /^\/m\//i.test(location.pathname);
var base = pathHasM ? location.origin + '/m' : location.origin;
var ua = isTest ? 'icomico_adr.Mozilla/5.0 (Android; Mobile; rv:14.0) Gecko/14.0 Firefox/14.0' : navigator.userAgent.toLowerCase();
// var ua = isTest && !debug ? 'icomico_adr.Mozilla/5.0 (Android; Mobile; rv:14.0) Gecko/14.0 Firefox/14.0' : navigator.userAgent.toLowerCase();

var CONFIG = {
	postBase: 'http://shop.comicool.cn/api/v1/', //云购请求地址 'http://shop.ismanhua.com:8000/api/v1/' 正式：http://shop.comicool.cn/api/v1/
	ygActId: 10, //云购活动Id
	ajaxBase: 'http://proxy.icomico.com/', //测试：http://121.201.7.97/ 正式：http://proxy.icomico.com/
	rootUrl: base,
	readerBase: base + '/content/reader.html?',
	detailBase: base + '/content/detail.html?',
	pennymallDetail: isTest ? base + '/detail.html?' : base + '/pennymall/normal/dist/detail.html?',
	postPage: isTest ? base + '/post.html?' : base + '/pennymall/normal/dist/post.html?',
	listBase: base + '/list.html?',
	imgBase: 'http://cdn.icomicool.cn/',
	imgAlt: '可米酷漫画,comicool,手机漫画,原创漫画,漫画app',
	deviceID: '',
	isLogin: false,
    postImgBase: 'http://up.cdn.icomico.com/', //贴吧图片前缀
    ua: ua,
	isMobile: ua.indexOf('mobile') > 0,
	isWeixin: (/micromessenger/.test(ua)) ? true : false,
	isQQ: (/qq\//.test(ua)) ? true : false,
	isIOS: ua.indexOf('(ip') > 0 && this.isMobile,
	isWeibo: (/Weibo/i.test(ua)) ? true : false,
	isApp: (/icomico/i.test(ua)) ? true : false,
	isIOSApp: (/icomico_ios./i.test(ua)) ? true : false,
	isAndroidApp: (/icomico_adr./i.test(ua)) ? true : false,
};

var callAppFunction = function(func, args, callback) {
	var argsString = JSON.stringify(args);
	if (CONFIG.isAndroidApp) {
		if (!comicool) {
			return false;
		}
		var result = eval("comicool." + func + "('" + argsString + "');");
		if (callback) {
			callback(result);
		}
	} else if (CONFIG.isIOSApp) {
		function handleCallback(func, args) {
			if (func != "setJSCallback") {
				return;
			}
			for (var eventName in args) {
				(function(eventName) {
					window.WebViewJavascriptBridge.registerHandler(args[eventName], function(data, responseCallback) {
						var appDataStr = JSON.stringify(data);
						eval(args[eventName] + "('" + appDataStr + "');");
					});
				})(eventName);
			}
		}

		if (window.WebViewJavascriptBridge) {
			window.WebViewJavascriptBridge.callHandler(func, argsString, callback);
			handleCallback(func, args);
		} else {
			document.addEventListener('WebViewJavascriptBridgeReady', function() {
				window.WebViewJavascriptBridge.callHandler(func, argsString, callback);
				handleCallback(func, args);
			}, false);
		}
	} else {
		return false;
	}
	return true;
}

function setByUserLoginStatus(callbacks) {
	var userInfo = {};
	var done = [];
	var isLogin = callbacks.isLogin;
	var unLogin = callbacks.unLogin;
	var all = callbacks.all;
	var loginState = false;
	var cb = function(i) {
		done.push(i);

		//所有异步任务完成
		if (fnQueue.length === done.length) {
			if (userInfo.hasOwnProperty('ccid') &&
				userInfo.hasOwnProperty('cctoken') &&
				typeof isLogin === 'function') {
				loginState = true;
				isLogin(userInfo);
			} else if (typeof unLogin === 'function') {
				unLogin(userInfo);
			}
			typeof all === 'function' && all(userInfo, loginState);
		}
	};
	var fnQueue = [
		function(i) {
			callAppFunction('getDeviceID', {}, function(DeviceID) {
				userInfo.device_id = DeviceID;
				cb(i);
			});
		},
		function(i) {
			callAppFunction('getChannelId', {}, function(ChannelId) {
				userInfo.channel = ChannelId;
				cb(i);
			});
		},
		function(i) {
			callAppFunction('getAppVersionName', {}, function(AppVersionName) {
				userInfo.version_code = AppVersionName.split('.').pop();
				cb(i);
			});
		},
		function(i) {
			if (CONFIG.isIOSApp) {
				userInfo.os_type = 'ios';
			} else if (CONFIG.isAndroidApp) {
				userInfo.os_type = 'anr';
			}
			cb(i);
		},
		function(i) {
			callAppFunction('getAccountInfo', {}, function(result) {
				if (CONFIG.isAndroidApp) {
					result = result ? JSON.parse(result) : {};
				}
				for (var n in result) {
					if (result.hasOwnProperty(n)) {
						userInfo[n] = result[n];
					}
				}
				cb(i);
			});
		}
	];
	fnQueue.forEach(function(fn, i) {
		fn(i);
	});
}

function jsonp(options) {
	if (options.beforeSend && (options.beforeSend() === false)) { //如果填写了beforSend且返回值为false
		return false;
	}
	var jsonpData = options.data || {};
	var loadingShow = options.showLoading ? false : true;

	if (CONFIG.isLogin) {
		$.extend(jsonpData, CONFIG.p_userinfo);
		jsonpData.cc_id = CONFIG.p_userinfo.ccid;
	}
	console.info(jsonpData);
	$.ajax({
		url: CONFIG.postBase + options.url,
		dataType: 'jsonp',
		data: jsonpData,
		timeout: options.timeout || 15000,
		beforeSend: function() {
			if (loadingShow) {
				$('.loading').show();
			} 
		},
		success: function(data) {
			if (data.code) {
				jsonpError(data.code);
				return ;
			}
			options.success && options.success(data);
		},
		error: function(err, statu) {
			options.error && options.error();
			console.info('error : ' + options.url);
			new TipBox({str: '请求出错,请重试'});
		},
		complete: function() {
			options.complete && options.complete();
			$('.loading').hide();
		}
	});

	function jsonpError(code) {
		var msg = code;
		switch(code) {
			case 1002:
				msg = '酷币余额不足';
				break;
			case 1003: 
				msg = '参数错误';
				break;
			case 2001: 
				msg = '商品已售完';
				break;
		}

		new TipBox({str: msg});
	}
}

function setShareInfo(shareInfo, setBrowserShare) {
	if (CONFIG.isApp) {
		//TODO:直接传入shareInfo不起作用
		shareInfo = {
			title: shareInfo.title,
			describe: shareInfo.describe,
			imageurl: shareInfo.imageUrl,
			pageUrl: shareInfo.pageUrl
		};
		callAppFunction('showShareBtn', shareInfo);
	} else if (setBrowserShare) {
		var browserShare = {
			'baidu': function() {
				window._bd_share_config = {
					common: {
						bdText: shareInfo.title,
						bdDesc: shareInfo.describe,
						bdUrl: shareInfo.pageUrl,
						bdPic: shareInfo.imageUrl
					},
					share: [{
						"bdSize": 32
					}]
				};
				with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5)];
			}
		};

		browserShare[setBrowserShare.use]();
		setBrowserShare.init.call(shareInfo);
	}
}

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
		ckStr = name + "=" + escape(value) + "";
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

function showMask() {
	$('body').css("overflow","hidden")
	$(".pageCover").show();
}

function hideMask() {
	$('body').css("overflow","auto")
	$(".pageCover").hide();
}

function changeNum(num) {
    var res = Number(num);
    if (res < 10) {
        return '0' + res;
    }
    return res + '';
}

// 时间戳(精确到秒)转 yyyy-mm-dd HH:MM:SS
function dateFmt(dateTime) {
	var tempDateTime = dateTime ? dateTime*1000 : new Date().getTime();
	var dateTrans = new Date(tempDateTime);
	return changeNum(dateTrans.getMonth()+1)  + '-'
		+ changeNum(dateTrans.getDate()) + ' '
		+ changeNum(dateTrans.getHours()) + ':'
		+ changeNum(dateTrans.getMinutes()) + ':'
		+ changeNum(dateTrans.getSeconds());
}
