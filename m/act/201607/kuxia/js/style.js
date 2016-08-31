$(document).ready(function() {
		$(function() {
			$('#ShareBg,#rule ul,#tip').on('click', function() {
				$('#ShareBg').hide();
				$('#rule ul').hide();
				$('#tip').hide();
			});
			$('.kuxia_box').fadeThis({
				speed: 300,
				reverse: false
			});
		})
		$(window).fadeThis({
			speed: 1000,
			reverse: false
		});
		$('#rule li').on('click', function() {
			$('#rule ul').show();
			$('#ShareBg').html('').show();
		})
		init();
	})
	//		CONFIG.ajaxBase='http://121.201.7.97/';
var kuxia = {
	tip: function(message) {
		$('#tip').show().html(message);
		$('#ShareBg').html('').show();

	},
	uri: 'http://shop.comicool.cn/api/v1/score/activity/',
	activity: function() {
		var activityData = ['dati', 'yg', 'tansuo'];
		var activityData = {
			'dati': {
				'start': '20160728',
				'end': '20160804'
			},
			'tansuo': {
				'start': '20160804',
				'end': '20160811'
			},
			'yg': {
				'start': '20160811',
				'end': '20160818'
			}
		}
		for (index in activityData) {
			var activityMatching = activityData[index],
				start = activityMatching.start,
				end = activityMatching.end,
				currTime = kuxia.getNowFormatDate(),
				currDiv = $('.' + index + ' div');
			if (currTime < start) {
				//				活动未开始
				currDiv.html('<img class="not_started" src="http://cdn.icomicool.cn/m/act/201607/kuxia/images/' + index + '-not.png">');
			} else if (currTime >= start && currTime < end) {
				//				进行中
				currDiv.html('<img class="' + index + '_start" src="http://cdn.icomicool.cn/m/act/201607/kuxia/images/' + index + '-ing.png">');
			} else {
				//				结束
				currDiv.html('<img class="stoped" src="http://cdn.icomicool.cn/m/act/201607/kuxia/images/' + index + '-end.png">');
			}
		};
		$('.not_started').on('click', function() {
			kuxia.tip('活动暂未开放,请注意开放时间');
		})
		$('.stoped').on('click', function() {
			kuxia.tip('活动已结束,敬请期待下次活动!');
		})
		$('.yg_start').on('click', function() {
			var ygUri = 'http://m.comicool.cn/pennymall/normal/dist/index.html';
			if (CONFIG.isApp && !CONFIG.isPPTV) {
				callAppFunction('openNewBrowser', {
					url: ygUri,
					title: '百宝囊'
				});
			} else {
				window.location.href = ygUri;
			}
		})
		$('.tansuo_start').on('click', function() {
			var tansuoUri = 'http://m.comicool.cn/act/201607/summertreasure/index.html';
			if (CONFIG.isApp && !CONFIG.isPPTV) {
				callAppFunction('openNewBrowser', {
					url: tansuoUri,
					title: '夏日寻宝'
				});
			} else {
				window.location.href = tansuoUri;
			}
		});
		$('.dati_start').on('click', function() {
			var datiUri = 'http://m.comicool.cn/act/201607/answer/index.html';
			if (CONFIG.isApp && !CONFIG.isPPTV) {
				callAppFunction('openNewBrowser', {
					url: datiUri,
					title: '答题季'
				});
			} else {
				window.location.href = datiUri;
			}
		})
	},
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
	getIntegral: function(userinfo) {
		if (userinfo) {
			$('.unLoginTip img').off('click')
			$('.phone').removeClass('unLoginTip');
			var uccid = userinfo.ccid;
			jsonp({
				type: "get",
				data: {
					cc_id: uccid,
					usertype: userinfo.usertype,
					cctoken: userinfo.cctoken,
					device_id: CONFIG.deviceID
				},
				url: this.uri + "userinfo/",
				success: function(res) {
					var integral = res.data.score;
					$('#user ul').html('<span>用户名:' + userinfo.nickname + '</span>积分:<em>' + res.data.score + '</em><span id="logout">退出</span><div id="to-mine">日常任务赚积分</div>');
					$('#logout').on('click', kuxia.logout);
					$('#to-mine').on('click', function() {
						if (CONFIG.isApp && !CONFIG.isPPTV) {
							callAppFunction('returnToMainTab', {'tab_name': 'mine'});
						} else {
							kuxia.tip('快去下载可米酷App参与活动吧');
						}
					})

					//					手机抽奖
					var awardData = res.data.award,
						kind = [],
						aKind = ['.phone', '.huan'];
					for (item in awardData) {
						kind.push(item);
					}
					for (var k = 0, len = aKind.length; k < len; k++) {
						var index = kind[k];
						var indexImg = $(aKind[k]).find('ul');
						var indexID = indexImg.attr('id');
						//						console.log(awardData[index].status)
						switch (awardData[index].status) {
							case 0:
								// 没满
								indexImg.attr('data-tid', index).html('<img class="zoomInDown shake animated delay3" src="http://cdn.icomicool.cn/m/act/201607/kuxia/images/' + indexID + '.png">').addClass('lack')
								break;
							case 1:
								// 可以参与
								indexImg.attr('data-tid', index).html('<img class="zoomInDown shake animated delay3" src="http://cdn.icomicool.cn/m/act/201607/kuxia/images/' + indexID + '.png">').addClass('satisfied')
								break;
							case 2:
								// 被别人抽走了
								indexImg.attr('data-tid', index).html('<img src="http://cdn.icomicool.cn/m/act/201607/kuxia/images/gray_' + indexID + '.png">').addClass('another')
								break;
							case 3:
								// 中奖
								indexImg.attr('data-tid', index).html('<img src="http://cdn.icomicool.cn/m/act/201607/kuxia/images/congratulations_' + indexID + '.png">').addClass('congratulations')
								break;
							case 4:
								// 未抽中
								indexImg.attr('data-tid', index).html('<img src="http://cdn.icomicool.cn/m/act/201607/kuxia/images/gray_' + indexID + '.png">').addClass('regret')
								break;
							default:
								indexImg.attr('data-tid', index).html('<img  src="http://cdn.icomicool.cn/m/act/201607/kuxia/images/' + indexID + '.png">').addClass('default')
								break;
						}
						indexImg.on('click', function() {
							var status = $(this).attr('class'),
								currentID = this.dataset.tid;
							//							console.log(status,currentID,awardData[index]);
							kuxia.kind(status, currentID, awardData, uccid);
						})

					}
					//					积分
					var aBox = $('.box .slide-left'),
						demand = [],
						levelData = res.data.level;
					//					console.log(levelData);
					for (item in levelData) {
						demand.push(item);
					}

					for (var i = 0, len = demand.length; i < len; i++) {
						var index = demand[i];
						var contrast = levelData[index];
						theBox = aBox.eq(i);
						if (integral >= contrast.score && contrast.status == '0') {
							theBox.attr('data-tid', index).addClass('rubberBand').html("<img src='http://cdn.icomicool.cn/m/act/201607/kuxia/images/box.png'>");
						} else if (integral >= contrast.score && contrast.status == '1') {
							theBox.attr('data-tid', index).addClass('acquire_kb receive' + index).html("<img src='http://cdn.icomicool.cn/m/act/201607/kuxia/images/" + contrast.score + ".png'>");
						} else {
							theBox.attr('data-tid', index).html("<img class='gray_box' src='http://cdn.icomicool.cn/m/act/201607/kuxia/images/gray_box.png'>");
						}
					}
					aBox.off('click');
					aBox.on('click', function() {
						var index = aBox.index(this);
						currentID = this.dataset.tid,
							currentIntegral = levelData[currentID].score;
						if ($(this).hasClass('rubberBand')) {
							$.ajax({
								type: "get",
								data: {
									cc_id: userinfo.ccid,
									usertype: userinfo.usertype,
									cctoken: userinfo.cctoken,
									device_id: CONFIG.deviceID
								},
								url: kuxia.uri + 'kubi/' + currentID,
								success: function(res) {
									aBox.eq(index).removeClass('rubberBand').html("<img class='acquire_kb' src='http://cdn.icomicool.cn/m/act/201607/kuxia/images/" + currentIntegral + ".png'>");
									aBox.eq(index).addClass('acquire_kb receive' + (index + 1));
									kuxia.tip('人品大爆发,恭喜您获得了' + currentIntegral + '酷币');
								}
							})
						} else if ($(this).hasClass('acquire_kb')) {
							kuxia.tip('您不是已经领取过了吗?');
						} else {
							kuxia.tip('开启本礼包需要' + currentIntegral + '积分<br> 下面还有更丰富的奖品哟!');
						}
					})
				}
			});
		}
	},
	notLogin: function() {
		$('.box .slide-left').addClass('unLoginTip').html("<img class='gray_box' src='http://cdn.icomicool.cn/m/act/201607/kuxia/images/gray_box.png'>");
		$('.phone').addClass('unLoginTip').html('<img class="zoomInDown shake animated delay3" src="http://cdn.icomicool.cn/m/act/201607/kuxia/images/phone.png">');
		$('.huan').addClass('unLoginTip').html('<img src="http://cdn.icomicool.cn/m/act/201607/kuxia/images/huan.png">');
		$('.dati').addClass('unLoginTip');
		$('.unLoginTip img').on('click', function(event) {
			var e = event || window.event;
			e.preventDefault();
			var conf = confirm("只有登录了才能体验更多精彩啊");
			if ((conf && !CONFIG.isApp) || (conf && CONFIG.isPPTV)) {
				window.location.href = CONFIG.rootUrl + '/login.html?referrer=' + window.location.href;
			} else if (conf && CONFIG.isApp) {
				callAppFunction('openLoginPage', {});
			}
		});
	},
	logout: function() {
		if (!CONFIG.isApp || CONFIG.isPPTV) {
			Comi.Utils.LocalStorage.del('comiUserData');
			CONFIG.isLogin = false;
		} else {
			callAppFunction('logoutAccount', {});
		}
		//		if (CONFIG.isWeixin) {
		//			window.location.href = window.location.href +'?' +100 * Math.random();
		//		} else {
		//			window.location.reload(true);
		//		}
		window.location.replace(window.location.href);
		//		window.location.href = window.location.href + '?' + 100 * Math.random();
	},
	information: function(currentID, uccid) {
		$('.information').show();
		$('#ShareBg').html('').show();
		var ajaxCallBack = kuxia.uri + 'address/' + uccid + '/' + currentID
		$('#infoSub').on('click', function() {
			var user = $('#uname').val(),
				qq = $('#uqq').val(),
				phone = $('#uphone').val(),
				address = $('#uaddress').val();
			if (user == '' || qq == '' || phone == '' || address == '') {
				alert('请完善所有信息,要不然怎么发货给您呢!');
				return false;
			}
			$.ajax({
				type: "POST",
				url: ajaxCallBack,
				data: {
					cc_id: uccid,
					usertype: userinfo.usertype,
					cctoken: userinfo.cctoken,
					device_id: CONFIG.deviceID,
					info: $('#usrinfo').serialize() // 要提交表单的ID
				},
				success: function(msg) {
					$('.information').hide();
					kuxia.tip('提交成功!');
				}
			});
		})
		$('.x-close').on('click', function() {
			$('.information').hide();
			$('#ShareBg').hide();
		})
	},
	kind: function(status, currentID, awardData, uccid) {
		var intotal = awardData[currentID].level_number,
			score = awardData[currentID].score,
			population = awardData[currentID].number;
		switch (status) {
			case 'lack':
				// 没满
				kuxia.tip('需要' + intotal + '人达到<strong>' + score + '</strong>积分<br>目前达成人数:<strong>' + population + '</strong><br>满足条件后可所有人抽取!努力吧,少年们!')
				break;
			case 'satisfied':
				$.ajax({
						type: "get",
						data: {
							cc_id: uccid,
							usertype: userinfo.usertype,
							cctoken: userinfo.cctoken,
							device_id: CONFIG.deviceID
						},
						url: kuxia.uri + 'award/' + currentID,
						success: function(res) {
							switch (res.data) {
								case 0:
									kuxia.tip('啊哦,您暂未中奖');
									break;
								case 1:
									kuxia.tip('您不是已经参加过了吗?');
									break;
								case 2:
									kuxia.tip('人品大爆发,您中奖了');
									kuxia.information(currentID, uccid);
									break;
								default:
									break;
							}
						}
					})
					// 可以参与
				break;
			case 'another':
				kuxia.tip('已被人抽中');
				// 被别人抽走了
				break;
			case 'congratulations':
				// 中奖
				kuxia.information(currentID, uccid);
				break;
			case 'regret':
				kuxia.tip('您暂未中奖');
				// 未抽中
				break;
			default:
				kuxia.tip('欢迎参加酷夏活动');
				break;
		}
	}
}
var userinfo_g = {

};

function init() {
	if (CONFIG.isApp && !CONFIG.isPPTV) {
		setByUserLoginStatus({
			isLogin: loginCallback,
			unLogin: unloginCallback
		});
	} else if (CONFIG.isLogin) {
		var userinfo = JSON.parse(Comi.Utils.LocalStorage.get('comiUserData'));
		kuxia.getIntegral(userinfo);
	} else {
		$('#user ul').html('体验更多精彩!<b>立即登录</b>');
		$('#user ul').on('click', function() {
			window.location.href = CONFIG.rootUrl + '/login.html';
		})
		kuxia.notLogin();
	}
	kuxia.activity();
	//未登录回调
	function unloginCallback() {
		$('#user ul').html('体验更多精彩!<b>立即登录</b>');
		$('#user ul').on('click', jumpLoginPage);
		kuxia.notLogin();
		//设置App里登录后的回调函数
		callAppFunction('setJSCallback', {
			'account_event': 'loginHandler'
		});
		window.loginHandler = function(obj) {
			//			setByUserLoginStatus({
			//				isLogin: loginCallback
			//			});
			//						window.location.reload();
			window.location.replace(window.location.href);
			//			window.location.href = window.location.href + '?' + 100 * Math.random();
		}

		function jumpLoginPage() {
			callAppFunction('openLoginPage', {});
		}
	}

	function loginCallback(userinfo) {
		//		$.extend(userinfo_g, userinfo);
		CONFIG.deviceID = userinfo.device_id;
		kuxia.getIntegral(userinfo);
	}

}
//init();