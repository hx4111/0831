
var AppConfig = {
	deviceId: '01dacfc708b2a8964f64a130dbc4b654', 	// 310763的ios测试环境的deviceID
	channelId: 'prerelease',								// 模拟ios渠道
	appVersionName: '24',								// version code
	userinfo: '{"ccid":"310763", "usertype":4,  "cctoken":"4e2a8f3ef566f0b4f733013fe575f945aa97f3cca9dc6c4c4e99ae444ac2455f",  "nickname":"酷酱177**6169"}',
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

