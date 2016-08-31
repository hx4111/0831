var ua=navigator.userAgent.toLowerCase(),
    isMobile = ua.indexOf('mobile')>0,
    isWeixin = (/micromessenger/.test(ua)) ? true : false,
    isQQ = (/qq\//.test(ua)) ? true : false,
    isIOS = ua.indexOf('(ip')>0 && isMobile,
    isWeibo = (/Weibo/i.test(ua)) ? true : false,
    isApp = (/icomico/i.test(ua)) ? true : false,
    isIOSApp = (/icomico_ios./i.test(ua)) ? true : false,
    isAndroidApp = (/icomico_adr./i.test(ua)) ? true : false;

document.onreadystatechange = function () {
	if (document.readyState == 'complete') {
		document.documentElement.className = 'loaded';
	}
}

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

function $(selector, parentNode) {
    parentNode = parentNode || document;
    return parentNode.querySelector(selector);
}

function $$(selector, parentNode) {
    parentNode = parentNode || document;
    return parentNode.querySelectorAll(selector);
}

function insertAfter(elem, newElem) {
	var parent = elem.parentNode;

	if (elem === parent.lastChild) {
		parent.appendChild(newElem);
	} else {
		parent.insertBefore(newElem, elem.nextSibling);
	}
}

function listScroller(selector, interval, duration) {
	var list         = $(selector);
	var child        = list.children;
	var container    = list.parentNode;
	var onceDistance = child[0].offsetHeight;
	var triggerSize  = Math.floor(container.offsetHeight / onceDistance);
	var curPosition  = 0;
	var threshold    = -list.offsetHeight;
	var interval     = interval || 1000;
	var duration     = duration || 300;
	var timer;
	var cloneChild = function () {
		var duplicate = document.createDocumentFragment();
		for (var i = 0, elem; elem = child[i++];) {
			duplicate.appendChild(elem.cloneNode(true));
		}

		list.appendChild(duplicate);
	};

	if (child.length > 4) {
		cloneChild();
		scroll();
	}

	function scroll() {
		var callee = arguments.callee;

		setTimeout(function() {
			curPosition -= onceDistance;
			setTransform(curPosition, duration);
			callee();

			if (curPosition === threshold) {
				setTimeout(function () {
					setTransform(curPosition = 0);
				}, duration);
			}
		}, interval);
	}

	function setTransform(position, duration) {
		var prefix  = ['webkit', 'moz', 'o', 'ms'];
		var cssText = [];
        var addText = function (text) {
            for (var i = 0, len = prefix.length; i < len; i++) {
                cssText.push('-' + prefix[i] + '-' + text);
            }
            cssText.push(text);
        };

        addText('transform:translate3d(0,' + position +'px,0)');
        duration && addText('transition:' + ['all', duration + 'ms'].join(' '));
        list.style.cssText = cssText.join(';');
	}
}

function initRecords(selector, arr) {
	var html = '';

	arr.sort(function () {
		return Math.random() - 0.5;
	});
	arr.forEach(function (item, index) {
		html += '<li>' + item.name + item.desc + '</li>';
	});

	$(selector).innerHTML = html;
}

(function () {
	var records = [
		{name:'F****桑',desc:'抽中颜文字抱枕一个'},
		{name:'々**',desc:'抽中颜文字抱枕一个'},
		{name:'B*******e',desc:'抽中颜文字抱枕一个'},
		{name:'冰****糖~',desc:'抽中颜文字抱枕一个'},
		{name:'V*******菜',desc:'抽中颜文字抱枕一个'},
		{name:'透**、',desc:'抽中Q版手办一个'},
		{name:'╰******╯',desc:'抽中Q版手办一个'},
		{name:'闪***星',desc:'抽中Q版手办一个'},
		{name:'*******&',desc:'抽中Q版手办一个'},
		{name:'Y****N',desc:'抽中Q版手办一个'},
		{name:'爱*****凉',desc:'抽中20元话费充值'},
		{name:'木***鱼',desc:'抽中20元Q币充值'},
		{name:'Ｌ*****灔',desc:'抽中20元Q币充值'},
		{name:'*****r',desc:'抽中20元Q币充值'},
		{name:'铃***当',desc:'抽中20元Q币充值'},
		{name:'国***香',desc:'抽中20元Q币充值'},
		{name:'在****你',desc:'抽中20元Q币充值'},
		{name:'T********力👊',desc:'抽中20元Q币充值'},
		{name:'♂****猫',desc:'抽中20元Q币充值'},
		{name:'刺**人',desc:'抽中20元话费充值'},
		{name:'无****.',desc:'抽中20元话费充值'},
		{name:'C*****卡',desc:'抽中20元话费充值'},
		{name:'ぺ*****ル',desc:'抽中20元话费充值'},
		{name:'挂****愣',desc:'抽中20元话费充值'},
		{name:'＂*******、',desc:'抽中20元话费充值'},
		{name:'·*****r',desc:'抽中20元话费充值'},
		{name:'斌*****.',desc:'抽中20元话费充值'},
		{name:'唯***ι',desc:'抽中20元话费充值'},
		{name:'A*****t',desc:'抽中20元话费充值'},
		{name:'猪*****々',desc:'抽中20元话费充值'},
		{name:'半****曲',desc:'抽中20元话费充值'},
		{name:'≮****≯',desc:'抽中20元话费充值'},
		{name:'乙**.',desc:'抽中20元话费充值'},
		{name:'T*******l',desc:'抽中20元Q币充值'},
		{name:'鎂**憶',desc:'抽中20元Q币充值'},
		{name:'^****子',desc:'抽中20元Q币充值'},
		{name:'T*******G',desc:'抽中20元Q币充值'},
		{name:'****友',desc:'抽中20元Q币充值'},
		{name:'鸭****y',desc:'抽中颜文字抱枕一个'},
		{name:'F********u',desc:'抽中颜文字抱枕一个'},
		{name:'福***拉',desc:'抽中颜文字抱枕一个'},
		{name:'M*****O',desc:'抽中颜文字抱枕一个'},
		{name:'*******t',desc:'抽中20元话费充值'},
		{name:'******`',desc:'抽中20元话费充值'},
		{name:'E****呀',desc:'抽中20元话费充值'},
		{name:'晨**露',desc:'抽中20元Q币充值'},
		{name:'在*****☆',desc:'抽中20元Q币充值'},
		{name:'没****貓',desc:'抽中颜文字抱枕一个'},
		{name:'Ｈ****ａ',desc:'抽中颜文字抱枕一个'},
		{name:'雨***店',desc:'抽中颜文字抱枕一个'},
		{name:'爱*****凉',desc:'抽中颜文字抱枕一个'},
		{name:'花*生',desc:'抽中20元话费充值'},
		{name:'若****人',desc:'抽中20元话费充值'},
		{name:'Õ****y',desc:'抽中20元Q币充值'}
	];
	var lotteryBtn = $('#lottery-btn');
	var downloadBtn = $('#download-btn');
	var downloadTip = $('.download-tip');

	initRecords('.records-list', records);
	listScroller('.records-list', 3000);

	if (isApp) {
		var shareJsonObj = {
		    'title' : '可米酷抽奖季',
		    'describe' : '可米酷抽奖季',
		    'imageurl' : 'http://m.comicool.cn/act/201510/lottery/images/540.jpg'
		};

		setByUserLoginStatus(
			loginCallback,
			function () {
				lotteryBtn.addEventListener('touchend', jumpLoginPage, false);

				//设置App里登录后的回调函数
				callAppFunction('setJSCallback', {
				    'account_event': 'loginHandler'
				});
			}
		);
		callAppFunction('showShareBtn', shareJsonObj);
	} else {
		lotteryBtn.style.display = 'none';
		downloadBtn.style.display = 'block';
		downloadTip.style.display = 'block';
	}

	window.loginHandler = function(obj) {
		setByUserLoginStatus(loginCallback);
		lotteryBtn.removeEventListener('touchend', jumpLoginPage);
	}

	function loginCallback(userInfo) {
		lotteryBtn.addEventListener('touchend', function () {
			try {
			    callAppFunction('openMallPage', {});
			} catch(e) {
			    alert('哇哦，您的可米酷还不是最新版哦～快去更新吧～');
			}
		}, false);
	}

	function jumpLoginPage() {
		callAppFunction('openLoginPage', {});
	}
})();