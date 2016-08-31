//		判断域名是否是pptv.com
var isCookiePptv = getCookie('_ch');
if (isCookiePptv == 'pptv') {
	try {
		document.querySelector(".icon-menu").style.display = "none";
	} catch (e) {
		//TODO handle the exception
	}
	try {
		//		document.querySelector(".header-fixed").style.display = "none";
		//		$('.offset-plus').attr('style', 'padding:0 !important');
	} catch (e) {
		//TODO handle the exception
	}

	try {
		document.querySelector(".icon-angle-left").style.display = "none";
	} catch (e) {
		//TODO handle the exception
	}
	try {
		document.querySelector(".footer").style.display = "none";
	} catch (e) {
		//TODO handle the exception
	}
	try {
		document.querySelector(".icon-home").style.display = "none";
	} catch (e) {
		//TODO handle the exception
	}
	try {
		document.getElementsByClassName("f-article")[0].style.display = "none";
	} catch (e) {}
}
var Comi = {};

Comi.Utils = {
	LocalStorage: {
		add: function(key, val) {
			window.localStorage.setItem(key, val);
			return val;
		},
		del: function(key) {
			window.localStorage.removeItem(key);
		},
		get: function(key) {
			return window.localStorage.getItem(key);
		}
	},
	Cookie: {
		add: function(name, value, day) {
			var Days = day || 7;
			var exp = new Date();
			exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
			document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
			return value;
		},
		get: function(name) {
			var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
			if (arr = document.cookie.match(reg)) {
				return unescape(arr[2]);
			} else {
				return null;
			}
		},
		del: function(name) {
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cval = this.get(name);
			if (cval != null) {
				document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
			}
		}
	},
	getUserInfo: function() {
		var userStr = Comi.Utils.LocalStorage.get('comiUserData');
		var user = JSON.parse(userStr);

		if (user == null || user && user.outDated) {
			return null;
		} else {
			return user;
		}
	},
	getQueryString: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return decodeURI(r[2]);
		return null;
	}
};

$.fn.reverseOrder = function() {
		return this.each(function() {
			$(this).prependTo($(this).parent());
		});
	}
	/* 检查用户登录信息 */
function checkUserLoginStatus() {
	var $profile = $('.aside-profile');
	var userStr = Comi.Utils.LocalStorage.get('comiUserData');
	if (userStr != null) {
		var user = JSON.parse(userStr);

		if (!user.outDated) {
			CONFIG.isLogin = true;

			if ($profile.size()) {
				var $nav = $('.aside-nav');
				var $signOutBtn = $('<a class="nav-border" id="aside-signout"><i class="icon-exit"></i>退出登录</a>');
				if (user.icon) {
					var userIcon = user.icon;
				} else if (user.avatar) {
					var userIcon = CONFIG.iconBase + user.avatar + '.jpg';
				} else {
					var userIcon = CONFIG.defaultAvatar;
				}
				$profile.find('.aside-profile-l img').attr('src', userIcon).unwrap();
				$profile.find('.aside-profile-r').html(user.nickname);
				$profile.removeAttr('id');
				$nav.append($signOutBtn);

				$signOutBtn.on('click', function() {
					user.outDated = true;
					Comi.Utils.LocalStorage.add('comiUserData', JSON.stringify(user));
					window.location.reload();
				});
			}
		} else {
			CONFIG.isLogin = false;
		}
	} else {
		CONFIG.isLogin = false;
	}
}

(function() {
	var scrollTopHtml = '<div class="goto-top">' + '<i class="icon-angle-up"></i></div>';
	$('body').append(scrollTopHtml);
	scrollToTop();

	//设置全局CONFIG的deviceid
	var deviceID = Comi.Utils.LocalStorage.get('deviceID') || Comi.Utils.LocalStorage.add('deviceID', createDeviceID());
	CONFIG.deviceID = deviceID;

	if (isCookiePptv == 'pptv') {
		$(document).on('click', '.smart-tip-inst', function(e) {
			new TipBox({
				str: '下载可米酷App才能继续玩耍哦，看更多精彩漫画还能领奖励！',
				btnText: ['取消', '确认'],
				btnCallback: function() {
					if (this.innerText == '确认') {
						window.location.href = 'http://m.app.comicool.cn/smart_open/main.php';
					} else {
						return;
					}
				}
			})
			e.stopPropagation();
		})

	}
})();

function scrollToTop() {
	$(window).scroll(function() {
		var scrollValue = $(window).scrollTop();
		scrollValue > 125 ? $('.goto-top').addClass('show-top') : $('.goto-top').removeClass('show-top');
	});
	$('.goto-top').on('click', function() {
		document.documentElement.scrollTop = document.body.scrollTop = 0;
	});
}

(function() {
	var floatHtml = '<div class="float-fix envelope-fix">' + '<div class="float-img">' + '<img src="http://m.comicool.cn/images/float-tip.png" alt="可米酷漫画,comicool">' + '</div>' + '<span class="open-btn envelope">立即打开</span><span class="float-clo">×</span>' + '</div>';
	var floatTip = getCookie('floatTip');

	$('body').append(floatHtml);

	$('.float-fix .float-clo').on('click', function() {
		$(this).parent().hide();
		setCookie('floatTip', true, 1);
		$('body').removeClass('has-down-tip');
	});

	if (!floatTip) {
		$('body').addClass('has-down-tip');
	}

	//底部下载跳转
	$('.footer-down, .float-fix .float-img, .float-fix .open-btn').click(function() {
		var chanel = getChanel();
		var url = 'http://m.app.comicool.cn/smart_open/main.php';

		if (chanel != null) {
			url += ('?ch=' + chanel);
		}

		window.location.href = url;
	});
})();

//生成deviceID
function createDeviceID() {
	var timeStampToHex = 'a1' + new Date().getTime().toString(16).slice(-10);

	function hex4() {
		return ("0000" + Math.floor(Math.random() * 0x10000).toString(16)).slice(-4);
	}

	function hex8() {
		return ("00000000" + Math.floor(Math.random() * 0x100000000).toString(16)).slice(-8);
	}

	return timeStampToHex + hex8() + hex8() + hex4();
}

//获取页面URL参数名
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURI(r[2]);
	return null;
};

function getByAjax(obj) {
	if (obj.beforeSend && (obj.beforeSend() === false)) { //如果填写了beforSend且返回值为false
		complete();
		return false;
	}
	var getCh = getChanel();
	if (getCh) {
		var dataObj = $.extend(obj.data || {}, {
			device_id: CONFIG.deviceID
		}, {
			channel: 'h5_' + getCh
		});
	} else {
		var dataObj = $.extend(obj.data || {}, {
			device_id: CONFIG.deviceID
		});
	}

	var ajaxParams = {
		url: obj.url || CONFIG.ajaxBase + obj.api,
		type: 'GET',
		data: dataObj,
		dataType: 'jsonp',
		jsonpCallback: obj.jsonpCallback,
		timeout: obj.timeout || 15000,
		complete: function() {
			obj.complete && obj.complete();
			complete();
		},
		success: obj.success,
		error: function() {
			obj.error && obj.error();
			!obj.notDefaultErr && errorPage();
		}
	};

	//执行请求
	$.ajax(ajaxParams);

	function complete() {
		$('html').removeClass('loading-page');
	}

	function errorPage() {
		var errorHtml = '<div class="errorbox">' + '<header class="header error-header">' + '<a href="' + location.origin + '/index.html" class="l-icon icon-home"></a>' + '</header>' + '<div class="error-main">' + '<div class="error-img">' + '<img src="images/error.png" alt="可米酷漫画,comicool,手机漫画,原创漫画,漫画app">' + '</div>' + '<div class="error-txt">' + '<p>三次元的网络不行呀</p>' + '<p><a href="javascript:window.location.reload()">再次刷新</a></p>' + '</div>' + '</div>' + '</div>';
		$('body').html(errorHtml);
	}
}

//取消浏览器默认的300ms点击延迟
$(function() {
	//	FastClick.attach(document.body);
});
$(document).ready(function() {
		var port = window.location.port;
		if (port !== 80 && port !== "") {
			var ename = ("http://" + window.location.hostname + ":" + window.location.port);
		} else {
			var ename = "http://" + window.location.hostname
		}
		$(".menu").load(ename + "/m-common/left.html", function() {
			checkUserLoginStatus();
			//	nav高亮
			var nav = $(".aside-nav a");
			for (var i = 0, len = nav.length; i < len; i++) {
				nav.removeClass("curr");
				var index = nav.eq(i).attr("href");
				if (document.location.href.indexOf(index) != -1) {
					nav.eq(i).addClass("cur");
					break;
				}
			};
			//侧边栏搜索
			$('.aside-search .icon-search').click(function() {
				$(this).parents('form').submit();
			});
		});
	})
	//侧边栏显隐控制
$('.header .icon-menu').click(function(e) {
	e.stopPropagation();
	$('body').toggleClass('aside-open');
});
$(document).on('click touchmove', '.aside-open .main-panel', function(e) {
	e.preventDefault();
	$('body').removeClass('aside-open');
});
//禁止滚动：侧边栏打开、遮罩
$(document).on('touchmove', '.aside-open, .mask', function(e) {
	e.preventDefault();
});

//返回按钮
$('header i.icon-angle-left').click(function() {
	history.back();
});
//打开方式
try {
	var readComic = '';
	if (isApp) {
		readComic = function(getUri) {
			callAppFunction('openNewBrowser', {
				url: getUri,
				title: ''
			});
		}
	}
	$(document).on('click', '.openPage,.openPage a,.h-block-head,.h-block-main a,.common-list a,.readcss,.author_name a,.rank-list a,.list-unstyled a,.large-list a,.icon-search', function(event) {
		var getUri = this.href;
		//		alert("url:" + getUri);
		if (getUri !== undefined && getUri !== "" && isApp) {
			var e = event || window.event;
			e.preventDefault();
			readComic(getUri);
		}
	})
} catch (e) {
	//TODO handle the exception
}

//js接口
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

var all_public = {
		comic_pull_down: function() {

		}
	}
	//百度统计代码安装
var _hmt = _hmt || [];
(function() {
	var hm = document.createElement("script");
	hm.src = "//hm.baidu.com/hm.js?91ce1b276d999b0757a6bf47b0e86df6";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(hm, s);
})();