//设置常用变量
var ua = navigator.userAgent.toLowerCase();
var isMobile = ua.indexOf('mobile') > 0;
var isWeixin = (/micromessenger/.test(ua)) ? true : false;
var isQQ = (/qq\//.test(ua)) ? true : false;
var isIOS = ua.indexOf('(ip') > 0 && isMobile;
var isWeibo = (/Weibo/i.test(ua)) ? true : false;
var isAndr = ua.indexOf('android') > -1 || ua.indexOf('linux') > -1;
var isApp = (/icomico/i.test(ua)) ? true : false;

var topBarHtml = '<header class="topbar cl" style="height:2.25rem; position:fixed; display:none; left:0; top:0; width:100%;background: -webkit-linear-gradient(rgba(0,0,0, .5) 0%, transparent 100%);">'
			   +	'<a class="icon-home" href="../../index.html" style="position:absolute; left:.5rem; top:.3rem; width:1.5rem; height:1.5rem; display:block;"><img src="../act-common/icon-home.png" /></a>'
			   +	'<a class="icon-share" style="position:absolute; right:.5rem; top:.3rem; width:1.5rem; height:1.5rem; display:block;"><img src="../act-common/icon-share.png" /></a>'		
			   + '</header>'
if (!isApp) {
	$('body').append(topBarHtml);
	$('.topbar').show();

	$('.icon-share').on('click', function () {
		$('.sharebox').show();
	});

	$('a.share-clo').on('click', function () {
		$('.sharebox').hide();
	});
}

