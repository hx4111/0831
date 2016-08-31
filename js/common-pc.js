var Comi = {};
Comi.Login = {
	check: function() {
		var user = getCookie('comiUser');
		return JSON.parse(user);
	},
	renderUnLogin: function(callback) {
		var t = this;
		//		$('.h-top-person').empty();
		//头部登录、注册信息等
		var loginHtml = '<div class="h-top-person">' + '<a href="javascript:;" class="link-register">登录</a>' + '</div>';
		//		$('body').append(propsHtml);
		$('.h-top-t').html(loginHtml);
		ComiLoginWindow.click();
		if (typeof callback == 'function') {
			callback(t);
		}
		window.onload = t.initSDK;
	},
	initSDK: function(spec, callback) {
		var noSpec = typeof spec != 'string' ? true : false;

		if (!noSpec) {
			Comi.Login.renderUnLogin();
		}
	},
	signIn: function(userInfo, isInitSDK) {
		var usertype = userInfo.usertype;
		var t = this;
		t.isInitSDK = isInitSDK;
		ComiLoginWindow.click();
		render({
			'icon': userInfo.icon,
			'nickname': userInfo.nickname
		});
		ComiLoginWindow.hide();
		$('.sign-out').click(function() {
			t.signOut.call(t);
		});

		function render(obj) {
			var html = '' + '<span class="user-photo"><img src="' + obj.icon + '" class="user-photo"/></span>' + '<span>' + obj.nickname + '</span>&nbsp;' + '<span class="sign-out"><a href="javascript:void(0);">退出</a></span>';
			$('.h-top-t').html('<div class="h-top-person">' + html + '</div>');
			//			if ($('.h-top-person').size()) {
			//				$('.h-top-person').html(html);
			//			} else {
			//				$('.h-top-t').html(
			//					'<div class="h-top-person">' + html + '</div>'
			//				);
			//			}
		}
	},
	signOut: function(userInfo) {
		var isInitSDK = this.isInitSDK;
		var type, fn;
		delCookie('comiUser');
		Comi.Login.renderUnLogin();
	},
	setComiUser: function(userInfo) {
		//		delete userInfo.cctoken;
		this.signIn(userInfo, true);
		setCookie('comiUser', JSON.stringify(userInfo), 1);
	},
	getDeviceID: function() {
		var deviceID = getCookie('deviceID');
		if (!deviceID) {
			deviceID = createDeviceID();
			setCookie('deviceID', deviceID, 9999);
		}
		return deviceID;
	}
};

/**
 * 下拉菜单模拟
 */
$.fn.dropBox = function(fn) {
	var $t = $(this);

	$(this).each(function(i) {
		var $me = $(this);
		var $dropT = $me.find('.drop-t');
		var $dropB = $me.find('.drop-b');

		$dropT.click(function() {
			if ($dropB.is(':visible')) {
				$dropB.hide();
				$(document).off('click', docClick);
			} else {
				$dropB.show();
				$(document).on('click', {
					scope: $me,
					handleEl: $dropB
				}, docClick);
			}
		});

		if (typeof fn == 'function') {
			$dropB.find('p').each(function(i) {
				$(this).click(function() {
					$dropT.find('span').html($(this).text());
					$dropB.hide();
					fn(i);
				});
			});
		}
	});

	//点击控件以外的地方隐藏dropbox
	function docClick(event) {
		var $target = $(event.target);
		var $scope = $(event.data.scope);
		var $handleEl = $(event.data.handleEl);

		if ($scope.has($target).size()) {
			return false;
		} else {
			$handleEl.hide();
		}
	}
}

/**
 * 通过ajax的jsonp获取版块数据
 * @param  {Object} obj 可设置api、jsonpCallback、success、beforeSend、complete等
 * @return {Functioin}     返回内部的complete方法供外部执行（切换排行榜时要执行图片加载）
 */
$.fn.getByAjax = function(obj) {
	var $t = $(this),
		user = Comi.Login.check(),
		errImg = CONFIG.errorImg,
		getCh = getChanel();
	if (getCh) {
		var dataObj = $.extend(obj.data || null, {
			'device_id': CONFIG.deviceID
		}, {
			channel: 'pc_' + getCh
		})
	} else {
		var dataObj = $.extend(obj.data || null, {
			'device_id': CONFIG.deviceID
		});
	}
	if (!dataObj.ccid && user) {
		dataObj.ccid = user.ccid;
	}
	var ajaxParams = {
		url: obj.url || (CONFIG.ajaxBase + obj.api),
		type: 'GET',
		data: dataObj,
		dataType: 'jsonp',
		jsonpCallback: obj.jsonpCallback,
		timeout: 15000 || obj.timeout,
		beforeSend: function() {
			$t.addClass('loader loading').find('.ajax-error').remove();
			if (obj.beforeSend && obj.beforeSend() === false) { //如果填写了beforSend且返回值为false
				return false;
			}
		},
		success: obj.success,
		complete: function() {
			obj.complete && obj.complete();
			complete();
		},
		error: function(xhr, err) {
			obj.error && obj.error();
			error(xhr);
		}
	};
	new Image().src = errImg;

	//执行请求
	$.ajax(ajaxParams);

	//请求完成
	function complete() {
		if (!obj.afterImgLoad) {
			$t.removeClass('loader loading');
		}

		$t.imgLoader({
			load: function(img) {
				if (obj.afterImgLoad && $(img).index() == 0) {
					$t.removeClass('loader loading');
				}
				footerPosAjust();
			},
			error: function(img) {
				$(img).attr('src', errImg);
			}
		});
		//pptvSet(); //PPTV合作加参数
	}

	//请求失败
	function error(xhr) {
		var errDom = '' + '<div class="ajax-error">' + '<img src="' + errImg + '">' + '<a class="ajax-reload-btn">重新加载</a>' + '</div>';

		xhr = null;
		$t.css('position', 'relative').append(errDom);
		$t.find('.ajax-reload-btn').off('click').on('click', function() {
			$.ajax(ajaxParams);
		});
	}

	return complete;
}

/**
 * input点击变空
 */
$.fn.inputPlaceholder = function() {
	$(this).each(function() {
		var def = $(this)[0].defaultValue;

		$(this).on('focus blur', function(e) {
			var val = $.trim($(this).val());

			if (e.type == 'focus') {
				$(this).css('color', '#333');
				if (val == def) {
					$(this).val('');
				}
			} else if (e.type == 'blur') {
				if (val == '') {
					$(this).val(def).removeAttr('style');
				}
			}
		});
	});
}

/**
 * 滚动条模拟
 */
$.fn.scrollBar = function() {
	var $container = $(this);
	var $content = $container.find('.scroll-content');
	var $scrollGutter = $('<div class="scroll-gutter">');
	var $scrollSlider = $('<div class="scroll-slider">');
	var model, data = {};
	//初始化
	function init() {
		$('.scroll-gutter').remove();
		$content.css('top', 0);
		$scrollGutter.append($scrollSlider);
		$container.append($scrollGutter);
		computedModel();

		if (model.contentH > model.containerInnerH) {
			$scrollSlider.height(model.scrollSliderH);
			bindEvents();
		} else {
			$scrollGutter.hide();
		}
	}
	//计算模型
	function computedModel() {
		var containerH = $container.outerHeight();
		var containerInnerH = $container.height();
		var contentH = $content.outerHeight();
		var scrollGutterH = $scrollGutter.outerHeight();
		var scrollSliderH = containerInnerH / contentH * scrollGutterH;
		var scale = contentH / containerH;

		model = {
			containerH: containerH,
			containerInnerH: containerInnerH,
			contentH: contentH,
			scrollGutterH: scrollGutterH,
			scrollSliderH: scrollSliderH,
			scale: scale
		};
	}
	//绑定事件
	function bindEvents() {
		$container.mousewheel(function(e) {
			var isMac = /mac\sos\sx/.test(navigator.userAgent.toLowerCase());
			var disY = isMac ? -e.deltaY : -e.deltaY * 20;

			e.preventDefault();
			getSliderState();
			move(disY);
		});

		$container.mousedown(function() {
			if (data.isDown) {
				return false;
			}
		})

		$scrollSlider.mousedown(function(e) {
			data.isDown = true;
			data.mouseBegin = {
				x: e.pageX,
				y: e.pageY
			};
			getSliderState();

			$scrollGutter.addClass('scroll-gutter-active');
			$(document).on('mousemove', mouseMove);
		});

		$(document).mouseup(function() {
			$scrollGutter.removeClass('scroll-gutter-active');
			$(document).off('mousemove', mouseMove);
			data.isDown = false;
		});

		function mouseMove(e) {
			data.mouseEnd = {
				x: e.pageX,
				y: e.pageY
			};

			var disY = data.mouseEnd.y - data.mouseBegin.y;
			move(disY);
		}

		function getSliderState() {
			data.scrollBegin = {
				x: $scrollSlider.position().left,
				y: $scrollSlider.position().top
			};
			data.threshold = {
				back: -data.scrollBegin.y,
				forward: model.scrollGutterH - model.scrollSliderH - data.scrollBegin.y
			};
		}
	}

	function move(sliderDis) {
		if (sliderDis > data.threshold.forward) {
			sliderDis = data.threshold.forward;
		} else if (sliderDis < data.threshold.back) {
			sliderDis = data.threshold.back;
		}

		var goPos = data.scrollBegin.y + sliderDis;

		$scrollSlider.css({
			'top': goPos
		});
		$content.css({
			'top': -goPos * model.scale
		});
	}

	init();
}

/**
 * 星级组件
 * @param  {[number]} score [评分0-10]
 */
$.fn.starRank = function(score) {
	var $me = $(this);
	var score = score || $(this).data('score');
	var rank = Math.round(score) / 2;
	var solidNum = rank.toString().split('.')[0];
	var hasHalf = !!rank.toString().split('.')[1];
	var signArr = [];
	var html = '';

	for (var i = 0; i < solidNum; i++) {
		signArr[i] = '+';
	}

	if (hasHalf) {
		signArr[signArr.length] = '-';
	}

	for (var i = 0; i < 5; i++) {
		var sign = signArr[i]
		if (sign == '+') {
			html += '<li class="solid-star"></li>';
		} else if (sign == '-') {
			html += '<li class="half-star"></li>';
		} else {
			html += '<li></li>';
		}
	}

	$me.html(html);
}

/**
 * 图片加载
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
$.fn.imgLoader = function(callback) {
	//图片递归加载
	// function loadpic(list,callback){
	//     if( $.isArray(list) && list.length ){
	//         var item = list.shift(),
	//             image = new Image();
	//             image.alt = '可米酷漫画,comicool,手机漫画,原创漫画,漫画app';
	//         // loadpic(list);
	//         image.src = 'http://cdn.icomico.com/' + item.frame_url + '?imageMogr2/thumbnail/480x';
	//         image.onload = function(){
	//              $('.sr-con').append($(this));
	//            loadpic(list,callback);
	//         };
	//     }else{
	//         $.isFunction(callback) && callback(list);
	//     }
	// }

	// $(this).find('img').on('load error', function(e) {
	// 	if (e.type == 'load' && callback.load) {
	//            callback.load($(this));
	//        } else if(e.type == 'error' && callback.error) {
	//            callback.error($(this));
	//        }
	// });

	$(this).find('img').each(function(i, el) {
		var img = new Image();
		var src = $(el).data('src');
		img.src = src;

		img.onload = function() {
			el.src = src;
			if (callback.load) {
				callback.load(el);
			}
		}

		img.onerror = function() {
			if (callback.error) {
				callback.error(el);
			}
		}
	})
}

//底部位置自适应
function footerPosAjust() {
	var offsetH = $('.h-foot').css('position') == 'absolute' ? $('.h-foot').height() : 0;
	var docHeight = $('body').outerHeight() + offsetH;
	var winHeight = $(window).height();

	if (docHeight < winHeight) {
		$('.h-foot').css({
			position: 'absolute',
			left: 0,
			bottom: 0,
			width: '100%'
		});
	} else {
		$('.h-foot').removeAttr('style');
	}
}

//过滤漫画
function isFilterComic(comic_id) {
	if (!CONFIG.filter) {
		return false;
	}

	for (var i = 0, len = CONFIG.filter.length; i < len; i++) {
		if (comic_id === CONFIG.filter[i].toString()) {
			return true;
			break;
		}
	}
}

function getUserIcon(userObj) {
	if (userObj.avatar && userObj.avatar.length > 0) {
		return CONFIG.iconBase + userObj.avatar + '.jpg';
	} else {
		return userObj.icon;
	}
}
//登录关闭和显示
var ComiLoginWindow = {
	show: function() {
		$('.dialoge-bg, .login-dialoge').show();
	},
	hide: function() {
		$('.dialoge-bg, .login-dialoge, .wxlogin-dialog,#comiLogin').hide();
		$("#temp_login").remove();
	},
	click: function() {
		//登录按钮
		$(".third-login-btn i").on('click', function() {
			var btn = this.dataset.btn,
				host = 'http://' + window.location.host + '/gcommon/login.html',
				fromPage = document.referrer;
			if (fromPage.indexOf('getdatauri') != -1) {
				fromPage = '';
			}
			var iframeUri = "http://comicool.cn/third-party-login/index.php?autologin=" + btn + "&callback_type=jsonp&device_id=" + CONFIG.deviceID + "&referer=" + host + encodeURIComponent("?fromPage=" + fromPage + "&fromType=pc");
			ComiLoginWindow.hide();
			$("body").append("<div id='temp_login'><span class='login-clo'>×</span><iframe id='iframe_login' src='" + iframeUri + "' width='100%' height='100%' frameborder=no border=0 marginwidth=0 marginheight=0 scrolling=no allowtransparency=yes></iframe></div>");
			//			关闭iframe窗口按钮
			$('.login-clo').on('click', ComiLoginWindow.hide);
		});
		//		关闭层
		$('.login-clo').on('click', ComiLoginWindow.hide);
	},
	 resetAnimation:function() {
	     ComiLoginWindow.show();
			var win = $('#comiLogin');
			win.stop().fadeOut(500, function() {
				win.attr('style', '').removeAttr('class');
				$('.load-state').removeClass('waiting');
				win.find('input[type=text], input[type=password]').val('');
				win.before(win.clone(true)).remove();
			});
		}
}

// 手机登录、注册、发送验证码、重置
var ComiPhone = {
	//			插入国家码
	code: function() {
		var html = '';
		html += '<lable><span>国家和地区:</span><select id="regCode">';
		for (item in codeData) {
			html += '<option>' + codeData[item] + '</option>';
		}
		html += '</select></lable>';
		$('#codes').html(html);
	},
	sendCaptcha: function() {
		//		发送验证码待添加功能
	},
	waiting: function(t, message) {
		console.log(t.parent().html())

		t.parent().find('.load-state').addClass('waiting');
		t.attr('disabled', 'disabled');
	},
	result: function(t, message) {
		t.parent().find('.load-state').removeClass('waiting');
		if (message) {
			t.parent().find('.error-message').html(message).fadeIn(1000);
		}
		t.removeAttr('disabled');
		setTimeout(function() {
			t.parent().find('.error-message').fadeOut(2000);
		}, 3000)
	},
	login: function(t) {
		var _this = this,
			username = $('#loginUsername').val(),
			mpassword = $('#loginPassword').val();
		_this.waiting(t);
		if (!username) {
			_this.result(t, '请输入手机号');
			return;
		}
		if (!mpassword) {
			_this.result(t, '请输入密码');
			return;
		}
		$('.mobileLoging').getByAjax({
			api: 'userlogin4h5',
			data: {
				"usertype": 4,
				"userid": username,
				"ccpwd": hex_md5(mpassword)
			},
			jsonpCallback: 'jsonp_userlogin',
			success: function(userInfo) {
				console.log(userInfo);
				switch (userInfo.ret) {
					case 0:
						_this.result(t);
						Comi.Login.setComiUser(userInfo);
						$('#comiLogin').hide();
						break;
					default:
						_this.result(t, '账号或密码错误，请重新输入');
						break;
				}
			}
		})
	},
	//	注册
	register: function(t) {
		var _this = this,
			username = $('#regUsername').val(),
			mpassword = $('#regPassword').val(),
			code = $('#regCode').val();
		_this.waiting(t);
		if (!username) {
			_this.result(t, '请输入手机号');
			return;
		}
		if (!code) {
			_this.result(t, '请填写验证码');
			return;
		}
		if (!mpassword) {
			_this.result(t, '请输入密码');
			return;
		}
	},
	//	重置
	forgot: function(t) {
		var _this = this,
			username = $('#forgotUsername').val(),
			mpassword = $('#forgotPassword').val(),
			code = $('#forgotCode').val();
		_this.waiting(t);
		if (!username) {
			_this.result(t, '请输入手机号');
			return;
		}
		if (!code) {
			_this.result(t, '请填写验证码');
			return;
		}
		if (!mpassword) {
			_this.result(t, '请输入密码');
			return;
		}
	}

}