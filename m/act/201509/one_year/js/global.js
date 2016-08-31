(function () {
	var caclFontSize = function () {
		var screenWidth = document.documentElement.offsetWidth;
		var deviceSizeRatio = window.devicePixelRatio;
		var baseWidth = 320;
		var htmlFontSize = (screenWidth / baseWidth) * 10;
		document.documentElement.style.fontSize = htmlFontSize + 'px';
	};

	caclFontSize();
	window.addEventListener('resize', caclFontSize);
})();

document.onreadystatechange = function () {
	if (document.readyState == 'complete') {
		document.documentElement.className = 'loaded';
	}
}

var ua=navigator.userAgent.toLowerCase(),
    isMobile = ua.indexOf('mobile')>0,
    isWeixin = (/micromessenger/.test(ua)) ? true : false,
    isQQ = (/qq\//.test(ua)) ? true : false,
    isIOS = ua.indexOf('(ip')>0 && isMobile,
    isWeibo = (/Weibo/i.test(ua)) ? true : false,
    isApp = (/icomico/i.test(ua)) ? true : false,
    isIOSApp = (/icomico_ios./i.test(ua)) ? true : false,
    isAndroidApp = (/icomico_adr./i.test(ua)) ? true : false;

function callAppFunction (func, args, callback) {
    var argsString = JSON.stringify(args);
    if (isAndroidApp) {
        if (!comicool) {
            return false;
        }
        var result = eval("comicool." + func + "('" + argsString + "');");
        if (callback) {
            callback(result);
        }
    } else if (isIOSApp) {
        function handleCallback(func, args) {
            if (func != "setJSCallback") {
                return;
            }
            for (eventName in args) {
                window.WebViewJavascriptBridge.registerHandler(args[eventName], function(data, responseCallback) {
                    var appDataStr = JSON.stringify(data);
                    eval(args[eventName] + "('" + appDataStr + "');");
                });
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

function setByUserLoginStatus(isLogin, unLogin) {
	var userInfo = {};
	var done = [];
	var cb = function (i) {
		done.push(i);

		//所有异步任务完成
		if (fnQueue.length === done.length) {
			typeof isLogin === 'function' && isLogin(userInfo);
		}
	};
	var fnQueue = [
		function (i) {
			callAppFunction('getDeviceID', {}, function (DeviceID) {
				userInfo.deviceid = DeviceID;
				cb(i);
			});
		},
		function (i) {
			callAppFunction('getChannelId', {}, function (ChannelId) {
				userInfo.channel = ChannelId;
				cb(i);
			});
		},
		function (i) {
			callAppFunction('getAppVersionName', {}, function (AppVersionName) {
				userInfo.version_code = AppVersionName.split('.').pop();
				cb(i);
			});
		},
		function (i) {
			if (isIOSApp) {
				userInfo.os_type = 'ios';
			} else if (isAndroidApp) {
				userInfo.os_type = 'anr';
			}

			cb(i);
		}
	];

	callAppFunction('getAccountInfo', {}, function (result) {
		var result = function () {
			if (isAndroidApp) {
				return result ? JSON.parse(result) : {};
			}

			return result;
		}();

		userInfo.ccid = result.ccid;
		userInfo.usertype = result.usertype;
		userInfo.cctoken = result.cctoken;
		userInfo.username = result.nickname || 'TODO用户名';

		//登录
		if (result.cctoken && result.ccid && result.usertype) {
			fnQueue.forEach(function (fn, i) {
				fn(i);
			});
		} else {
		//未登录
			typeof unLogin === 'function' && unLogin();
		}
	});
}

function jumpDownload() {
	var chanel = getQueryString('ch');
	var url = 'http://m.app.comicool.cn/smart_open/main.php';

	if (chanel) {
		url = url + '?ch=' + chanel;
	}
	window.location.href = url;
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
};

function serialize(obj) {
	var arr = [];

	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			arr.push(key + '=' + obj[key]);
		}
	}

	return arr.join('&');
}

var $ = {
	one: function (selector, parent) {
		var parent = parent || document;
		return parent.querySelector(selector);
	},
	all: function (selector, parent) {
		var parent = parent || document;
		return parent.querySelectorAll(selector);
	}
};