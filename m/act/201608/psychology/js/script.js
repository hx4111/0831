$(document).ready(function() {

	var psychology = {
		getSubject: function(index) {
			var current = data[index],
				t = this,
				i = 6;
			$('#subject').text('(' + index + ') ' + current.title);
			$('#countdown').html('倒计时:<strong>0</strong>秒');
			$('#countdown strong').text(i);
			clearInterval(time);
			var time = setInterval(function() {
				if (i <= 1) {
					$('#punishment').show();
					$('#countdown').html('是不是被吓到了,暂停3秒才可以继续答题');

					setTimeout(function() {
						$('#punishment').hide();
					}, 3000)
					clearInterval(time);
				}
				i--;
				$('#countdown strong').text(i);
			}, 1000)
			$('.container li').on('click', function() {
				var _this = $(this),
					index = _this.index(),
					activatedClass = index === 0 ? 'btn-success3d' : 'btn-error3d',
					messages = index === 0 ? current.yes : current.no;
				t.prohibit(_this, activatedClass, messages, index);
				clearInterval(time);
				$('.container li').off('click');
				setTimeout(function() {
					if (!isNaN(messages)) {
						psychology.getSubject(messages);
						t.init(_this, activatedClass, index);
					} else {
						window.location.href = 'fruit.html?letters=' + messages;
					}

				}, 1000);
			})
		},
		init: function(_this, activatedClass, index) {
			index = index ? 0 : 1;
			_this.find('button').removeClass(activatedClass);
			$('.container li').eq(index).find('button').removeClass('gray_btn');
			_this.find('big').html('');
		},
		prohibit: function(_this, activatedClass, messages, index) {
			index = index ? 0 : 1;
			_this.find('button').addClass(activatedClass);
			$('.container li').eq(index).find('button').addClass('gray_btn');
			if (isNaN(messages)) {
				_this.find('big').html(messages + '型');
			} else {
				_this.find('big').html('跳转到第' + messages + '题');

			}
		},
		countdown: function() {},
		login: function() {
			if (CONFIG.isApp && !CONFIG.isPPTV) {
				setByUserLoginStatus({
					isLogin: loginCallback,
					unLogin: unloginCallback
				});
				$('.icon-share').on('click', function() {
					callAppFunction('popupSharePanel', {
						"title": '想知道你是攻还是受吗?',
						"describe": '点进来，准到没朋友.',
						"imageurl": 'http://cdn.icomicool.cn/m/act/201608/psychology/images/psychology_share.jpg',
						"page_url": 'http://m.comicool.cn/act/201608/psychology/index.html',
						"weibo_describe": "想知道你是攻还是受吗?"
					});
				})
			} else if (CONFIG.isLogin) {
				var userinfo = JSON.parse(Comi.Utils.LocalStorage.get('comiUserData'));
				psychology.user(userinfo);
			}

			function unloginCallback() {
				//设置App里登录后的回调函数
				callAppFunction('setJSCallback', {
					'account_event': 'loginHandler'
				});
				window.loginHandler = function(obj) {}

				function jumpLoginPage() {
					callAppFunction('openLoginPage', {});
				}
			}

			function loginCallback(userinfo) {
				//		$.extend(userinfo_g, userinfo);
				CONFIG.deviceID = userinfo.device_id;
				psychology.user(userinfo);
			}
		},
		user: function(userinfo) {
			$('#username').val(userinfo.nickname);
		}
	}
	$('.logo_btn').on('click', function() {
		if (CONFIG.isApp && !CONFIG.isPPTV) {
			return false;
		} else {
			window.location.href = 'http://m.app.comicool.cn/smart_open/main.php'
		}
	})

	psychology.getSubject(1);
	psychology.login();
});
var userinfo_g = {

};