$(document).ready(function() {
	var ajaxData = {};
	var userinfo = '';
	var move = {
		data: {
			'1': {
				'bg': 'images/1/1.jpg',
				'timing': '20160829',
				'ccid': '11410',
				'epid': '1',
				'treasure_ccid': '11186',
				'treasure_epid': '10'
			},
			'2': {
				'bg': 'images/2/1.jpg',
				'timing': '20160830',
				'ccid': '11369',
				'epid': '1',
				'treasure_ccid': '11286',
				'treasure_epid': '19'
			},
			'3': {
				'bg': 'images/3/1.jpg',
				'timing': '20160831',
				'ccid': '11414',
				'epid': '1',
				'treasure_ccid': '11563',
				'treasure_epid': '7'
			},
			'4': {
				'bg': 'images/4/1.jpg',
				'timing': '20160901',
				'ccid': '11643',
				'epid': '1',
				'treasure_ccid': '11167',
				'treasure_epid': '9'
			},
			'5': {
				'bg': 'images/5/1.jpg',
				'timing': '20160902',
				'ccid': '11353',
				'epid': '1',
				'treasure_ccid': '11625',
				'treasure_epid': '8'
			},
		},
		uri: 'http://shop.comicool.cn/api/activity/swimsuit/',
		// 获取系统时间并补零
		getNowFormatDate: function() {
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
		},
		loginInfo: function() {
			var $this = this;
			if (CONFIG.isApp && !CONFIG.isPPTV) {
				setByUserLoginStatus({
					isLogin: $this.loginCallback,
					unLogin: $this.unloginCallback
				});
			} else if (CONFIG.isLogin) {
				userinfo = JSON.parse(Comi.Utils.LocalStorage.get('comiUserData'));
				$this.rendering(userinfo);
			} else {
				$this.rendering(userinfo);
			}
		},
		rendering: function(userinfo) {
			if (userinfo) {
				$('#username').html(userinfo.nickname);
				$('#username').after('<span id="logout">退出</span>').show();
				$('#logout').on('click', function() {
					move.logout();
				});
				ajaxData = {
					cc_id: userinfo.ccid,
					usertype: userinfo.usertype,
					cctoken: userinfo.cctoken,
					device_id: CONFIG.deviceID
				}
			} else {
				$('#username').html('请登录').on('click', function() {
					if (CONFIG.isApp && !CONFIG.isPPTV) {
						callAppFunction('openLoginPage', {});
					} else {
						window.location.href = CONFIG.rootUrl + '/login.html';
					}
				})
			}
			$.ajax({
				type: "get",
				data: ajaxData,
				url: move.uri + 'award_list/',
				beforeSend: function() {
//					alert(JSON.stringify(ajaxData))
				},
				success: function(res) {
					if (res.code == 0) {
						//						昨日获奖
						var yesterday_award = res.data.yesterday_award,
							comment_award = res.data.comment_award,
							user_award = res.data.user_award,
							yesterday_html = '',
							comment_html = '',
							user_award_html = '';
						for (var i = 0; i < yesterday_award.length; i++) {
							yesterday_html += '<li><em>' + yesterday_award[i].nickname + '</em><span>' + yesterday_award[i].prize + 'Q币</span>';
						}
						for (var y = 0; y < comment_award.length; y++) {
							comment_html += '<li><em>' + comment_award[y].nickname + '</em><span>' + comment_award[y].prize + '酷币</span>';
						}
						if (user_award.length > 0) {
							for (var z = 0; z < user_award.length; z++) {
								if (user_award[z].award_type == 'question') {
									user_award_html += '<li><em>' + '幸运获奖' + '</em><span>' + user_award[z].prize + 'Q币</span>';
								} else {
									user_award_html += '<li><em>' + '评论获奖' + '</em><span>' + user_award[z].prize + '酷币</span>';
								}

							}
						} else {
							$('.user_award').html('<li class="no_list">暂无获奖信息</li>');
						}
						$('.user_list').html(yesterday_html);
						$('.comment_list').html(comment_html);
						$('.user_award').html(user_award_html);

					} else {
						$('.user_list').html('<li class="no_list">暂无获奖信息</li>');
						$('.comment_list').html('<li class="no_list">暂无获奖信息</li>');
					}
				}
			})

		},
		logout: function() {
			if (CONFIG.isApp && !CONFIG.isPPTV) {
				callAppFunction('logoutAccount', {});
			} else {
				Comi.Utils.LocalStorage.del('comiUserData');
			}
			CONFIG.isLogin = false;
			$('#logout').remove();
			$('#username').html('请登录').on('click', function() {
				if (CONFIG.isApp && !CONFIG.isPPTV) {
					callAppFunction('openLoginPage', {});
				} else {
					window.location.href = CONFIG.rootUrl + '/login.html';
				}
			})

			window.location.replace(window.location.href);
		},
		unloginCallback: function() {
			$('#username').on('click', jumpLoginPage);
			move.rendering(userinfo);
			//设置App里登录后的回调函数
			callAppFunction('setJSCallback', {
				'account_event': 'loginHandler'
			});
			window.loginHandler = function(obj) {
				window.location.replace(window.location.href);
			}

			function jumpLoginPage() {
				callAppFunction('openLoginPage', {});
			}
		},
		loginCallback: function(userinfo) {
			CONFIG.deviceID = userinfo.device_id;
			CONFIG.isLogin = true;
			move.rendering(userinfo);
		},
		init: function(currentData, index, userinfo) {
			var path = 'images/' + index;
			//			console.log(move.data)
			$('#clothing_bg').attr('src', currentData.bg);
			$('#clothing_select').append('<li><img class="currRed" src="' + path + '/11.jpg"/></li>' +
				'<li><img src="' + path + '/12.jpg"/></li>' +
				'<li><img src="' + path + '/13.jpg"/></li>' +
				'<li><img src="' + path + '/14.jpg"/></li>');
			$('#opus').attr({
				'data-ccid': currentData.ccid,
				'data-epid': currentData.epid
			})
			$('#treasure_ccid').attr({
				'data-ccid': currentData.treasure_ccid,
				'data-epid': currentData.treasure_epid
			}).html('<img src="' + path + '/opus.jpg"/>');
			$('#treasure_epid span').html(currentData.treasure_epid);
			var num = 1;
			$('#clothing_select li').on('click', function() {
				num = $(this).index() + 1;
				$('#clothing_select li img').removeClass('currRed');
				$(this).find('img').addClass('currRed');
				$('#clothing_bg').attr('src', 'images/' + index + '/' + num + '.jpg');
			})
			$('.close_btn').on('click', function() {
				$('.case,#grey_bg').hide();
			})
			$('#select_btn').on('click', function() {
				//				alert(JSON.stringify(ajaxData))
				if (CONFIG.isLogin) {
					$.ajax({
						type: "get",
						data: ajaxData,
						url: move.uri + 'join/' + num,
						beforeSend: function() {
							$('#loading,#grey_bg').show();
						},
						success: function(res) {
							$('#loading').hide();
							switch (res.code) {
								case 0:
									if (res.data.answer == 0) {
										$('#case_error,#grey_bg').show();

									} else {
										$('#case_right,#grey_bg').show();
									}
									break;

								case 1000:
									new TipBox({
										str: '您今天已经参与过了,请明天再来',
										btnCallback: function() {
											if (this.innerText == '确定') {
												$('#grey_bg').hide();
											} else {
												return;
											}
										}
									})
									break;
								case 1001:
									new TipBox({
										str: '活动还未开始呢,请12:30再来吧!',
									})
									break;
								case 1002:
									new TipBox({
										str: '活动已经结束了,请明天赶早啊!',
									})
									break;
								case 1003:
									new TipBox({
										str: '活动已经结束了,请关注其它活动!',
									})
									break;
								default:
									new TipBox({
										str: '请稍后重试',
									})
									break;
							}

						}
					})
				} else {
					new TipBox({
						str: '请先登录,万一您中奖了呢',
						btnText: ['取消', '确认'],
						btnCallback: function() {
							if (this.innerText == '确认') {
								if (CONFIG.isApp && !CONFIG.isPPTV) {
									callAppFunction('openLoginPage', {});
								} else {
									var uri = CONFIG.rootUrl + '/login.html';
									window.location.href = uri;
								}
							}
						}
					})
				}

			})
		}
	}

	for (index in move.data) {
		var getDataTime = move.data[index].timing,
			nowTime = move.getNowFormatDate();
		//				nowTime = parseInt(nowTime) + parseInt(1);
		//		console.log(nowTime)
		if (parseInt(nowTime) == getDataTime) {
			var currentData = move.data[index];
			move.loginInfo();
			move.init(currentData, index, userinfo);
			break;
		}
	}

})

/*  
 * @弹出提示层 ( 加载动画(load), 提示动画(tip), 成功(success), 错误(error), )  
 * @method  tipBox  
 * @description 默认配置参数   
 * @time    2014-12-19   
 * @param {Number} width -宽度  
 * @param {Number} height -高度         
 * @param {String} str -默认文字  
 * @param {Object} windowDom -载入窗口 默认当前窗口  
 * @param {Number} setTime -定时消失(毫秒) 默认为0 不消失  
 * @param {Boolean} hasMask -是否显示遮罩  
 * @param {Boolean} hasMaskWhite -显示白色遮罩   
 * @param {Boolean} clickDomCancel -点击空白取消  
 * @param {Function} callBack -回调函数 (只在开启定时消失时才生效)  
 * @param {String} type -动画类型 (加载,成功,失败,提示)  
 * @example   
 * new TipBox();   
 * new TipBox({type:'load',setTime:1000,callBack:function(){ alert(..) }});   
 */
function TipBox(cfg) {
	this.config = {
		width: 180,
		height: 150,
		title: '',
		str: '正在处理',
		btnText: ['确定'],
		btnCallback: function() {},
		windowDom: window,
		setTime: 0,
		hasMask: true,
		hasMaskWhite: false,
		clickDomCancel: false,
		callBack: null,
		type: 'confirmBox'
	};
	$.extend(this.config, cfg);
	if (TipBox.prototype.boundingBox) {
		if (this.config.type == 'toastBox') {
			clearInterval(this.toastTimeOut);
			this.destroy();
		} else {
			return; //存在就retrun
		}
	}

	//初始化
	this.render(this.config.type);
	return this;
}

//外层box
TipBox.prototype.boundingBox = null;

//渲染
TipBox.prototype.render = function(tipType, container) {
	this.renderUI(tipType);

	if (this.config.type != 'toastBox') {
		//绑定事件
		this.bindUI();
	}
	$(container || this.config.windowDom.document.body).append(TipBox.prototype.boundingBox);
};

//渲染UI
TipBox.prototype.renderUI = function(tipType) {
	if (tipType == 'toastBox') {
		TipBox.prototype.boundingBox = $("<div id='toast'></div>");
	} else {
		TipBox.prototype.boundingBox = $("<div id='TipBox'></div>");
	}
	tipType == 'confirmBox' && this.confirmRenderUI();
	tipType == 'toastBox' && this.toastRenderUI();
	TipBox.prototype.boundingBox.appendTo(this.config.windowDom.document.body);

	//是否显示遮罩(非吐司模式)
	if (tipType != 'toastBox') {
		if (this.config.hasMask) {
			this.config.hasMaskWhite ? this._mask = $("<div class='mask_white'></div>") : this._mask = $("<div class='mask'></div>");
			this._mask.appendTo(this.config.windowDom.document.body);
		}
		//btn元素
		if (this.config.btnText && this.config.btnCallback) {
			this.btn = TipBox.prototype.boundingBox.find('.btn-text');
		}
		//定时消失
		_this = this;
		!this.config.setTime && typeof this.config.callBack === "function" && (this.config.setTime = 1);
		this.config.setTime && setTimeout(function() {
			_this.close();
		}, _this.config.setTime);
	} else {
		_this = this;
		!this.config.setTime && (this.config.setTime = 1000); // 吐司模式未设置时间的话默认为1s
		this.config.setTime && setTimeout(function() {
			_this.close();
		}, _this.config.setTime);
	}
};

TipBox.prototype.bindUI = function() {
	_this = this;

	//点击空白立即取消
	this.config.clickDomCancel && this._mask && this._mask.click(function() {
		_this.close();
	});

	//btn事件绑定
	if (this.config.btnText && this.config.btnText.length > 0) {
		for (var i = 0, len = this.config.btnText.length; i < len; i++) {
			this.btn[i].addEventListener('click', function() {
				if (_this.config.btnCallback) {
					_this.config.btnCallback.call(this);
				}
				_this.close();
			});
		}
	}
};

//提示效果UI
TipBox.prototype.confirmRenderUI = function() {
	var tip = "<div class='tip'>";
	if (this.config.title) {
		tip += "     <div class='tip-title'>" + this.config.title + "</div>";
	}
	tip += "     <div class='dec_txt'>" + this.config.str + "</div>";
	tip += "<div class='tip-btns'>";
	for (var i = 0, len = this.config.btnText.length; i < len; i++) {
		tip += "<div class='btn-text'>" + this.config.btnText[i] + "</div>";
	}
	tip += "</div></div>";
	TipBox.prototype.boundingBox.append(tip);
};

//吐司效果UI
TipBox.prototype.toastRenderUI = function() {
	TipBox.prototype.boundingBox.html(this.config.str);
}

//关闭
TipBox.prototype.close = function() {
	TipBox.prototype.destroy();
	this.destroy();
	this.config.setTime && typeof this.config.callBack === "function" && this.config.callBack();
};

//销毁  
TipBox.prototype.destroy = function() {
	this._mask && this._mask.remove();
	TipBox.prototype.boundingBox && TipBox.prototype.boundingBox.remove();
	TipBox.prototype.boundingBox = null;
};