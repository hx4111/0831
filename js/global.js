(function() {
	//设置PC与移动端的跳转页面,移动端含苹果跳域名down1.html，安卓跳域名down.html
	//jumpByPlatform("http://m.comicool.cn/down.html", "down.html");
	/*jumpByPlatform( combinUrl("m.", "/down.html"), "down.html" );*/
	var userInfo = Comi.Login.check();

	//顶部和底部加载
	(function() {
		var port = window.location.port;
		if (port !== 80 && port !== "") {
			var ename = ("http://" + window.location.hostname + ":" + window.location.port);
		} else {
			var ename = "http://" + window.location.hostname
		}
		$(".top").load(ename + "/gcommon/header.html", function() {
			//		判断域名是否是pptv.com
			if (CONFIG.isPPTV) {
				$(".h-top-left li").prepend("<a href='http://www.pptv.com' target='_blank' class='return-pptv'>返回PPTV</a>");
			}
			if (userInfo == null) {
				Comi.Login.renderUnLogin();
			} else {
				Comi.Login.signIn(userInfo, false);
			};
		});
		$(".footers").load(ename + "/gcommon/footer.html");

		var hasZongHeng = window.location.href.indexOf('zongheng.');
		//var ChZongHeng = getQueryString('ch');
		if (hasZongHeng != -1) {
			$('.h-logo-special, .read-t-logo-special').show();
			$('.h-logo, .read-t-logo').hide();
		}
	})();

	//搜索框文字切换
	$('#search-result-kw, .h-sou input').inputPlaceholder();

	function scrollToTop() {
		var toTopHtml = '<div class="goto-erweima"><img src="http://cdn.icomicool.cn/images/erweima.png"><h2>下载客户端</h2></div>' + '<div class="goto-top">' + '<a href="javascript:;" class="link-gotop"><img src="http://cdn.icomicool.cn/images/fix-img.png" /></a>' + '</div>';
		$('body').append(toTopHtml);
		$(window).scroll(function() {
			var scrollValue = $(window).scrollTop();
			scrollValue > 125 ? $('div[class=goto-top]').fadeIn() : $('div[class=goto-top]').fadeOut();
		});
		$('.link-gotop').click(function() {
			$("html,body").animate({
				scrollTop: 0
			}, 200);
		});
	}
	scrollToTop();

	//去除数组中某个属性是空值的对象
	function popEmptyObjInArr(arr, key) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i][key] == '' || arr[i][key] == undefined) {
				arr.splice(i, 1);
			}
		}
	}

	function getRankInfo() {
		if (!$('#rank-drop-box').size()) return false;

		var rankList = [];
		var imgCutSize = '?imageView2/1/w/80/h/53/q/100';

		var complete = $('.rank-con').getByAjax({
			api: 'ranklist4web',
			jsonpCallback: 'jsonp_ranklist',
			success: function(data) {
				if (data.msg == 'success') {
					rankList = data.rank_list;

					var menuHTML;
					//下拉菜单
					menuHTML = '' + '<div class="drop-t">' + '<span>' + rankList[0].name + '</span>' + '<i></i>' + '</div>' + '<div class="drop-b">';
					for (var i = 0, len = rankList.length; i < len; i++) {
						menuHTML += '<p><span>' + rankList[i].name + '</span></p>';
						popEmptyObjInArr(rankList[i].comi_list, 'comic_title');
					}
					menuHTML += '</div>';

					//默认榜单
					setRankInfoByIndex(0);

					$('#rank-drop-box .drop-inner').html(menuHTML);
					$('.drop-box').dropBox(function(i) {
						setRankInfoByIndex(i);
					});
				}
			}
		});

		function setRankInfoByIndex(i) {
			var rankHTML = '';

			for (var j = 0, len = rankList[i].comi_list.length; j < len; j++) {
				var iHTML;
				var comic = rankList[i].comi_list[j];
				var imgUrl = CONFIG.imgBase + comic.comic_cover_url;
				var title = comic.comic_title;
				var author = comic.comic_auth;
				var link = CONFIG.detailBase + 'comic_id=' + comic.comic_id;

				if (j < 3) {
					iHTML = '<i class="good">' + (j + 1) + '</i>';
				} else {
					iHTML = '<i>' + (j + 1) + '</i>';
				}
				rankHTML += '' + '<li>' + iHTML + '<div class="li-img">' + '<a href="' + link + '">' + '<img src="' + CONFIG.placeholder + '" data-src="' + imgUrl + imgCutSize + '" />' + '</a>' + '</div>' + '<div class="rank-txt">' + '<h3><a href="' + link + '">' + title + '</a></h3>' + '<p class="li-author">' + author + '</p>' + '</div>' + '</li>';
			}

			$('.rank-list').html(rankHTML);
			$('.scroll-container').scrollBar();
			//调用一次getByAjax返回的complete方法（执行imgLoader）
			complete();
		}
	}
	//排行榜数据
	getRankInfo();

	//下拉菜单
	$('.drop-box').dropBox();

	//模拟滚动条
	$('.scroll-container').scrollBar();

	//图片加载失败处理
	$('[data-errorimg]').imgLoader();

	//脚步自适应
	footerPosAjust();
	$(window).resize(function() {
		footerPosAjust();
	});

	//临时，周赛页面暂时屏蔽
	//$('.h-nav a').eq(3).hide();

})();

//百度统计安装
var _hmt = _hmt || [];
(function() {
	var hm = document.createElement("script");
	hm.src = "//hm.baidu.com/hm.js?91ce1b276d999b0757a6bf47b0e86df6";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(hm, s);
})();