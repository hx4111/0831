//CONFIG.ajaxBase="http://proxy.icomico.com/"
var cycle = getQueryString("cycle");
try {
	filling[cycle].pic;
} catch (e) {
	var item = 0;
	for (index in filling) {
		item++;
	}
	cycle = item;
	if (filling[cycle].timing && (parseInt(getNowFormatDate()) + 1) == filling[cycle].timing) {
		cycle = --cycle;
	}
}

var checkinGlobal = {
	hideToast: function() {
		var alert = document.getElementById("toast");
		alert.style.opacity = 0;
		clearInterval(intervalCounter);
	},
	drawToast: function(message) {
		var alert = document.getElementById("toast");
		if (alert == null) {
			var toastHTML = '<div id="toast">' + message + '</div>';
			document.body.insertAdjacentHTML('beforeEnd', toastHTML);
		} else {
			alert.remove();
			checkinGlobal.drawToast(message);
		}
		intervalCounter = setInterval("checkinGlobal.hideToast()", 1000);
	},
	//取得cookie    
	getCookie: function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';'); //把cookie分割成组    
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i]; //取得字符串    
			while (c.charAt(0) == ' ') { //判断一下字符串有没有前导空格    
				c = c.substring(1, c.length); //有的话，从第二位开始取    
			}
			if (c.indexOf(nameEQ) == 0) { //如果含有我们要的name    
				return unescape(c.substring(nameEQ.length, c.length)); //解码并截取我们要值    
			}
		}
		return false;
	},
	//设置cookie    
	setCookie: function(name, value, seconds) {
		seconds = seconds || 0; //seconds有值就直接赋值，没有为0，这个跟php不一样。    
		var expires = "";
		if (seconds != 0) { //设置cookie生存时间    
			var date = new Date();
			date.setTime(date.getTime() + (seconds * 1000 * 24));
			expires = "; expires=" + date.toGMTString();
		}
		document.cookie = name + "=" + escape(value) + expires + "; path=/"; //转码并赋值    
	}, //清除cookie    
	clearCookie: function(name) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = getCookie(name);
		if (cval != null)
			document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
		checkinGlobal.setCookie(name, "", -1);
	}
}

// 获取系统时间并补零
function getNowFormatDate() {
	var day = new Date();
	var Year = 0;
	var Month = 0;
	var Day = 0;
	var CurrentDate = "";
	//初始化时间 
	//Year       = day.getYear();//有火狐下2008年显示108的bug 
	Year = day.getFullYear(); //ie火狐下都可以 
	Month = day.getMonth() + 1;
	Day = day.getDate();
	CurrentDate += Year;
	if (Month >= 10) {
		CurrentDate += Month;
	} else {
		CurrentDate += "0" + Month;
	}
	if (Day >= 10) {
		CurrentDate += Day;
	} else {
		CurrentDate += "0" + Day;
	}

	return CurrentDate;
};
var hodgepodge = "";
for (item in filling[cycle].pic) {
	hodgepodge += '<li><img src="' + filling[cycle].pic[item] + '" alt="' + getShare(cycle, "alt", 0) + '"></li>';
}
document.getElementById("check_hodgepodge").innerHTML = hodgepodge;

//大杂烩里面有视频
var videoList = {
	videoGet: function(url, mark, background, name) { //形参url和插入位置,视频默认截图,ID名字
		var createLi = document.createElement("li");
		createLi.innerHTML = '<video src="' + url + '" controls="controls" preload="none" poster="' + background + '" id="video' + name + '">您的浏览器不支持 video 标签。</video>';
		document.getElementById("check_hodgepodge").getElementsByTagName("li")[mark].appendChild(createLi);
		var flag = true,
			videoId = "video" + name,
			v = document.getElementById(videoId);
		v.onclick = function() { //每个视频点击
			if (flag) {
				v.play();
				flag = false;
			} else {
				v.pause();
				flag = true;
			}
		};
	},
	videoShow: function() {
		var videoData = filling[cycle].video;
		for (var i = 0, len = videoData.length; i < len; i++) {
			videoList.videoGet(videoData[i].url, videoData[i].mark, videoData[i].background, videoData[i].name); //关联数组取视频数据
		}
	}
};
try {
	videoList.videoShow(); //判断有没有视频
} catch (e) {}
//				判断有没有之前点赞
var flag_forty_two = checkinGlobal.getCookie("flag_forty_two");
var flag_forty_three = checkinGlobal.getCookie("flag_forty_three");
if (flag_forty_two) {
	$("#oppose i").addClass("current");
} else if (flag_forty_three) {
	$("#support i").addClass("current");
}
//				下面的按钮点赞
$("#zan ul").on("click", function() {
	var flag_forty_two = checkinGlobal.getCookie("flag_forty_two");
	var flag_forty_three = checkinGlobal.getCookie("flag_forty_three");
	//	checkinGlobal.clearCookie("flag_forty_two")
	//	checkinGlobal.clearCookie("flag_forty_three")
	var hasPraised = $(this).attr("id");
	if (flag_forty_two || flag_forty_three) {
		checkinGlobal.drawToast("你好像表过态");
	} else {
		if (hasPraised == "oppose") {
			var num = $("#oppose span").html();
			$("#oppose span").html(parseInt(num) + 1);
			$("#oppose i").addClass("current");
			$.get("http://comicool.cn/simple_vote.php?sel=42");
			checkinGlobal.setCookie("flag_forty_two", "true", 30);
		} else {
			var num = $("#support span").html();
			$("#support span").html(parseInt(num) + 1);
			$("#support i").addClass("current");
			$.get("http://comicool.cn/simple_vote.php?sel=43");
			checkinGlobal.setCookie("flag_forty_three", "true", 30);
		}
	}
})
$.ajax({
	url: 'http://comicool.cn/simple_vote.php',
	dataType: "jsonp",
	data: {},
	jsonpCallback: "jsonp_match",
	success: function(data) {
		$("#oppose span").html(data.results[42]);
		$("#support span").html(data.results[43]);
	}
})

function getShare(cycle, prent, key) { //如果没有设置分享内容，就用第1个分享
	try {
		return filling[cycle][prent][key];
	} catch (e) {
		return filling[1][prent][key];
	}
};

window.onload=function(){
	setShareInfo({
	title: getShare(cycle, "share", "title"),
	describe: getShare(cycle, "share", "describe"),
	imageUrl: getShare(cycle, "share", "imageUrl"),
	pageUrl: window.location.href
}, {
	use: 'baidu',
	init: initBaiduSharePanel
});

function initBaiduSharePanel() {
        var _ = function(selector, parent) {
                return (parent || document).querySelector(selector);
            },
            header = _('.header'),
            trigger = _('.icon-share', header),
            mask = _('#ShareBg'),
            shareBtn = _('#share-btn'),
            panelTitle = _('#ShareCon h2'),
            panel = _('.bdsharebuttonbox'),
            cancelBtn = _('.share-clo', panel),
            panelImageCont = _('#ShareCon em'),
            panelImage = new Image(),
            hidePanel = function() {
            	mask.innerHTML='';
                mask.style.display = panel.style.display = 'none';
            };
        header.style.display = 'block';
        panelTitle.innerHTML = this.title;
        panelImage.src = this.imageUrl;
        panelImageCont.appendChild(panelImage);
        if (CONFIG.isWeixin) {
			trigger.addEventListener('click', function() {
				mask.style.display = 'block';
				mask.innerHTML = '<img src="http://cdn.icomicool.cn/m/images/shareTip.png" >';
				header.style.display = 'none';
			});
			mask.addEventListener('click', function(){
				mask.innerHTML='';
				mask.style.display = 'none';
				header.style.display = 'block';
			})
		} else {
			trigger.addEventListener('click', function() {
				mask.style.display = panel.style.display = 'block';
			});
			mask.addEventListener('click', hidePanel);
			cancelBtn.addEventListener('click', hidePanel);
		}
    }
}

$("#checkin_history").on("click", function() {
	$(".checkin_calendar").show();
	$("#ShareBg").show();
})
$("#ShareBg,.checkin_calendar").on("click", function() {
	$(".checkin_calendar").hide();
	$("#ShareBg").hide();
})

//function $(selector, parent) {
//	return (parent || document).querySelector(selector);
//}
//
//function $$(selector, parent) {
//	return (parent || document).querySelectorAll(selector);
//}

function getByJsonp(options) {
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
			parent.append(elem[i]);
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

function Calendar(selector, days, classNames) {
	var d = new Date();
	var now = +d;
	var millisecondOfOneDay = 1000 * 60 * 60 * 24;
	var container = $(selector);
	var temp = document.createDocumentFragment();
	var span = '';
	var that = this;
	var lastCheckDate = 0;
	var durativeDays = 1;

	for (var i = days; i > 0; i--) {
		d.setTime(now - millisecondOfOneDay * (i - 1));
		span += '<span>' + d.getDate() + '</span>';
	}
	$('.checkin_calendar').append(span);
	$('.checkin_calendar span').last().addClass('checkin_date');

	that.timestamp2date = function(unixTimestamp) {
		return new Date(unixTimestamp * 1000).getDate();
	};

	that.update = function(obj) {
		//		console.log(JSON.stringify(obj))
		for (var i = 0, item; item = $('.checkin_calendar span')[i++];) {
			var durativeDays = obj[item.innerText];
			if (durativeDays) {
				if (durativeDays in classNames) {
					item.className = classNames[durativeDays];
				} else {
					item.className = classNames[1];
				}

			}
		}
	};

	that.mark = function(data) {
		var obj = {};
		var arr = [];
		if (data instanceof Array) {
			data.forEach(function(item, index) {
				arr.push({
					date: that.timestamp2date(item.timestamp),
					flag: item.flag
				});
			});
		} else if (data.type === 'date') {
			arr.push({
				date: data.date,
				flag: data.flag
			});
		} else if (data.type === 'timestamp') {
			arr.push({
				date: that.timestamp2date(data.timestamp),
				flag: data.flag
			});
		}

		var lastFlag = "";
		arr.forEach(function(item, index) {
			if (item.flag == 'checkin_3days' && lastFlag != item.flag) {
				durativeDays = '3';
			} else if (item.flag == 'checkin_7days' && lastFlag != item.flag) {
				durativeDays = '7';
			} else {
				durativeDays = '1';
			}
			obj[item.date] = durativeDays;
			lastFlag = item.flag;
		});
		that.update(obj);
	};
}

(function() {
	var calendar = new Calendar('.checkin_calendar', 15, {
		'1': 'checkin_claw',
		'3': 'checkin_tag_3',
		'7': 'checkin_tag_7'
	});
	var userInfo = null;
	var isLogin = false;
	var isSetCalender = false;
	var checkinRequestLock = false;
	var initLogin = function(obj) {
		userInfo = obj;
		isLogin = true;
		$('.checkin_btn').unbind('click', jumpLoginPage);
		$('.checkin_btn').bind('click', requestCheckin);

		if (isAndroidApp && isSetCalender) {
			return false;
		}
		getCheckHistory();
	};

	setByUserLoginStatus({
		isLogin: initLogin,
		unLogin: function(obj) {
			callAppFunction('setJSCallback', {
				'account_event': 'loginHandler'
			});
			window.loginHandler = function() {
				setByUserLoginStatus({
					isLogin: initLogin
				});
			};
		}
	});

	getCommendComics();
	getCheckHistory();

	$('.checkin_btn').bind('click', jumpLoginPage);

	function jumpLoginPage() {
		if (CONFIG.isApp) {
			callAppFunction('openLoginPage', {});
		} else {
			alert('下载可米酷App才能继续玩耍哦,看更多精彩漫画还能领奖励');
		}

	}

	function getCheckHistory() {
		var data = {
			record_count: 15,
			duty_type: "checkin"
		};

		if (isLogin) {
			extendObj(data, userInfo, ['ccid', 'cctoken', 'usertype', 'os_type', 'device_id', 'channel']);
		} else {
			return;
		}

		//				alert(JSON.stringify(data))
		getByJsonp({
			url: 'http://proxy.icomico.com/dutyrecord4h5',
			data: data,
			callback: 'jsonp_dutyrecord4h5',
			success: function(res) {
				setCalendar(res);
				isSetCalender = true;
			}
		});
	}

	function getCommendComics() {
		getByJsonp({
			url: 'http://proxy.icomico.com/timeline4h5',
			callback: 'jsonp_timeline',
			success: function(res) {
				//				console.log(res);
				var dayIndex = res.now_weekid - 1;
				var obj = res.timeline_list[dayIndex];
				var comi_list = obj.comi_list;
				if (comi_list instanceof Array) {
					comi_list = comi_list.sort(function(item1, item2) {
						return item2.praise_count - item1.praise_count;
					});
					obj.comi_list = comi_list;
				}
				//						$('#tmpl-commend').outerHTML = template('tmpl-commend', obj);
				//						bindOpenComicEvents();
			}
		});
	}

	function setCalendar(res) {
		if (res.records) {
			var lastCheckinTime = res.records[res.records.length - 1].done_time * 1000;
			var checkinDate = new Date(lastCheckinTime);
			var nowDate = new Date();
			var timeArr = [];
			res.records.forEach(function(item) {
				if (item.duty_type === 'checkin') {
					timeArr.push({
						timestamp: item.done_time,
						flag: item.done_flag
					});
				}
			});
			//			console.log(JSON.stringify(timeArr))
			calendar.mark(timeArr);

			if (checkinDate.getDate() == nowDate.getDate() && checkinDate.getMonth() == nowDate.getMonth() && checkinDate.getFullYear() == nowDate.getFullYear()) {
				disabledCheckin();
			}
		}
	}

	function requestCheckin() {
		if (!checkinRequestLock) {
			var data = {
				duty_id: '2',
				duty_type: 'checkin',
			};
			checkinRequestLock = true;
			extendObj(data, userInfo);
			getByJsonp({
				url: 'http://proxy.icomico.com/report_duty4h5',
				//				url: 'http://121.201.7.97:8004/report_duty4h5',
				data: data,
				callback: 'jsonp_report_duty',
				success: function(res) {
					if (res.ret == 0) {
						calendar.mark({
							type: 'timestamp',
							timestamp: Math.floor(new Date() / 1000),
							flag: res.done_flag
						});
						disabledCheckin();
					} else {
						alert(res.msg);
					}
					checkinRequestLock = false;
				}
			});
		}
	}

	function disabledCheckin() {
		$('.checkin_btn').unbind('click', requestCheckin);
		$('.checkin_btn').addClass('checkin_btn_ok');
	}

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

	var renderPostInfo = {
		postAdd: function(post_info, user_info, direction, cb) {
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
		getByJsonp({
			url: 'http://proxy.icomico.com/getpostlist4h5',
			callback: 'jsonp_getpostlist',
			data: {
				include: 'topic2014',
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
		if (isApp) {
			callAppFunction('openPostSend', {
				post_type: "topic2014",
			});
		} else {
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
			isLogin: initLogin
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