
var isTest = /192.168|localhost/i.test(location.origin),
	pathHasM = /^\/m\//i.test(location.pathname),
	base = pathHasM ? location.origin + '/m' : location.origin,
	ua = navigator.userAgent.toLowerCase();

/*if(!(/icomico/i.test(ua) && isTest)) { //本地测试环境模拟App ua
	ua = 'icomico_adr.Mozilla/5.0 (Android; Mobile; rv:14.0) Gecko/14.0 Firefox/14.0';
}*/

var CONFIG = {
	ajaxBase: isTest ? 'http://121.201.7.97/' : 'http://proxy.icomico.com/', //测试：http://121.201.7.97/ 正式：http://proxy.icomico.com/
	rootUrl: base,
	readerBase: base + '/content/reader.html?',
	detailBase: base + '/content/detail.html?',
	postBase: base + '/content/post-detail.html?',
	listBase: base + '/list.html?',
	imgBase: 'http://cdn.icomicool.cn/',
	icomicoBase: 'http://cdn.icomico.com/',
	imgAlt: '可米酷漫画,comicool,手机漫画,原创漫画,漫画app',
	deviceID: '',
	isLogin: false,
    postImgBase: 'http://up.cdn.icomico.com/', //贴吧图片前缀
    defaultAvatar: 'http://cdn.icomicool.cn/m/act/act-common/images/default_avatar.png',
    iconBase: 'http://cdn.icomicool.cn/gcommon/images/icon/',
    errorImg: 'http://www.comicool.cn/images/empty.jpg',
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

if (getCookie('_ch') == 'pptv') {
	CONFIG.isPPTV = true;
} else {
	CONFIG.isPPTV = false;
}

//测试版环境
/*if (CONFIG.isApp) {
	callAppFunction('getChannelId', {}, function(channelId) {
		if (/prerelease/.test(channelId)) {
			CONFIG.ajaxBase = 'http://121.201.7.97/';
		}
	})
}*/

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

var Comi = {};

function initComi() {
	if (isSecretBrowse()) { //检测是否支持localstorage(防止禁用后出错，如隐身模式)
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
			}
		}

		Comi.User = {
			getComiUser: function() {
				var userData = Comi.Utils.LocalStorage.get('comiUserData');
				if (userData != null) {
					return JSON.parse(userData);
				} else {
					return null;
				}
			},
		}
	} else { // 使用浏览器进程cookie，解决登录用户信息
		Comi.Utils = {
			LocalStorage: {
				add: function(key, val) {
					setCookie(key, val);
					return val;
				},
				del: function(key) {
					delCookie(key);
				},
				get: function(key) {
					return getCookie(key);
				}
			}
		}

		Comi.User = {
			getComiUser: function() {
				var userData = getCookie('comiUserData');
				if (userData != null) {
					return JSON.parse(userData);
				} else {
					return null;
				}
			},
		}
	}

	function isSecretBrowse(){
		if (navigator.cookieEnabled) {
			var _localStorage = window.localStorage;
		    if(!_localStorage){
		    	return false;
		    }
		    var testKey = 'test';
		    try{
		        _localStorage.setItem(testKey, '1');
		        _localStorage.removeItem(testKey);
		        return true;
		    }catch (error){
				return false;
		    }
		} else {
			return false;
		}
	}
}

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

var timeTransform = function(timestamp) {
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

		return year + '-' + month + '-' + date + ' ' + hour + ':' + minute;
	}
}

function setShareInfo(shareInfo, setBrowserShare) {
	var isCookiePptv = getCookie('_ch');

	if (CONFIG.isApp && isCookiePptv != 'pptv') {
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

	if (isCookiePptv == 'pptv') {
		try {
			document.querySelector(".icon-home").style.display = "none";
		} catch (e) {
			//TODO handle the exception
		}
	}
	
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

function setCookie(name, value, day, isGlobal) {
	var Days = day || 7;
	var exp = new Date();
	var ckStr = ''
	if (day == "realTime") {
		ckStr = name + "=" + escape(value) + "";
	} else {
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		ckStr = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	}

	ckStr += ";path=/";
	document.cookie = ckStr;
};

function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg)) {
		return unescape(arr[2]);
	} else {
		return null;
	}
};

function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null) {
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	}
};

//阅读漫画打开事件绑定 
/** class="go" data-ccid='xxx' [data.epid='xxx' ]**/
function bindOpenComicEvents() {
    var readComic;
    if (CONFIG.isApp) {
    	if (CONFIG.isPPTV) {
    		readComic = function(ccid, epid) {
    			callAppFunction('openNewBrowser', {
    				'url': 'http://m.comicool.cn/content/reader.html?comic_id=' + ccid + '&ep_id=' + epid,
    				'title': '可米酷漫画'
    			})
    		}
    	} else {
    		readComic = function(ccid, epid) {
	            callAppFunction('openEpisodeReaderPage', {
	                comic_id: ccid,
	                ep_id: epid
	            });
	        }
    	}
    } else {
        readComic = function(ccid, epid) {
            window.location.href = 'http://m.comicool.cn/content/reader.html?comic_id=' + ccid + '&ep_id=' + epid;
        }
    }

    $('.go').on('click', function(e) {
        var ccid = this.dataset.ccid;
        var epid = this.dataset.epid ? this.dataset.epid : 1;
        if (ccid !== undefined && ccid !== "") {
            readComic(ccid, epid);
        }
    });
}

(function() {
	initComi();
	if (Comi.User.getComiUser()) {
		CONFIG.isLogin = true;
	}

	bindOpenComicEvents();

	//设置全局CONFIG的deviceid,考虑禁用cookie的情况
	if (Comi.Utils) {
		var deviceID = Comi.Utils.LocalStorage.get('deviceID') || Comi.Utils.LocalStorage.add('deviceID', createDeviceID());
		CONFIG.deviceID = deviceID;
	} else {
		CONFIG.deviceID = createDeviceID();
	}
	
    var isCookiePptv = getCookie('_ch');
	if (isCookiePptv == 'pptv') {
		$(document).on('touchend', '.smart-tip-inst', function(e) {
			new TipBox({
				str: '下载可米酷App才能继续玩耍哦，看更多精彩漫画还能领奖励！', 
                btnText: ['取消', '确认'], 
                btnCallback: function() {
                    if (this.innerText == '确认') {
                        window.location.href = 'http://m.app.comicool.cn/smart_open/main.php?ch=pptv';
                    } else {
                        return;
                    }
                }
			})
			e.stopPropagation();
		})
	}

	var calcFontSize = function() {
		var html            = document.documentElement;
		var defaultWidth    = 320;
		var defaultFontSize = 20;

		return function () {
			var currentWidth    = html.clientWidth;
			var currentFontSize = currentWidth / defaultWidth * defaultFontSize;
			if (currentWidth>1200) {
				html.style.fontSize = '20px';
			} else{
				html.style.fontSize = currentFontSize + 'px';
			}
		}
	}();

	calcFontSize();
	window.addEventListener('resize', calcFontSize);
})()

// 简单实现了一下 subscribe 和 dispatch
//otherObject.subscribe('namechanged', function(data) { alert(data.name); });
//this.dispatch('namechanged', { name: 'John' });
var EventEmitter = {
    _events: {},
    dispatch: function (event, data) {
        if (!this._events[event]) return; // no one is listening to this event
        for (var i = 0; i < this._events[event].length; i++)
            this._events[event][i](data);
    },
    subscribe: function (event, callback) {
      if (!this._events[event]) this._events[event] = []; // new event
      this._events[event].push(callback);
    },
    unSubscribe: function(event){
	    if(this._events && this._events[event]) {
	    	delete this._events[event];
	    }
    }
}

function jsonp(options) {
	if (options.beforeSend && (options.beforeSend() === false)) { //如果填写了beforSend且返回值为false
		return false;
	}

	var jsonpData = $.extend(options.data || {}, {
		device_id: CONFIG.deviceID
	});

	if (getChanel()) {
		jsonpData.channel = 'h5_' + getChanel();
	}

	var ajaxUrl = CONFIG.ajaxBase + options.url;
	if (/http/g.test(options.url)) {
		ajaxUrl = options.url;
	}
	console.info(jsonpData);
	$.ajax({
		url: ajaxUrl,
		dataType: 'jsonp',
		data: jsonpData,
		jsonpCallback: options.jsonpCallback,
		timeout: options.timeout || 15000,
		success: function(data) {
			options.success && options.success(data);
		},
		error: function(err, statu) {
			options.error && options.error(err);
			console.info('error : ' + options.url);
			// new TipBox({str: '请求出错,请重试'});
		},
		complete: function() {
			options.complete && options.complete();
		}
	});
}

/*  
 * @弹出提示层 ( 加载动画(load), 提示动画(tip), 成功(success), 错误(error), )  
 * @method  tipBox  
 * @description 默认配置参数   
 * @time    2014-12-19   
 * @param {Number} width -宽度  
 * @param {Number} height -高度         
 * @param {String} str -默认文字  
 * @param {Object} windowDom -载入窗口 默认当前窗口  
 * @param {Number} setTime -定时消失(毫秒) 默认为0 不消失  
 * @param {Boolean} hasMask -是否显示遮罩  
 * @param {Boolean} hasMaskWhite -显示白色遮罩   
 * @param {Boolean} clickDomCancel -点击空白取消  
 * @param {Function} callBack -回调函数 (只在开启定时消失时才生效)  
 * @param {String} type -动画类型 (加载,成功,失败,提示)  
 * @example   
 * new TipBox();   
 * new TipBox({type:'load',setTime:1000,callBack:function(){ alert(..) }});   
*/
function TipBox(cfg){
    this.config = {
        width          : 180,
        height         : 150,
        title          : '',
        str            : '正在处理',
        btnText        : ['确定'],
        btnCallback    : function() {},
        windowDom      : window,
        setTime        : 0,
        hasMask        : true,
        hasMaskWhite   : false,
        clickDomCancel : false,
        callBack       : null,
        type           : 'confirmBox'
    };
    $.extend(this.config,cfg);
    if(TipBox.prototype.boundingBox) {
        if(this.config.type == 'toastBox') {
            clearInterval(this.toastTimeOut);
            this.destroy();
        } else {
            return; //存在就retrun
        }
    }

    //初始化
    this.render(this.config.type);
    return this;
}

//外层box
TipBox.prototype.boundingBox = null;

//渲染
TipBox.prototype.render = function(tipType,container){
    this.renderUI(tipType);

    if(this.config.type != 'toastBox') {
        //绑定事件
        this.bindUI();
    }
    $(container || this.config.windowDom.document.body).append(TipBox.prototype.boundingBox);
};

//渲染UI
TipBox.prototype.renderUI = function(tipType){
    if(tipType == 'toastBox') {
        TipBox.prototype.boundingBox = $("<div id='toast'></div>");
    } else {
        TipBox.prototype.boundingBox = $("<div id='TipBox'></div>");
    }
    tipType == 'confirmBox'    && this.confirmRenderUI();
    tipType == 'toastBox'     && this.toastRenderUI();
    TipBox.prototype.boundingBox.appendTo(this.config.windowDom.document.body);

    //是否显示遮罩(非吐司模式)
    if(tipType != 'toastBox') {
        if(this.config.hasMask){
            this.config.hasMaskWhite ? this._mask = $("<div class='mask_white'></div>") : this._mask = $("<div class='mask'></div>");
            this._mask.appendTo(this.config.windowDom.document.body);
        }
        //btn元素
        if(this.config.btnText && this.config.btnCallback) {
            this.btn = TipBox.prototype.boundingBox.find('.btn-text');
        }
        //定时消失
        _this = this;
        !this.config.setTime && typeof this.config.callBack === "function" && (this.config.setTime = 1);
        this.config.setTime && setTimeout( function(){ _this.close(); }, _this.config.setTime );
    } else {
        _this = this;
        !this.config.setTime && (this.config.setTime = 1000); // 吐司模式未设置时间的话默认为1s
        this.config.setTime && setTimeout( function(){ _this.close(); }, _this.config.setTime );
    }
};

TipBox.prototype.bindUI = function(){
    _this = this;

    //点击空白立即取消
    this.config.clickDomCancel && this._mask && this._mask.click(function(){_this.close();});

    //btn事件绑定
    if(this.config.btnText && this.config.btnText.length > 0) {
        for (var i=0,len=this.config.btnText.length; i<len; i++) {
            this.btn[i].addEventListener('click', function() {
                if(_this.config.btnCallback) {
                    _this.config.btnCallback.call(this);
                }
                _this.close();
            });
        }
    }
};

//提示效果UI
TipBox.prototype.confirmRenderUI = function(){
    var tip = "<div class='tip'>";
    if(this.config.title) {
        tip +="     <div class='tip-title'>"+this.config.title+"</div>";
    }
    tip +="     <div class='dec_txt'>"+this.config.str+"</div>";
    tip += "<div class='tip-btns'>";
    for (var i=0, len=this.config.btnText.length; i<len; i++) {
        tip +="<div class='btn-text'>"+this.config.btnText[i]+"</div>";
    }
    tip += "</div></div>";
    TipBox.prototype.boundingBox.append(tip);
};

//吐司效果UI
TipBox.prototype.toastRenderUI = function(){
    TipBox.prototype.boundingBox.html(this.config.str);
}

//关闭
TipBox.prototype.close = function(){
    TipBox.prototype.destroy();
    this.destroy();
    this.config.setTime && typeof this.config.callBack === "function" && this.config.callBack();
};

//销毁  
TipBox.prototype.destroy = function(){
    this._mask && this._mask.remove();
    TipBox.prototype.boundingBox && TipBox.prototype.boundingBox.remove();
    TipBox.prototype.boundingBox = null;
};  
