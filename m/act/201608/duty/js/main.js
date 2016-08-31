var Duty = {
	process01: false, // 手机注册用户
	process02: false, // appstore_score 应用市场好评
	process03: false, // comic_share 分享漫画
	process04: false, // appshare 邀请好友下载
	process05: false, // normal 阅读5本漫画
	process06: false, // checkin 连续签到
}
var userinfo_g = {

};
var CONFIG = {
	//	ajaxBase: 'http://121.201.7.97:8004/', //测试：http://121.201.7.97/ 正式：http://proxy.icomico.com/
	ajaxBase: 'http://proxy.icomico.com/', //测试：http://121.201.7.97/ 正式：http://proxy.icomico.com/
	imgBase: 'http://cdn.icomico.com/',
};

var DEBUG = false;

function devLog(str) {
	if (DEBUG) {
		console.info(str);
	}
}

function init() {
	if(!isApp){
		$('.app-login').on('click', function() {
		window.location = 'comicool://m.app.comicool.cn/smart_open/web_browser.php?url=http://m.comicool.cn/act/201608/duty/index.html';
		//					window.location='comicool://m.app.comicool.cn/smart_open/web_browser.php';
//		callAppFunction('openLoginPage', {});
	});	
	}
	devLog('init info .......');

	if (isIOS) {
		new TipBox({
			title: '温馨提示',
			str: '此活动为安卓专享，IOS活动敬请期待吧！'
		});
		document.getElementsByClassName('container')[0].addEventListener('click', function() {
			new TipBox({
				title: '温馨提示',
				str: '此活动为安卓专享，IOS活动敬请期待吧！'
			});
		})
	} else if (isAndroidApp) {
		devLog('isApp ......');
		setByUserLoginStatus({
			isLogin: loginCallback,
			unLogin: unloginCallback
		});
	} else {
		$('.duty-container,.unlogin-span').on('click', function() {
			new TipBox({
				title: '温馨提示',
				str: '该活动需要在可米酷漫画APP内打开',
				btnText: ['下载', '取消'],
				btnCallback: funDownload
			});
		})

		function funDownload() {
			if (this.innerText == '下载') {
				if (isWeixin) { // 微信跳转到默认浏览器打开
					wxCoverShow();
				} else { // 下载链接
					var packageName = 'com.icomico.comi';
					var match = navigator.userAgent.match(/\/qqdownloader\/(\d+)/);
					if (match) {
						location.href = 'tmast://appdetails?pname=' + packageName + '&channelid=&oplist=1%3B2';
					} else {
						location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=' + packageName;
					}
				}
			}
		}
	}

	//未登录回调
	function unloginCallback() {
		//设置App里登录后的回调函数
		callAppFunction('setJSCallback', {
			'account_event': 'loginHandler'
		});
		document.getElementsByClassName('unlogin-span')[0].addEventListener('click', jumpLoginPage);
		$('.app-login').on('click',jumpLoginPage);	
		//		 document.getElementsByClassName('duty-btn').addEventListener('click', jumpLoginWithTip);
		$('.duty-btn').on('click', jumpLoginWithTip);
		window.loginHandler = function(obj) {
			$('.duty-btn').off('click', jumpLoginWithTip);
			setByUserLoginStatus({
				isLogin: loginCallback
			});
		}

		function jumpLoginPage() {
			callAppFunction('openLoginPage', {});
		}

		function jumpLoginWithTip() {
			new TipBox({
				title: '温馨提示',
				str: '仅限使用手机登录用户参与',
				btnText: ['登录', '取消'],
				btnCallback: funJumpLogin
			});

			function funJumpLogin() {
				if (this.innerText == '登录') {
					callAppFunction('openLoginPage', {});
				}
			}
		}
	}

	function loginCallback(userinfo) {
		$.extend(userinfo_g, userinfo);
		devLog('userinfo : ' + JSON.stringify(userinfo));
		bindEvent();
		document.getElementsByClassName('unlogin-span')[0].style.display = 'none';
		$('.app-login').hide();
		document.getElementsByClassName('name-span')[0].innerHTML = '昵称: ' + userinfo.nickname;
		document.getElementsByClassName('name-span')[0].style.display = 'block';

		dutyProcess(userinfo);
	}

}

//任务进度
function dutyProcess(userinfo) {
	devLog('dutyProcess....');
	var ajaxData = {
		url: CONFIG.ajaxBase + 'eventdutylist',
		jsonpCallback: 'jsonp_eventdutylist',
		data: {
			"ccid": userinfo.ccid,
			"ccpwd": userinfo.cctoken
		},
		success: function(data) {
			devLog(JSON.stringify(data));
			if (data) {
				initProcess(data);
			}
		},
		error: function(err) {
			devLog(JSON.stringify(err));
		}
	};

	getByAjax(ajaxData);

	function initProcess(processData) {
		if (processData.wealth_avail) {
			document.getElementsByClassName('cobi-act')[0].innerHTML = '酷币:' + processData.wealth_avail;
		}
		if (userinfo.usertype == 4) { // 手机用户
			Duty.process01 = true;
			document.getElementById('did-btn-01').style.display = 'block';
			devLog('手机用户');
		} else {
			devLog('非手机用户点击任务1');
			document.getElementById('duty-btn-01').addEventListener('click', function() {
				new TipBox({
					title: '温馨提示',
					str: '该活动需手机注册用户才能参加，快去用手机登录吧！',
					btnText: ['确定', '取消'],
					btnCallback: funRelogin
				});

				function funRelogin(obj) {
					if (this.innerText = '确定') {
						devLog('test')
						callAppFunction('setJSCallback', {
							'account_event': 'loginHandler'
						});
						window.loginHandler = function(obj) {
							setByUserLoginStatus({
								isLogin: loginCallback
							});
						}
						devLog('1');
						(function jumpLoginPage() {
							callAppFunction('openLoginPage', {});
						})()
						devLog('2');
					}
				}
			})
		}
		if (processData.duty_list && processData.duty_list.length > 0) {
			for (var i = 0, len = processData.duty_list.length; i < len; i++) {
				var dutyItem = processData.duty_list[i];
				devLog(JSON.stringify(dutyItem));
				switch (dutyItem.duty_type) {
					case 'appstore_score': // 应用市场好评
						if (dutyItem.status != 'notdo') {
							Duty.process02 = true;
							document.getElementById('duty-btn-02').removeEventListener('click', clickCallAppReturnMine);
							document.getElementById('did-btn-02').style.display = 'block';
						}
						break;
					case 'comic_share': // 漫画分享
						if (dutyItem.status != 'notdo') {
							Duty.process03 = true;
							document.getElementById('duty-btn-03').removeEventListener('click', clickCallAppReturnMine);
							document.getElementById('did-btn-03').style.display = 'block';
						}
						break;
					case 'appshare': // 邀请好友下载
						if (dutyItem.status != 'notdo') {
							Duty.process04 = true;
							document.getElementById('duty-btn-04').removeEventListener('click', clickCallAppReturnMine);
							document.getElementById('did-btn-04').style.display = 'block';
						}
						break;
					case 'normal': // 阅读5本漫画
						if (dutyItem.status != 'notdo') {
							Duty.process05 = true;
							document.getElementById('duty-btn-05').removeEventListener('click', clickCallAppReturnMine);
							document.getElementById('did-btn-05').style.display = 'block';
						}
						break;
					case 'checkin': //连签
						if (dutyItem.progress >= 3) {
							Duty.process06 = true;
							document.getElementById('duty-checkin-img').src = 'images/duty-checkin-3.png';
							document.getElementById('did-btn-06').style.display = 'block';
						} else if (dutyItem.progress == 2) {
							document.getElementById('duty-checkin-img').src = 'images/duty-checkin-2.png';
						} else if (dutyItem.progress == 1) {
							document.getElementById('duty-checkin-img').src = 'images/duty-checkin-1.png';
						}
						break;
				}
			}

			if (Duty.process01 &&
				Duty.process02 &&
				Duty.process03 &&
				Duty.process04 &&
				Duty.process05 &&
				Duty.process06) {
				document.getElementById('qb-cnt').innerHTML = '10个';
			}
		}
	}
}

function bindEvent() {
	devLog('bindEvent');
	//	document.getElementsByClassName('rules')[0].addEventListener('click', function() {
	//		document.getElementsByClassName('rule-content')[0].style.display = 'block';
	//		document.getElementsByClassName('cover')[0].style.display = 'block';
	//	});

	//	document.getElementsByClassName('rule-content')[0].addEventListener('click', function() {
	//		this.style.display = 'none';
	//		document.getElementsByClassName('cover')[0].style.display = 'none';
	//	});

	document.getElementsByClassName('exchange-btn')[0].addEventListener('click', function() {
		if (Duty.process01 &&
			Duty.process02 &&
			Duty.process03 &&
			Duty.process04 &&
			Duty.process05 &&
			Duty.process06) {
			document.getElementsByClassName('post-container')[0].style.display = 'block';
		} else {
			new TipBox({
				'str': '亲，任务全部完成才能领取哦！'
			})
		}
	});
	document.getElementById('cancel-btn').addEventListener('click', function() {
		document.getElementsByClassName('post-container')[0].style.display = 'none';
	})
	document.getElementById('post-btn').addEventListener('click', function() {
		var qqnum = document.getElementById('qqnum').value;
		var phonenum = document.getElementById('phonenum').value;
		//		console.info(qqnum + ' ' + phonenum);
		//		alert(qqnum + '=====' + phonenum+'==='+JSON.stringify(userinfo_g));
		if (qqnum && phonenum) {
			var ajaxData = {
				url: CONFIG.ajaxBase + 'userinfo_report4h5',
				jsonpCallback: 'jsonp_userinfo_report',
				data: {
					"device_id": userinfo_g.device_id,
					"ccid": userinfo_g.ccid,
					"cctoken": userinfo_g.cctoken,
					"user_type": userinfo_g.usertype,
					"phone_num": phonenum,
					"qq": qqnum
				},
				success: function(data) {
					if (data.msg == 'success') {
						//submit success
						document.getElementsByClassName('post-container')[0].style.display = 'none';
						new TipBox({
							str: '活动结束后将自动发放至您的QQ中，请注意查收'
						})
					}
				},
				error: function(err) {
					console.info(JSON.stringify(err));
				}
			};

			getByAjax(ajaxData);
		} else {
			new TipBox({
				str: '请输入完整的兑换信息'
			})
		}
	})

	document.getElementById('duty-btn-02').addEventListener('click', clickCallAppReturnMine);
	document.getElementById('duty-btn-03').addEventListener('click', clickCallAppReturnMine);
	document.getElementById('duty-btn-04').addEventListener('click', clickCallAppReturnMine);
	document.getElementById('duty-btn-05').addEventListener('click', clickCallAppReturnMine);
	document.getElementById('duty-btn-06').addEventListener('click', clickGotoHref);
	devLog('bindEvent end');
}

function clickCallAppReturnMine() {
	devLog('callAppFunction:returnToMainTab:mine');
	callAppFunction('returnToMainTab', {
		'tab_name': 'mine'
	});
}

function clickGotoHref() {
	//跳转签到页
	devLog('跳转签到页');
	window.location.href = 'http://m.comicool.cn/checkin2.html';
}

function getByAjax(obj) {
	if (obj.beforeSend && (obj.beforeSend() === false)) { //如果填写了beforSend且返回值为false
		complete();
		return false;
	}

	var ajaxParams = {
		url: obj.url || CONFIG.ajaxBase + obj.api,
		type: 'GET',
		data: obj.data,
		dataType: 'jsonp',
		jsonpCallback: obj.jsonpCallback,
		timeout: obj.timeout || 15000,
		beforeSend: function() {
			$('.loading-spinner').show();
			if (obj.beforeSend && obj.beforeSend() === false) { //如果填写了beforSend且返回值为false
				return false;
			}
		},
		complete: function() {
			obj.complete && obj.complete();
			$('.loading-spinner').hide();
		},
		success: obj.success,
		error: function() {
			obj.error && obj.error();
		}
	};

	//执行请求
	$.ajax(ajaxParams);
}

function wxCoverShow() {
	document.getElementsByClassName('wxShareCover')[0].style.display = 'block';
	document.getElementsByClassName('wxShareCover')[0].addEventListener('click', function() {
		document.getElementsByClassName('wxShareCover')[0].style.display = 'none';
	})
}