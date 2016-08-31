var isTest = /192.168|localhost/i.test(location.origin);
var ua = isTest ? 'icomico_adr.Mozilla/5.0 (Android; Mobile; rv:14.0) Gecko/14.0 Firefox/14.0' : navigator.userAgent.toLowerCase();

CONFIG.isApp=(/icomico/i.test(ua)) ? true : false;
CONFIG.isIOSApp=(/icomico_ios./i.test(ua)) ? true : false;
CONFIG.isAndroidApp=(/icomico_adr./i.test(ua)) ? true : false;
//var callAppFunction=function(){
//	
//};
//CONFIG = {
//	ajaxBase: isTest ? 'http://121.201.7.97/' : 'http://proxy.icomico.com/', //测试：http://121.201.7.97/ 正式：http://proxy.icomico.com/
//	rootUrl: base,
//	readerBase: base + '/content/reader.html?',
//	detailBase: base + '/content/detail.html?',
//	listBase: base + '/list.html?',
//	imgBase: 'http://cdn.icomicool.cn/',
//	imgAlt: '可米酷漫画,comicool,手机漫画,原创漫画,漫画app',
//	deviceID: '',
//	isLogin: false,
//  postImgBase: 'http://up.cdn.icomico.com/', //贴吧图片前缀
//  ua: ua,
//	isMobile: ua.indexOf('mobile') > 0,
//	isWeixin: (/micromessenger/.test(ua)) ? true : false,
//	isQQ: (/qq\//.test(ua)) ? true : false,
//	isIOS: ua.indexOf('(ip') > 0 && this.isMobile,
//	isWeibo: (/Weibo/i.test(ua)) ? true : false,
//	isApp: (/icomico/i.test(ua)) ? true : false,
//	isIOSApp: (/icomico_ios./i.test(ua)) ? true : false,
//	isAndroidApp: (/icomico_adr./i.test(ua)) ? true : false,
//};



var AppConfig = {
	deviceId: 'AC80AF8B-8A2D-4844-B994-1BAA8617EB19', 	// 310763的ios测试环境的deviceID
	channelId: 'AppStore',								// 模拟ios渠道
	appVersionName: '24',								// version code
	userinfo: '{"ccid":"11", "usertype":4,  "cctoken":"xxx",  "nickname":"酷2酱177**6169"}',
}

var comicool = {

	getDeviceID: function() {
		// var deviceId = 'AC80AF8B-8A2D-4844-B994-1BAA8617EB19';  //310763的ios测试环境的deviceID
		var deviceId = AppConfig.deviceId;
		return deviceId;
	},

	getChannelId: function() {
		var channelId = AppConfig.channelId; // 模拟ios渠道
		return channelId;
	},

	getAppVersionName: function() {
		var appVersionName = AppConfig.appVersionName;
		return appVersionName;
	},

	getAccountInfo: function() {
		var userinfo = AppConfig.userinfo;
		return userinfo;
	},

	openNewBrowser: function(argsObj) {
		var obj = JSON.parse(argsObj);
		window.location.href = obj.url;
	},

	setJSCallback: function(argsObj) {
		var obg = JSON.parse(argsObj);
		
	}

}

