lists = {
	"content": {
		"0": {
			"text": "<p>[系统提示]：正在尝试重新连接</p><p>勇者：辣鸡服务器，挑我正在放必杀啊断线？！我的大CD很长的啊！</p><p>勇者：年兽一直没动，难道它还在掉线？</p><p>(*´ω`)人(´ω`*)，yeah！</p><p>胜利与誓约之剑(ﾟДﾟ)=σ|三三三三三三></p><p>魔貫光殺砲(ﾟДﾟ)σ━00000000000━●</p><p>龜派氣功(ﾟДﾟ)< ============O))</p><p>…………</p><p>……</p><p>[系统提示]：勇者击杀了年兽。Aced！</p>",
			"spread": "殴打小朋友最有意思啦!"
		},
		"1": {
			"text": "<p>烟尘散尽，年兽虚弱的倒在地上，</p><p>年兽：为什么！连我爸爸都没有打过我！你怎么可能伤到我？！</p><p>勇者：哼，终于拖到这个时间了。你看看的你状态提示栏吧！</p><p>年兽：这……这是什么！</p><p>[温馨提示]：您的外挂已到期，请问是否续费？</p><p>勇者：挂都不开，还想跟我打？！</p>",
			"spread": "我可是外挂年费钻石会员!"
		},
		"2": {
			"text": "<p>勇者：看我的必杀技，绝对进化！勇者之……</p><p>【年兽】对【勇者】发起了攻击，技能绝对进化被打断。</p><p>勇者：我还在变身！你怎么可以打我！规则上写了变身期间禁止攻击！</p><p>年兽：没……没听过这种规定……</p><p>勇者：你身为Boss，怎么可以在我刚出新手点就出现！？</p><p>懂不懂规矩，要先派点杂鱼给我升级攒经验啊！</p><p>还有，你身上有什么值钱的装备，金币，宝石之类的？</p><p>年兽：……没有……</p><p>勇者：我对你太失望了……你不带宝物我们勇者要怎么生活？</p><p>只翻村民的抽屉怎么够？</p><p>年兽： ΩДΩ</p><p>勇者：不要插嘴！我要好好教育一下你基本规范！！@#%￥……%*&#￥，</p><p>…………</p><p>年兽，猝</p>",
			"spread": "勇者翻村民抽屉有什么不对!"
		}
	},
	"archives": {
		"decoration": ["作死", "幸运E", "哲♂学", "鸡汁", "绝望", "蠢萌", "禁忌进击", "绅士", "鬼畜", "变态", "强欲", "Doge", "贯通", "战栗", "腹筋崩坏", "超科学", "火刑架", "咸鱼", "嘴炮", "贫穷", "猥琐", "圣光", "人偶", "亡灵"],
		"equip": ["物理学圣剑", "阿姆斯特朗回旋加速噴氣式阿姆斯特朗炮阿姆斯特拉回旋加速炮", "闪光弹", "订书机", "剪刀", "阳电子炮", "雷神之锤", "朗基奴斯之枪", "钢加农", "RPG", "平底锅", "石中剑", "AK-47", "照相机", "柴刀", "三式弹", "照相机", "手里剑", "春药", "两把刷子", "钻头"],
		"skill": ["因果律", "地图炮", "王之宝库", "无敌炉石", "反物质武器", "超电磁炮", "梦想绚烂", "幸运E", "迷之自信", "不幸", "秽土转生", "元气弹", "黑暗料理", "下药"]
	}
};
(function() {
	var calcFontSize = function() {
		var html = document.documentElement;
		var defaultWidth = 320;
		var defaultFontSize = 20;

		return function() {
			var currentWidth = html.clientWidth;
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
})();

document.addEventListener('DOMContentLoaded', function() {
	this.documentElement.classList.add('loaded');
});

function getJsonLength(jsonData) {
	var jsonLength = 0;
	for (var item in jsonData) {
		jsonLength++;
	}
	return jsonLength;
}

//获取页面URL参数名
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURI(r[2]);
	return null;
};
if (document.documentElement.clientWidth > 1200) {
	document.documentElement.fontSize
}

function random(max) {
	return Math.floor(Math.random() * (max));
}
var conkey = (random(getJsonLength(lists.content))),
	getNum = (getQueryString("content") >= 0 && getQueryString("content") < getJsonLength(lists.content) ? getQueryString("content") : 1),
	num = getNum || conkey,
	content = lists.content[num].text,
	spread = lists.content[num].spread,
	item = lists.archives,
	getNum1 = (getQueryString("decoration") >= 0 && getQueryString("decoration") < item.decoration.length ? getQueryString("decoration") : 1),
	getNum2 = (getQueryString("equip") >= 0 && getQueryString("equip") < item.equip.length ? getQueryString("equip") : 1),
	getNum3 = (getQueryString("skill") >= 0 && getQueryString("skill") < item.skill.length ? getQueryString("skill") : 1),
	deckey = ((random(item.decoration.length))),
	equkey = ((random(item.equip.length))),
	skillkey = ((random(item.skill.length))),
	num1 = getNum1 || deckey,
	num2 = getNum2 || equkey,
	num3 = getNum3 || skillkey,
	archives = "<ul><li>勇者称号：<b>" + item.decoration[num1] + "之勇者</b></li><li>勇者技能：<b>" + item.skill[num3] + "</b></li><li>勇者装备：<b>" + item.equip[num2] + "</b></li></ul>"
$(".archives").html(archives);
$("#content").html(content);
$(".spread span").html(spread);

function setByUserLoginStatus(isLogin, unLogin) {
	var userInfo = {};
	var done = [];
	var cb = function(i) {
		done.push(i);

		//所有异步任务完成
		if (fnQueue.length === done.length) {
			typeof isLogin === 'function' && isLogin(userInfo);
		}
	};
	var fnQueue = [
		function(i) {
			callAppFunction('getDeviceID', {}, function(DeviceID) {
				userInfo.deviceid = DeviceID;
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
		}
	];

	callAppFunction('getAccountInfo', {}, function(result) {
		var result = function() {
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
			fnQueue.forEach(function(fn, i) {
				fn(i);
			});
		} else {
			//未登录
			typeof unLogin === 'function' && unLogin();
		}
	});
}

(function(W) {
	var pathHasM = /^\/m\//i.test(location.pathname);
	var base = pathHasM ? location.origin + '/m' : location.origin;

	W.CONFIG = {
		ajaxBase: 'http://api.comicool.cn/', //测试：http://comicool.cn:8000 正式：http://api.comicool.cn
	};
})(window);

function isInternal() {
	return getChanel() == 'test' && location.hostname.indexOf('ismanhua') != -1;
}

//渠道号是test调用测试接口
if (isInternal()) {
	CONFIG.ajaxBase = 'http://comicool.cn:8000/';
}
if (location.hostname.indexOf('192.168') != -1) {
	CONFIG.ajaxBase = 'http://comicool.cn:8000/';
}
//获取渠道号
function getChanel() {
	var urlCH = getQueryString('ch');
	var cookieCH = getCookie('_ch');
	var host = window.location.hostname;

	if (cookieCH != null) {
		if (urlCH != null) {
			if (urlCH === cookieCH) {
				return urlCH;
			} else {
				document.cookie = '_ch=' + urlCH + ';path=/;domain=' + host;
				return urlCH;
			}
		} else {
			return cookieCH;
		}
	} else {
		if (urlCH != null) {
			document.cookie = '_ch=' + urlCH + ';path=/;domain=' + host;
			return urlCH;
		} else {
			return null;
		}
	}
}
getChanel();


//设置cookies 
function setCookie(name, value, day) {
	var Days = day || 7;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ';path=/;domain=comicool.cn';
	return value;
};

//读取cookies 
function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg)) {
		return unescape(arr[2]);
	} else {
		return null;
	}
};

//删除cookies 
function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null) {
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ';path=/;domain=comicool.cn';
	}
};