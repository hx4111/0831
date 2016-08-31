function Base64() {
	this.encode = function(u) {
		var y = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var z, A, B, q, r, s, t, p, v = 0,
			i = 0,
			w = "",
			x = [];
		if (!u) {
			return u
		}
		u = this.utf8_encode(u + "");
		do {
			z = u.charCodeAt(v++);
			A = u.charCodeAt(v++);
			B = u.charCodeAt(v++);
			p = z << 16 | A << 8 | B;
			q = p >> 18 & 63;
			r = p >> 12 & 63;
			s = p >> 6 & 63;
			t = p & 63;
			x[i++] = y.charAt(q) + y.charAt(r) + y.charAt(s) + y.charAt(t)
		} while (v < u.length);
		w = x.join("");
		switch (u.length % 3) {
			case 1:
				w = w.slice(0, -2) + "==";
				break;
			case 2:
				w = w.slice(0, -1) + "=";
				break
		}
		return w
	};
	this.decode = function(u) {
		var y = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var z, A, B, q, r, s, t, p, v = 0,
			i = 0,
			x = "",
			w = [];
		if (!u) {
			return u
		}
		u += "";
		do {
			q = y.indexOf(u.charAt(v++));
			r = y.indexOf(u.charAt(v++));
			s = y.indexOf(u.charAt(v++));
			t = y.indexOf(u.charAt(v++));
			p = q << 18 | r << 12 | s << 6 | t;
			z = p >> 16 & 255;
			A = p >> 8 & 255;
			B = p & 255;
			if (s == 64) {
				w[i++] = String.fromCharCode(z)
			} else {
				if (t == 64) {
					w[i++] = String.fromCharCode(z, A)
				} else {
					w[i++] = String.fromCharCode(z, A, B)
				}
			}
		} while (v < u.length);
		x = w.join("");
		x = this.utf8_decode(x);
		return x
	};
	this.utf8_encode = function(r) {
		var k = (r + "");
		var i = "";
		var q, n;
		var p = 0;
		q = n = 0;
		p = k.length;
		for (var o = 0; o < p; o++) {
			var l = k.charCodeAt(o);
			var m = null;
			if (l < 128) {
				n++
			} else {
				if (l > 127 && l < 2048) {
					m = String.fromCharCode((l >> 6) | 192) + String.fromCharCode((l & 63) | 128)
				} else {
					m = String.fromCharCode((l >> 12) | 224) + String.fromCharCode(((l >> 6) & 63) | 128) + String.fromCharCode((l & 63) | 128)
				}
			}
			if (m !== null) {
				if (n > q) {
					i += k.substring(q, n)
				}
				i += m;
				q = n = o + 1
			}
		}
		if (n > q) {
			i += k.substring(q, k.length)
		}
		return i
	};
	this.utf8_decode = function(i) {
		var n = [],
			l = 0,
			j = 0,
			k = 0,
			m = 0,
			h = 0;
		i += "";
		while (l < i.length) {
			k = i.charCodeAt(l);
			if (k < 128) {
				n[j++] = String.fromCharCode(k);
				l++
			} else {
				if ((k > 191) && (k < 224)) {
					m = i.charCodeAt(l + 1);
					n[j++] = String.fromCharCode(((k & 31) << 6) | (m & 63));
					l += 2
				} else {
					m = i.charCodeAt(l + 1);
					h = i.charCodeAt(l + 2);
					n[j++] = String.fromCharCode(((k & 15) << 12) | ((m & 63) << 6) | (h & 63));
					l += 3
				}
			}
		}
		return n.join("")
	}
};

function setNewShareInfo(shareInfo, setBrowserShare) {
	var base64 = new Base64();
	//TODO:直接传入shareInfo不起作用
	if (CONFIG.isApp && !CONFIG.isPPTV) {
		shareInfo.page_url = shareInfo.page_url ? shareInfo.page_url : window.location.href;
		shareInfo.title = shareInfo.title ? shareInfo.title : '可米酷漫画';
		shareInfo.describe = shareInfo.describe ? shareInfo.describe : '做最有价值的漫画原创互动平台';
		shareInfo.imagerl = shareInfo.imageurl ? shareInfo.imageurl : 'http://cdn.icomicool.cn/m/images/defaultShareImg.jpg';
		shareInfo.reason = shareInfo.reason ? shareInfo.reason : '做最有价值的漫画原创互动平台';
		shareInfo.source = shareInfo.source ? shareInfo.source : '可米酷漫画(comicool.cn)';
		callAppFunction('showShareBtn', shareInfo);
	} else if (setBrowserShare) {
		var shareContent = {
			'insert': function(shareInfo) {
				var _this = this;
				//					初始化分享内容,插入弹出面板
				$('body').prepend('<header class="header header-fixed header-shadow"><a class="l-icon icon-home iconfont" href="http://m.comicool.cn"></a><i class="r-icon icon-share iconfont"></i></header>');
				$('body').append('<div id="new-share-bg"><span></span></div>');
				$('#new-share-bg').after('<div class="bdsharebuttonbox new-share-box">' + '<div id="ShareCon">' + '<em><img src="' + shareInfo.imageurl + '"></em>' + '<h2>' + shareInfo.title + '</h2>' + '</div>' + '<div class="new-share-btn">' + '<a data-cmd="tsina"><i class="icon-xinlangweibo iconfont"></i></a>' + '<a data-cmd="sqq"><i class="icon-qq iconfont" data-cmd="bds_sqq"></i></a>' + '<a data-cmd="qzone"><i class="icon-qqkongjian iconfont" data-cmd="bds_qzone"></i></a>' + '</div>' + '<div class="share-clo">取消</div>' + '</div>');
				if (!CONFIG.isApp) {
					$('.header').show();
				}
				if (CONFIG.isWeixin || CONFIG.isQQ || CONFIG.isWeibo) {
					$('.icon-share').on('click', function() {
						$('#new-share-bg').show();
						$('.header').hide();
						$('#new-share-bg span').html('<img src="http://cdn.icomicool.cn/m/images/shareTip.png" >');
					});
				} else {
					$('.icon-share').on('click', function() {
						_this.open();
						$('.header').show();
					});
				}
				$('.share-clo,#new-share-bg').on('click', function() {
					_this.close();
				})
			},
			open: function() {
				$('.new-share-box,#new-share-bg').show();
			},
			close: function() {
				$('#new-share-bg,.new-share-box').hide();
				$('#new-share-bg span').html('');
				$('.header').show();
			},
		};
		var browserShare = {
			'baidu': function() {
				shareContent.insert(shareInfo);
				window._bd_share_config = {
					common: {
						bdText: shareInfo.title,
						bdDesc: shareInfo.describe,
						bdUrl: shareInfo.page_url,
						bdPic: shareInfo.imageurl
					},
					share: [{
						"bdSize": 32
					}]
				};
				with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5)];
			},
			'customize': function() {
				var share = {
					init: function() {
						var _this = this;
						shareContent.insert(shareInfo);
						$('.new-share-btn a').on('click', function() {
							console.log(this.dataset.cmd)
							switch (this.dataset.cmd) {
								case 'sqq':
									_this.mqq(shareInfo);
									break;
								case 'qzone':
									_this.qzone(shareInfo);
									break;
								case 'tsina':
									_this.weibo(shareInfo);
									break;
								case 'weixin':
									_this.weixin(shareInfo);
									break;
								default:
									break;
							}
						})
						return shareInfo;
					},

					mqq: function(shareInfo) {
						/* 分享至QQ好友（mobile web） */
						var shareUrl = "mqqapi://share/to_fri?";
						/* 接口参数 */
						var p = {
							file_type: 'news',
							src_type: 'web',
							version: '1',
							share_id: '101217801',
							url: base64.encode(shareInfo.page_url),
							/* 分享的网址 */
							title: base64.encode(shareInfo.title),
							/* 分享网页标题 */
							description: base64.encode(shareInfo.describe),
							/* 分享网页内容描述 */
							thirdAppDisplayName: base64.encode(shareInfo.source),
						};

						/* 组装完整接口地址 */
						var s = [];
						for (var i in p) {
							s.push(i + '=' + encodeURIComponent(p[i] || ''));
						}
						s = s.join('&');
						shareUrl += s;
						/* console.log("mqq : " + shareUrl); */
						/* 在新窗口打开分享界面 */
						//					window.open(shareUrl);
						/* 在当前窗口打开分享界面 */
						window.location.href = shareUrl;
					},
					qzone: function(shareInfo) {
						/* 分享接口地址 */
						var shareUrl = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?";

						/* 接口参数 */
						var p = {
							url: shareInfo.page_url,
							/* 分享的网址 */
							showcount: '0',
							/* 是否显示分享总数,显示：'1'，不显示：'0' */
							desc: shareInfo.reason,
							/* 用户 默认分享网页理由(可选) */
							title: shareInfo.title,
							/* 分享网页标题(可选) */
							summary: shareInfo.describe,
							/* 分享网页的简介(可选) */
							pics: shareInfo.imageurl,
							/* 分享图片的路径(可选) */
							site: shareInfo.source,
							/* 分享来源 如：腾讯网(可选) */
						};

						/* 组装完整接口地址 */
						var s = [];
						for (var i in p) {
							s.push(i + '=' + encodeURIComponent(p[i] || ''));
						}
						s = s.join('&');
						shareUrl += s;

						/* 在新窗口打开分享界面 */
						/* window.open(shareUrl); */
						/* 在当前窗口打开分享界面 */
						window.location.href = shareUrl;

					},
					weibo: function(shareInfo) {
						/* 分享接口地址 */
						var shareUrl = "http://service.weibo.com/share/share.php?";

						/* 接口参数 */
						var p = {
							url: shareInfo.page_url,
							/* 分享的网址 */
							count: 1,
							/* 是否显示分享总数,显示：'1'，不显示：'0' */
							title: shareInfo.title,
							/* 分享网页标题(可选) */
							pic: shareInfo.imageurl,
							/* 分享图片的路径(可选) */
							ralateUid: '',
							/* 转发时会@相关的微博账号(可选，允许为空) */
							language: 'zh_cn',
							/* 语言设置(zh_cn|zh_tw)(可选) */
							appkey: shareInfo.weiboClientId,
							/* 用于发布微博的来源显示,如 腾讯网，为空则分享的内容来源会显示来自互联网。(可选，允许为空) */
							type: 'button',
							searchPic: false,
							style: 'simple'
						};

						/* 组装完整接口地址 */
						var s = [];
						for (var i in p) {
							s.push(i + '=' + encodeURIComponent(p[i] || ''));
						}
						s = s.join('&');
						shareUrl += s;

						/* 在新窗口打开分享界面 */
						/* window.open(shareUrl); */
						/* 在当前窗口打开分享界面 */
						window.location.href = shareUrl;

					},
					weixin: function() {
						// 待添加
					}
				}
				share.init();
			}
		};
		(function() {
			browserShare[setBrowserShare.use]();
			var isFun = $.isFunction(setBrowserShare.init);
			if (isFun) {
				setBrowserShare.init.call(shareInfo);
			}
		})();

	}
}