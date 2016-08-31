
var $ = require('commonjs-zepto').$;

var pathHasM = /^\/m\//i.test(location.pathname);
var base = pathHasM ? location.origin + '/m' : location.origin;
var ua = navigator.userAgent.toLowerCase();

var CONFIG = {
	postBase: 'http://shop.ismanhua.com:8000/api/v1/', //云购请求地址  正式: http://shop.ismanhua.com:8000/api/v1/
	ygActId: 1, //云购活动Id
	ajaxBase: 'http://proxy.icomico.com/', //测试：http://121.201.7.97/ 正式：http://proxy.icomico.com/
	rootUrl: base,
	readerBase: base + '/content/reader.html?',
	detailBase: base + '/content/detail.html?',
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
		complete();
		return false;
	}

	var defaultData = {};
	if (CONFIG.isLogin) {
		var userinfo = CONFIG.p_userinfo;
		defaultData = {
			cc_id: userinfo.ccid,
			user_type: userinfo.usertype,
			cctoken: userinfo.cctoken,
			deviceid: userinfo.device_id
		};
	}
	var postData = options.data ? options.data : {};
	$.extend(postData, defaultData);
	console.info(CONFIG.postBase + options.url);
	$.ajax({
		url: CONFIG.postBase + options.url,
		type: 'GET',
		dataType: 'jsonp',
		data: postData,
		timeout: options.timeout || 15000,
		beforeSend: function() {
			$('html').addClass('loading-page');
		},
		success: function(data) {
			options.success && options.success(data);
		},
		complete: function(data) {
            $('.loading-spinner').hide();
			options.complete && options.complete(data);
			complete();
		},
		error: function(err, statu) {
			console.info('jsonp error...' + JSON.stringify(err) + JSON.stringify(statu));
			options.error && options.error(err);
		}
	})

	function complete() {
		$('html').removeClass('loading-page');
	}
}

/*function jsonp(options) {
	var src = CONFIG.postBase + options.url;
	var data = typeof options.data === 'object' ? options.data : {};
	//添加时间戳,防止缓存
	var timestamp = Date.parse(new Date());
	data['__t'] = timestamp;
	var defaultData = {};
	if (CONFIG.isLogin) {	
		var userinfo = CONFIG.p_userinfo;
		defaultData = {
			cc_id: userinfo.ccid,
			user_type: userinfo.usertype,
			cctoken: userinfo.cctoken,
			deviceid: userinfo.device_id
		}
	}
	// extendObj(data, defaultData);
	var qs = serialize(data);
	var script = document.createElement('script');
	var head = document.getElementsByTagName('head')[0];

	if (qs) {
		if (src.indexOf('?') > -1) {
			src += '&' + qs;
		} else {
			src += '?' + qs;
		}
	}

	console.info(src);
	window[options.data.callback] = options.success;
	script.src = src;
	head.appendChild(script);

	function serialize(data) {
		var arr = [];
		for (var n in data) {
			arr.push(n + '=' + data[n]);
		}
		return arr.join('&');
	}
}

function extendObj(obj, targetObj) {
	obj = obj ? obj : {};
	targetObj = targetObj ? targetObj : {};

	for (var key in targetObj) {
		if (targetObj.hasOwnProperty(key)) {
			obj[key] = targetObj[key];
		}
	}
	return obj;
}*/

module.exports.CONFIG = CONFIG;
module.exports.jsonp = jsonp;
module.exports.callAppFunction = callAppFunction;
module.exports.setByUserLoginStatus = setByUserLoginStatus;
