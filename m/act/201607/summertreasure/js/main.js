
var g_userinfo = {};

var ComiList = [
    11639, //削死这群熊孩子
    11167, //成都1995
    11051, //药不能乱吃
    77,    //神兽退散
    10565, //Seven
    11300, //雨后的盛夏
    693,   //家有萌萌哒
    11379, //女巫重生记
    11247, //今夜有妖！
    11112, //萌爱战队
    707,   //猫咪甜品屋
    11339, //重生只为遇见你
    11347, //邻家阳台
    11186  //我的鬼娃娇妻
];

var PosterList = [
    '11639_ccover_2ac47b24c8d940bd.jpg', //削死这群熊孩子
    '11167_ccover_80e00bcca1e5b9b3.jpg', //成都1995
    '11051_ccover_cc8af8c151e5a5f6.jpg', //药不能乱吃
    '77_ccover_d161715c5019cd78.jpg', //神兽退散
    '10565_ccover_846acae958ea2257.jpg', //Seven
    '11300_ccover_2b753ef68945a0d1.jpg', //雨后的盛夏
    '693_ccover_1ae4afe47c2f8e3e.jpg', //家有萌萌哒
    '11379_ccover_a016da07c9b796e1.jpg', //女巫重生记
    '11247_ccover_04920ee2ef300f9b.jpg', //今夜有妖！
    '11112_ccover_128a9fbc01d010de.jpg', //萌爱战队
    '707_ccover_a8b163b888d2a2b0.jpg', //猫咪甜品屋
    '11339_ccover_88ca3841d61ccf99.jpg', //重生只为遇见你
    '11347_ccover_8533ea229d926ddc.jpg', //邻家阳台
    '11186_ccover_c787d23492b7554e.jpg', //我的鬼娃娇妻
];

var PosterText = [
    '宝藏可能在第05,16话中',
    '宝藏可能在第09,55话中',
    '宝藏可能在第02,16话中',
    '宝藏可能在第18,10话中',
    '宝藏可能在第17,12话中',
    '宝藏可能在第77,12话中',
    '宝藏可能在第11,16话中',
];

function init () {
	if (CONFIG.isApp) {
		setByUserLoginStatus({isLogin: loginCallback, unLogin: unloginCallback});
	} else {
		$('.unlogin-handle').on('click', function() {
			new TipBox({
				str: '下载可米酷App才能继续玩耍哦，看更多精彩漫画还能领奖励！', 
                btnText: ['取消', '确认'], 
                btnCallback: function() {
                    if (this.innerText == '确认') {
                        window.location.href = 'http://m.app.comicool.cn/smart_open/main.php?ch=prom11';
                    } else {
                        return;
                    }
                }
			})
		})
	}

	function unloginCallback() {
        //设置App里登录后的回调函数
        callAppFunction('setJSCallback', {
            'account_event': 'loginHandler'
        });
        $(document).on('touchend', '.unlogin-handle', jumpLoginPage);
        window.loginHandler = function (obj) {
            $(document).off('touchend', '.unlogin-handle', jumpLoginPage);
            $('.nickname').html(obj.nickname); 
            loginCallback(obj);
        }

        function jumpLoginPage() {
            callAppFunction('openLoginPage', {});
        }
    }

    function loginCallback(userinfo) {
 		g_userinfo = userinfo;
        CONFIG.deviceID = userinfo.device_id;
 		$('.nickname').html(g_userinfo.nickname); 
        getInfo.getTreasureList();  	
    }

}

var ajaxBase = 'http://shop.comicool.cn/'; //'http://shop.ismanhua.com:8000'
var getInfo = {

	getTreasureList: function() { // 获取已获得宝藏列表
        var jsonpData = {
            cc_id: g_userinfo.ccid
        };
        $.extend(jsonpData, g_userinfo);
        jsonp({
            url: ajaxBase + '/api/v1/order/act/13',
            data: jsonpData,
            jsonpCallback: 'treasureList',
            success: function(data) {
                console.info(data);
                if (data.data && data.data.length > 0) {
                    var list = data.data;
                    $('.treasure-info span').html(list.length);
                    render.rendTreasureList(list);
                }
            },
            error: function(data) {
                // console.info(data);
            }
        })
	}
}

var render = {

    rendTreasureList: function(list) { // 渲染我的宝贝列表
        console.info('render Treasure');
        var itemHtml = '<img src="http://cdn.icomicool.cn/m/act/201607/summertreasure/images/my-treasure-title.png" alt="夏日寻宝">'
            +'<div class="hide-treasure-btn"></div>';
        
        for (var i = 0, len = list.length; i < len; i ++) {
            var item = list[i];
            var treasureBtnHtml = '';

            if (!item.address) {
                if (item.goods.type == 3 || item.goods.type == 4) {
                    treasureBtnHtml = '';
                } else {
                    treasureBtnHtml = ''
                        + '    <div class="treasure-btn" data-oid=' + item.order_id + '>'
                        + '        填写收货信息'
                        + '    </div>';
                }
            }

            if (i == len-1) {
                itemHtml += ''
                    + '<div class="my-treasure-item">'
                    + '    <img src="images/my-treasure-end.png" alt="夏日寻宝">'
                    + '    <div class="treasure-word">'
                    + item.goods.title
                    + '    </div>'
                    + '    <div class="treasure-time">'
                    + item.time
                    + '    </div>'
                    + treasureBtnHtml
                    + '</div>';
            } else {
                itemHtml += ''
                    + '<div class="my-treasure-item">'
                    + '    <img src="images/my-treasure-bg.png" alt="夏日寻宝">'
                    + '    <div class="treasure-word">'
                    + item.goods.title
                    + '    </div>'
                    + '    <div class="treasure-time">'
                    + item.time
                    + '    </div>'
                    + treasureBtnHtml
                    + '</div>';
            }
        }
        $('.my-treasure-block').html(itemHtml);
    },

    rendPoster: function() {
        var nowDate = new Date().getDate();
        var nowIndex = nowDate - 4;

        if (nowIndex > 6) {
            nowIndex = 6;
        } 
        if (nowIndex < 0) {
            nowIndex = 0;
        }

        var poster01 = new Image();
        poster01.src = 'http://cdn.icomico.com/' + PosterList[nowIndex * 2];
        poster01.onload = function() {
            $('.comi-poster01').append(poster01).data('ccid', ComiList[nowIndex * 2]);
        }

        var poster02 = new Image();
        poster02.src = 'http://cdn.icomico.com/' + PosterList[nowIndex * 2 + 1];
        poster02.onload = function() {
            $('.comi-poster02').append(poster02).data('ccid', ComiList[nowIndex * 2 + 1]);
        }

        $('.poster-text').html(PosterText[nowIndex]);
    }
}

var eventInit = function() {
    var swipeIndex = 1, swipeMax = 3;
    var swipeWidth = parseInt($('.treasure-imgs div').eq(0).css('width'));
    var swipeBegin = parseInt(swipeWidth/8*7);
    var perSwipeWidth = parseInt(swipeWidth);
    $('.treasure-imgs').animate({translateX: (0 - swipeBegin) + 'px'}, 300, 'easy-out');

    $('.treasure-block-inner').swipeRight(function() {
        if (swipeIndex == 0) {
            return ;
        } else {
            swipeIndex --;
            var swipePos = swipeIndex * perSwipeWidth;
            $('.treasure-imgs').animate({translateX: (0 - swipePos) + 'px'}, 300, 'easy-out');
        }
    })

    $('.treasure-block-inner').swipeLeft(function() {
        if (swipeIndex == swipeMax) {
            return ;
        } else {
            swipeIndex ++;
            var swipePos = swipeIndex * perSwipeWidth;
            $('.treasure-imgs').animate({translateX: (0 - swipePos) + 'px'}, 300, 'easy-out');
        }
    })

    $('.show-treasure-btn').on('click', function() {
        if (g_userinfo) {
            console.info('show treasure btn click : ' + treasureHtml);
            var treasureHtml = $('.my-treasure-block').html();
            if (!treasureHtml) {
                new TipBox({str: '还没找到宝藏,快去漫画里找找看'});
            } else {
                $('.my-treasure-block').addClass('fadeInTop').on('webkitAnimationEnd', function() {
                    $(this).addClass('fadeInTopEnd').removeClass('fadeInTop');
                })
                $('.my-treasure-block').addClass('fadeInTop').on('animationend', function() {
                    $(this).addClass('fadeInTopEnd').removeClass('fadeInTop');
                })
            }
        }
    })

    $(document).on('touchend', '.hide-treasure-btn', function() {
        $('.my-treasure-block').removeClass('fadeInTopEnd');
    })

    $(document).on('touchend', '.treasure-btn', function() {
        $('#order_id').val($(this).data('oid'));
        $('.page-cover').show();
        $('body').css('overflow', 'hidden');
        $('.add-address-container').show();
    })

    $(document).on('touchend', '.page-cover, .rule-main', function() {
        $('body').css('overflow', 'auto');
        $('.add-address-container').hide();
        $('.page-cover').hide();
        $('.rule-container').hide();
    })

    $(document).on('touchend', '.submit-address-btn', function() {  
        if (!g_userinfo) {
            new TipBox({str: '请您登录'});
            return;
        }

        var order_id = $('#order_id').val();
        var username = $('#username').val();
        var phoneNum = $('#phoneNum').val();
        var userqq = $('#userqq').val();
        var address = $('#new-address').val();
        if (username && phoneNum && userqq && address) {
            var info = '姓名: ' + username + ', 电话: ' + phoneNum + ', QQ: ' + userqq + ', 地址: ' + address;
            var jsonpData = {
                order_id: order_id,
                address: info,
                cc_id: g_userinfo.ccid
            };
            $.extend(jsonpData, g_userinfo);
            jsonp({
                url: ajaxBase + '/api/v1/order/address',
                callback: 'addressCallbak',
                data: jsonpData,
                success: function(data) {
                    if (data.code == 0) {
                        new TipBox({str: '收货信息提交完成！'});
                    }
                },
                complete: function() {
                    $('body').css('overflow', 'auto');
                    $('.add-address-container').hide();
                    $('.page-cover').hide();
                    getInfo.getTreasureList();
                }
            })
        } else {
            new TipBox({type: 'toastBox', str: '收货信息不完善！'});
        }
    })

    $('.rule-img-block').on('click', function() {
        $('.page-cover').show();
        $('body').css('overflow', 'hidden');
        $('.rule-container').show();
    })
}

