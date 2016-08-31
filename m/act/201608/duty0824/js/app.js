var ua = navigator.userAgent.toLowerCase(),
	isMobile = ua.indexOf('mobile') > 0,
	isWeixin = (/micromessenger/.test(ua)) ? true : false,
	isQQ = (/qq\//.test(ua)) ? true : false,
	isIOS = ua.indexOf('(ip') > 0 && isMobile,
	isWeibo = (/Weibo/i.test(ua)) ? true : false,
	isApp = (/icomico/i.test(ua)) ? true : false,
	isIOSApp = (/icomico_ios./i.test(ua)) ? true : false,
	isAndroidApp = (/icomico_adr./i.test(ua)) ? true : false;


function callAppFunction(func, args, callback) {
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
			if (isIOSApp) {
				userInfo.os_type = 'ios';
			} else if (isAndroidApp) {
				userInfo.os_type = 'anr';
			}
			cb(i);
		},
		function(i) {
			callAppFunction('getAccountInfo', {}, function(result) {
				if (isAndroidApp) {
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

function setShareInfo(shareInfo, setBrowserShare) {
	if (isApp) {
		//TODO:直接传入shareInfo不起作用
		shareInfo = {
			title: shareInfo.title,
			describe: shareInfo.describe,
			imageurl: shareInfo.imageUrl,
			pageUrl: shareInfo.pageUrl
		};
		callAppFunction('showShareBtn', shareInfo);
	} else if (setBrowserShare) {
		if (isWeixin) {
			document.getElementById('ShareBg').innerHTML = '<img src="http://cdn.icomicool.cn/m/images/shareTip.png" >';
			document.getElementsByClassName('header')[0].style.display = 'block';
			document.getElementById('ShareBg').style.display = 'block';
			document.getElementById('ShareBg').addEventListener('click', function(){
				document.getElementById('ShareBg').style.display = 'none';
			})
		} else {
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
}

function getByClass(clsName, parent) {
		var body = document.body || document.documentElement,
			oParent = parent ? document.getElementById(parent) : body,
			elements = oParent.getElementsByTagName("*"),
			arr = [];
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].className == clsName) {
				arr.push(elements[i]);
			}
		}
		return arr;
	}
