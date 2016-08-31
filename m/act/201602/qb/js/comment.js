function $(selector, parent) {
	return (parent || document).querySelector(selector);
}

function $$(selector, parent) {
	return (parent || document).querySelectorAll(selector);
}

function jsonp(options) {
	var src = options.url;
	var data = typeof options.data === 'object' ? options.data : {};
	//添加时间戳,防止缓存
	var timestamp = Date.parse(new Date());
	data['__t'] = timestamp;
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

	window[options.callback] = options.success;
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

function checkSelfThenParents(elem, filter) {
	while (elem !== null) {
		var result = filter(elem);
		if (result) {
			return result;
		} else if (result === false) {
			break;
		}
		elem = elem.parentNode;
	}
}

function getParentByClass(elem, className) {
	while (elem !== null) {
		if (elem.classList && elem.classList.contains(className)) {
			return elem;
		}
		elem = elem.parentNode;
	}
}

function insertAfter(targetElem, elem) {
	var parent = targetElem.parentNode;

	for (var i = 0, len = elem.length; i < len; i++) {
		if (targetElem === parent.lastElementChild) {
			parent.appendChild(elem[i]);
		} else {
			var nextChild = targetElem.nextElementSibling;
			parent.insertBefore(elem[i], nextChild);
			console.log(parent, elem[i], nextChild)
		}
	}
}

function extendObj(obj, targetObj, spec) {
	obj = obj ? obj : {};
	targetObj = targetObj ? targetObj : {};

	for (var key in targetObj) {
		if (targetObj.hasOwnProperty(key)) {
			if (spec && spec.indexOf(key) < 0) {
				continue;
			}
			obj[key] = targetObj[key];
		}
	}
	return obj;
}

function render(templateID, data, cb) {
	document.getElementById(templateID).outerHTML = template(templateID, data);
	typeof cb === 'function' && cb();
}
template.helper('getUserInfo', function(ccid, user_list, key, defText) {
	for (var i = 0, user; user = user_list[i++];) {
		if (user.ccid === ccid) {
			return user[key] || defText;
		}
	}
});
template.helper('date2string', function(timestamp) {
	var nowTimestamp = parseInt(new Date().getTime() / 1000);
	var timestamp = timestamp ? timestamp : nowTimestamp;
	var D = new Date(timestamp * 1000);
	var secondsAgo = nowTimestamp - timestamp;
	var minutesAgo = parseInt(secondsAgo / 60);
	var hoursAgo = parseInt(minutesAgo / 60);
	var daysAgo = parseInt(hoursAgo / 24);
	var monthsAgo = parseInt(daysAgo / 30);

	if (secondsAgo >= 0 && monthsAgo < 1) {
		if (daysAgo) {
			return daysAgo + '天前';
		} else if (hoursAgo) {
			return hoursAgo + '小时前';
		} else if (minutesAgo) {
			return minutesAgo + '分钟前';
		} else if (secondsAgo) {
			return secondsAgo + '秒前';
		} else {
			return '刚刚';
		}
	} else {
		var year = D.getFullYear();
		var month = D.getMonth() + 1;
		var date = D.getDate();
		var hour = D.getHours();
		var minute = D.getMinutes();

		month = month > 9 ? month : '0' + month;
		date = date > 9 ? date : '0' + date;
		hour = hour > 9 ? hour : '0' + hour;
		minute = minute > 9 ? minute : '0' + minute;

		return year + '-' + month + '-' + date + '&nbsp;' + hour + ':' + minute;
	}
});

function jumpDownload() {
	window.location.href = "http://m.app.comicool.cn/smart_open/main.php?ch=reserverd9";
}
window.onload = function() {
	var exchangeBtn = document.getElementById('task');
	exchangeBtn.addEventListener("touchend", function() {
		if (isApp) {
			callAppFunction('openMallPage', {});
		}
	});
	//如果是可米酷app
	if (isApp) {
		setByUserLoginStatus(
			loginCallback,
			function() {
				exchangeBtn.addEventListener('touchend', jumpLoginPage, false);
				//设置App里登录后的回调函数
				callAppFunction('openMallPage', {});
			}
		);
	} else {
		exchangeBtn.addEventListener('touchend', jumpDownload, false);
	}
	window.loginHandler = function(obj) {
		setByUserLoginStatus(loginCallback);
		exchangeBtn.removeEventListener('touchend', jumpLoginPage);
	}

	function loginCallback(userInfo) {
		exchangeBtn.addEventListener('touchend', function() {
			callAppFunction('openMallPage', {});
		}, false);
	}

	function jumpLoginPage() {
		callAppFunction('openLoginPage', {});
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
}