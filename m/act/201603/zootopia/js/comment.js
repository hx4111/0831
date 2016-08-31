function $$(selector, parent) {
	return (parent || document).querySelectorAll(selector);
}
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
	var pullPostLock = false,
		postArea = $('.discuss_betting'),
		postBtn = $('.publish_betting'),
		isLogin = false,
		userInfo = null,
		cacheInfo = null,
		lastPostId = 0,
		myDate = new Date(),
		timestamp = "" + myDate.getFullYear() + myDate.getMonth() + myDate.getDate();
	windowHeight = document.documentElement.clientHeight;
	getPostList(0, 5);
	window.addEventListener('scroll', checkMeetPageBottom);

	function isArray(arr) {
		return arr instanceof Array;
	}
	var checkPostBox = function(elem) {
		if (elem.classList.contains('comment-content')) {
			return elem;
		} else if (elem.classList.contains('discuss_betting')) {
			return false;
		}
	};
	var checkSupport = function(elem) {
		if (elem.classList.contains('icon-xin')) {
			return elem;
		} else if (elem.classList.contains('discuss_betting')) {
			return false;
		}
	};
	postArea.on('click', function(e) {
		var target = e.target;
		var PostBox = getParentByClass(target, 'talk_comment');
		var Support = getParentByClass(target, 'icon-xin');
		var post_id = PostBox.dataset.id;

		if (checkSelfThenParents(target, checkPostBox)) {
			curPostBox = PostBox;
			callAppFunction('openPostDetail', {
				post_id: post_id
			});
		}
		if (checkSelfThenParents(target, checkSupport)) {
			curPostBox = PostBox;
			callAppFunction('openPostDetail', {
				post_id: post_id
			});
		}
	});

	var renderPostInfo = {
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
	};

	function checkMeetPageBottom(e) {
		var threshold = document.documentElement.scrollHeight - windowHeight - 99;
		var curScrollTop = document.body.scrollTop;

		if (curScrollTop >= threshold) {
			getPostList(lastPostId, 5);
		}
	}

	function getPostList(post_id, page_size) {
		if (pullPostLock) {
			return;
		}
		pullPostLock = true;
		setPostTip('正在加载..');
		jsonp({
			url: CONFIG.ajaxBase + 'getpostlist4h5',
			callback: 'jsonp_getpostlist',
			data: {
				include: 'topic2002',
				order_type: 'update_time',
				page_direction: 2,
				post_id: post_id,
				page_size: page_size
			},
			success: function(res) {
				var callback = function() {
					var tip = $('.post-tip');
					if (tip) {
						tip.remove(tip);
					}
				};
				pullPostLock = false;
				//第一次加载
				if (post_id === 0) {
					render('tmpl-discuss', res, callback);
					postCounter = $('#post-counter');
				} else {
					renderPostInfo.postAdd(res.post_list, res.user_list, 2, callback);
				}
				//有评论信息
				if (res.post_list) {
					lastPostId = res.post_list[res.post_list.length - 1].post_id;
				} else {
					if (post_id === 0) {
						setPostTip('暂时还没有讨论', true);
					} else {
						setPostTip('没有更多讨论了', true);
					}
				}
			}
		});
	}

	function setPostTip(msg, isRemoveHandler) {
		var div = $('.post-tip');

		if (!div) {
			div = document.createElement('div');
			div.className = 'post-tip';
		}
		div.innerHTML = msg;

		postArea.append(div);
		if (isRemoveHandler) {
			window.removeEventListener('scroll', checkMeetPageBottom);
		}
	}
	postBtn.on('click', function() {
		if(isApp){
			callAppFunction('openPostSend', {
				post_type: "bet",
				league_id: '2002'
			});
		}else{
		window.location.href = "http://m.app.comicool.cn/down.html";	
		}
	});

	function getBaseInfo(obj) {
		var data = {};

		extendObj(data, userInfo, ['os_type', 'device_id', 'channel']);

		if (cacheInfo) {
			extendObj(data, cacheInfo);
		}
		if (isLogin) {
			extendObj(data, userInfo, ['ccid', 'cctoken', 'usertype']);
		}
	}
	var setUserInfo = function(obj) {
		userInfo = obj;
		isLogin = true;
		getBaseInfo();
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
		'post_send_event': 'postSendHandler',
		'post_detail_event': 'postDetailHandler',
	});

	window.loginHandler = function() {
		setByUserLoginStatus({
			isLogin: setUserInfo
		});
	};
	window.postSendHandler = function(jsonString) {
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
	};
})();