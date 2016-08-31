//设置判断移动设备系统--苹果安卓
/*
***用法:
***所在页面写好对应方法后，执行isMobileSystem()即可
*/
function isMobileSystem(){
	return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
}

function isIOs(){
	return /iPhone|iPod|iPad/i.test(navigator.userAgent);
}

function isAndroid(){
	return /Android/i.test(navigator.userAgent);
}

//设置判断PC与移动端的直接跳转
function jumpByPlatform(mobileUrl,pcUrl){
	try {
	    if (isMobileSystem()) {
	        if (mobileUrl){
		        window.location.href = mobileUrl;
	        }
	    } else {
	        if (pcUrl){
		        window.location.href = pcUrl;
	        }
	    }
	} catch (e) {}
}

function autoJumpByPlatform(){
	var mobileUrl = "";
    var protocol = window.location.protocol;
    var urlNoProtocol = window.location.href.substr(protocol.length+2);
    if (urlNoProtocol.substr(0,2).toLowerCase() != "m.") {
        if (urlNoProtocol.substr(0,4).toLowerCase() == "www.") {
	        urlNoProtocol = window.location.href.substr(protocol.length+2+4);
        }
        mobileUrl = protocol + "//" + "m." + urlNoProtocol;
    }
    jumpByPlatform(mobileUrl);
}

//设置判断微信、QQ、微博等
/*
***用法:
***所在页面写好对应方法后，执行isClientsJump()即可
*/
function isClientsJump(){
	var MOBComico = {};
	var ua=navigator.userAgent.toLowerCase();
	MOBComico.isIOS = false;
	MOBComico.isMobile = ua.indexOf('mobile')>0;
	MOBComico.isWeixin = (/micromessenger/.test(ua)) ? true : false ;
	MOBComico.isQQ = (/qq\//.test(ua)) ? true : false ;
	MOBComico.isIOS = ua.indexOf('(ip')>0 && MOBComico.isMobile;
	MOBComico.isWeibo = (/Weibo/i.test(ua)) ? true : false ;

	var get = function(selector){return document.querySelectorAll(selector);}
	var getA = function(selector){return document.querySelector(selector);}

	function closeTips(){
	  	getA('.tips').classList.add('hide');
	};
	if (MOBComico.isWeixin || MOBComico.isQQ || (MOBComico.isWeibo && MOBComico.isIOS)) {
	  	getA('.tips').classList.remove('hide');
	  	//微信或者其它客户端上操作打开浏览器获取的链接
	  	OpenBrowser();
	}else{
		//浏览器默认行为
	  	BrowserJump();
	}
}

// 根据二级域名和路径拼url：如combin("app.", "/down.html")返回"http://app.comicol.cn/down.html"（其中comicool.cn是根据当前的域名自动填充）。
// prefix和postfix都可以根据需要填空。
function combinUrl(prefix, postfix) {
    topDomain =  window.location.host.match(/\.[^\.]+\.[^\.]+$/);
    if (topDomain) {
        topDomain = topDomain.substr(1);
    } else {
        topDomain =  window.location.host;
    }
    return window.location.protocol + "//" + prefix + topDomain + postfix;
}
