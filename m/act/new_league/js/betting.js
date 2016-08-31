//CONFIG.ajaxBase = 'http://121.201.7.97/';

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

(function() {
	function $(selector, parent) {
		return (parent || document).querySelector(selector);
	}

	function $$(selector, parent) {
		return (parent || document).querySelectorAll(selector);
	}
	var userInfo = null;
	var cacheInfo = null;
	var curBetComic = null;
	var curPostBox = null;
	var isLogin = false;
	var isBetted = false;
	var pullPostLock = false;
	var windowHeight = document.documentElement.clientHeight;
	var lastPostId = 0;
	var mask = $('#confirm_bg');
	var popup = $('.confirm_betting');
	var cancelBtn = $('.close_betting', popup);
	var okBtn = $('.go_betting', popup);
	var message = $('h2', popup);
	var originalMsg = message.innerHTML;
	// var postArea = $('.discuss_betting');
	// var postCounter = null;
	var hidePopup = function() {
		mask.style.display = popup.style.display = 'none';
	};
	var checkComicPoster = function(elem) {
		if (elem.classList.contains('go-read')) {
			return elem;
		} else if (elem.classList.contains('betting')) {
			return false; //返回false可以终止遍历
		}
	};
	/*var checkPostBox = function(elem) {
		if (elem.classList.contains('talk_comment')) {
			return elem;
		} else if (elem.classList.contains('discuss_betting')) {
			return false;
		}
	};
*/	var setUserInfo = function(obj) {
		userInfo = obj;
		isLogin = true;

		//		if (isAndroidApp && !cacheInfo) {
		//			return false;
		//		}
		getBaseInfo();
	};
	var renderUserInfo = {
		account: function(obj) {
			try {
				render('tmpl-userbar', obj);
				$('#user-bar').addEventListener('click', function() {
					callAppFunction('openNewBrowser', {
						url: 'http://' + window.location.host + '/betting_details.html',
						//					url:'http://m.ismanhua.com:8000/betting_details.html?ch=test',
						title: '押宝明细'
					});
				});
			} catch (e) {}
		},
		betCountInit: function(obj) {
			for (var i = 0; i < obj.ep_ext_list.length; i++) {
				var extlist = obj.ep_ext_list[i];
				if (extlist.bet_count > 0) {
					var anteid = extlist.comic_id;
				}
				var expenseday = document.getElementsByClassName('works_betting');
				var bet_count = document.getElementsByClassName("bet_count");
				for (j = 0; j < expenseday.length; j++) {
					if (expenseday[j].dataset.cid == extlist.comic_id) {
						bet_count[j].innerHTML = extlist.bet_count + "注";
					}
					if (expenseday[j].dataset.cid == anteid) {
						curBetComic = expenseday[j];
					}
				}
			}
			if (curBetComic) {
				var curButton = $('.start_betting', curBetComic);
				var buttons = $$('.start_betting');
				for (var i = 0, len = buttons.length; i < len; i++) {
					if (buttons[i] != curButton) {
						buttons[i].className = 'connot_betting';
					} else {
						buttons[i].className = 'start_betting add_betting';
					}
				}
			}
		},
		betCountUpdate: function() {
			var curButton = $('.start_betting', curBetComic);
			var buttons = $$('.start_betting');
			for (var i = 0, len = buttons.length; i < len; i++) {
				if (buttons[i] != curButton) {
					buttons[i].className = 'connot_betting';
				} else {
					buttons[i].className = 'start_betting add_betting';
				}
			}
			var elem = $('.bet_count', curBetComic);
			var oldCount = parseInt(elem.innerHTML);
			if (isNaN(oldCount)) {
				oldCount = 0;
			}
			elem.innerHTML = oldCount + 1 + '注';
		}
	};
/*	var renderPostInfo = {
		postAdd: function(post_info, user_info, direction, cb) {
			var result = template('tmpl-comments', {
				post_list: post_info,
				user_list: user_info
			});
			var header = $('.talk_title_betting');
			var temp = document.createElement('div');
			temp.innerHTML = result;

			if (direction === 1) {
				postCounter.innerHTML = +postCounter.innerHTML + 1;
				insertAfter(header, temp.children);
			} else {
				for (var i = 0, len = temp.children.length; i < len; i++) {
					postArea.append(temp.firstElementChild);
				}
			}

			typeof cb === 'function' && cb();
			temp = null;
		},
		postDelete: function() {
			var parent = curPostBox.parentNode;
			parent.removeChild(curPostBox);
			postCounter.innerHTML -= 1;
		},
		postUpdate: function(obj) {
			var parseBox = $('.icon-xin', curPostBox).lastChild;
			parseBox.textContent = obj.post_info.praise_count;
		}
	};*/
	var renderBaseInfo = function(res) {

		//漫画列表区域
		if (res.ep_ext_list) {
			for (var i = 0, len = res.ep_ext_list.length; i < len; i++) {
				if (res.ep_ext_list[i] && res.ep_ext_list[i].bet_count > 0) {
					isBetted = true;
					break;
				}
			}
		}


//render('tmpl-main', {
//				res: res,
//				isLogin: isLogin,
//				isBetted: isBetted,
//				counter: countDown.init(res.bet_info.end_time)
//			});
			countDown(res.bet_info.end_time);
		try {
			render('tmpl-main', {
				res: res,
				isLogin: isLogin,
				isBetted: isBetted,
				counter: countDown.init(res.bet_info.end_time)
			});
			countDown(res.bet_info.end_time);
		} catch (e) {
			var matchError = '<div><img src="http://cdn.icomicool.cn/m/images/betting/errimg.jpg" width="100%"></div>';
			$(".betting").innerHTML = matchError;
		}
	};

	//设置用户登录状态行为
	setByUserLoginStatus({
		isLogin: setUserInfo,
		unLogin: function(obj) {
			userInfo = obj;
		}
	});
	getBaseInfo();
	//注册客户端事件触发的回调
	callAppFunction('setJSCallback', {
		'account_event': 'loginHandler',
		/*'post_send_event': 'postSendHandler',
		'post_detail_event': 'postDetailHandler',*/
		'bet_event': 'beteventHandler'
	});
	window.beteventHandler = function(jsonString) {
		var obj = JSON.parse(jsonString);
		var ccid = obj.ccid;
		var comic_id = obj.comic_id;
		var ret = obj.ret;
		if (ret == 0) {
			var expenseday = document.getElementsByClassName('works_betting');
			for (i = 0; i < expenseday.length; i++) {
				if (expenseday[i].dataset.cid == comic_id) {
					curBetComic = expenseday[i];
				}
			}
			renderUserInfo.betCountUpdate();
		}
	}

	window.loginHandler = function() {
		setByUserLoginStatus({
			isLogin: setUserInfo
		});
	};
/*	window.postSendHandler = function(jsonString) {
		var obj = JSON.parse(jsonString);
		var post_info = obj.post_info;
		var user_info = obj.user_info;

		if (post_info && user_info) {
			renderPostInfo.postAdd([post_info], [user_info], 1);
		}
	};
	window.postDetailHandler = function(jsonString) {
		var obj = JSON.parse(jsonString);

		if (obj.delete_id) {
			renderPostInfo.postDelete();
		} else {
			renderPostInfo.postUpdate(obj);
		}
	};*/

	//事件绑定
	$('.betting').addEventListener('click', function(e) {
		var target = e.target;
		var tagName = target.tagName.toLowerCase();
		var classList = target.classList;
		var comicBox = getParentByClass(target, 'works_betting') || {};
		var dataset = comicBox.dataset || {};
		var cid = dataset.cid;
		var epid = dataset.epid;
		var title = dataset.title;
		var poster = dataset.poster;

		//点击押宝
		if (classList.contains('start_betting')) {
			if (isLogin) {
				if (classList.contains('add_betting')) {
					curBetComic = comicBox;
					sendBetting(function(msg) {
						popup.classList.add('betting_message');
						message.innerHTML = msg;
					});
				} else {
					mask.style.display = popup.style.display = 'block';
					curBetComic = comicBox;
				}
			} else {
				callAppFunction('openLoginPage', {});
			}
		} else if (classList.contains('ep-share')) {
			callAppFunction('popupSharePanel', {
				title: title,
				describe: '预测《' + title + '》下期周赛能拿冠军，和我一起押宝赚酷币啦！',
				weibo_describe: '预测#' + title + '#下期周赛能拿冠军，和我一起押宝赚酷币啦！（分享自 @可米酷漫画）',
				imageurl: poster,
				page_url: 'http://m.comicool.cn/betting_share.html?comic_id=' + cid + '&ep_id=' + epid
			});
		} else if (checkSelfThenParents(target, checkComicPoster)) {
			if(isApp){
			callAppFunction('openEpisodeReaderPage', {
				mode: 'bet',
				comic_id: cid,
				ep_id: epid
			});
			}else{
			window.location.href = 'http://m.comicool.cn/content/reader.html?comic_id=' + cid + '&ep_id='+epid;
			}
		}
	});

	popup.addEventListener('click', function(e) {
		var target = e.target;
		if (target.classList.contains('go_betting')) {
			target.classList.add('ok_betting');
			target.classList.remove('go_betting');
			hidePopup();
			$(".ok_betting").className = "go_betting";
			sendBetting(function(msg) {
				popup.classList.add('betting_message');
				message.innerHTML = msg;
			});
			//				window.location.reload();
		}
	});
	mask.addEventListener('click', hidePopup);
	cancelBtn.addEventListener('click', hidePopup);

	function getBaseInfo(obj) {
		var data = {};

		extendObj(data, userInfo, ['os_type', 'device_id', 'channel']);

		if (cacheInfo) {
			extendObj(data, cacheInfo);
		}
		if (isLogin) {
			extendObj(data, userInfo, ['ccid', 'cctoken', 'usertype']);
		}

		jsonp({
			url: CONFIG.ajaxBase + 'betInfolist4h5?t=' + Date.parse(new Date()),
			data: data,
			callback: 'jsonp_betInfolist',
			success: function(res) {
				var surplusTime='';
				var end_time=res.bet_info.end_time;
				var timestamp = parseInt(new Date().getTime()/1000);
				if(end_time>timestamp){
					surplusTime=Math.floor((end_time-timestamp)/86400);
				}else{
					surplusTime=0;
				}
				document.getElementById('surplusDays').innerHTML=surplusTime;
				console.log(res);
				if (cacheInfo) {
					//更新用户视图
					renderUserInfo.account(res);
					renderUserInfo.betCountInit(res);
				} else {
					if (isLogin) {
						renderUserInfo.account(res);
					}
					renderBaseInfo(res);
					cacheInfo = extendObj({}, res, ['league_id', 'league_info_update_time', 'ep_list_update_time', 'banner_list_update_time']);
				}
			}
		});
	}


	function sendBetting(callback) {
		var data = {
			comic_id: curBetComic.dataset.cid
		};

		extendObj(data, userInfo);
		jsonp({
			url: CONFIG.ajaxBase + 'bet4h5',
			callback: 'jsonp_bet',
			data: data,
			success: function(res) {
				var message;
				if (res.ret == 0) {
					message = '押注成功';
					hidePopup();
					drawToast(message);
					renderUserInfo.betCountUpdate();
				} else if (res.ret == 1) {
					message = '酷币不足，押注失败';
				} else if (res.ret == 2) {
					message = '你已对其他作品下注';
				} else if (res.ret == 3) {
					message = '下注次数超过上限';
				} else {
					message = '下注失败';
				}
				hidePopup();
				drawToast(message);
			}
		});
	}

	function countDown(timestamp) {
		var box = $('#surplusDays');
		var spans = $$('span', box);
		var dayCont = spans[0];
		var hourCont = spans[1];
		var minuteCont = spans[0];
		function update(offset) {
			var offset = offset || 60;
			var text = countDown.init(timestamp);
			dayCont.innerHTML = text.d;
			hourCont.innerHTML = text.hh;
			if (parseInt(text.ss) < 0) {
				$('.time_betting span').eq(0).html('请稍后');
				hourCont.innerHTML = 0;
				return;
			} else {
				setTimeout(update, 60000);
			}
		}
	}

	// 各种浏览器兼容
	var hidden, state, visibilityChange;
	if (typeof document.hidden !== "undefined") {
		hidden = "hidden";
		visibilityChange = "visibilitychange";
		state = "visibilityState";
	} else if (typeof document.mozHidden !== "undefined") {
		hidden = "mozHidden";
		visibilityChange = "mozvisibilitychange";
		state = "mozVisibilityState";
	} else if (typeof document.msHidden !== "undefined") {
		hidden = "msHidden";
		visibilityChange = "msvisibilitychange";
		state = "msVisibilityState";
	} else if (typeof document.webkitHidden !== "undefined") {
		hidden = "webkitHidden";
		visibilityChange = "webkitvisibilitychange";
		state = "webkitVisibilityState";
	}

	// 添加监听器，在title里显示状态变化
	document.addEventListener(visibilityChange, function() {
		if (!document.hidden) {
			getBaseInfo();
		}
	}, false);

	countDown.init = function(timestamp) {
		var now = new Date().getTime();
		var remainSeconds = timestamp - Math.round(now / 1000);
		var days = parseInt(remainSeconds / 60 / 60 / 24);
		var hours = parseInt(remainSeconds / 60 / 60 % 24);
		var minutes = parseInt(remainSeconds / 60 % 60);
		var seconds = parseInt(remainSeconds % 60);
		var addZero = function(num) {
			if (num < 10) {
				return '0' + num;
			} else {
				return num;
			}
		};
		days = addZero(days);
		hours = addZero(hours);
		minutes = addZero(minutes);
		return {
			d: days,
			hh: hours,
			mm: minutes,
			ss: seconds
		}
	};
})();
var intervalCounter = 0;

function hideToast() {
	var alert = document.getElementById("toast");
	alert.style.opacity = 0;
	clearInterval(intervalCounter);
}

function drawToast(message) {
	var alert = document.getElementById("toast");
	if (alert == null) {
		var toastHTML = '<div id="toast">' + message + '</div>';
		document.body.insertAdjacentHTML('beforeEnd', toastHTML);
	} else {
		alert.remove();
		drawToast(message);
	}
	intervalCounter = setInterval("hideToast()", 1000);
}