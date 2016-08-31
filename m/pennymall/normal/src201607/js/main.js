
var timmer = null; // 商品期数计时器

var GetInfo = {
    // 获取用户酷币信息
	getKubi: function() {
        var defer = $.Deferred();
		jsonp({
			url: 'user/kubi',
            callback: 'kubiCallback',
			success: function(data) {
                CONFIG.userMoney = data.data.kubi;
				$('.kubi-cnt').html(data.data.kubi);
                console.info('kubi-cnt : ' + data.data.kubi);
                defer.resolve(data.data.kubi);
			}
		})
        return defer.promise();
	},

    // 获取期次信息
    getPeriodInfo: function() {
        var defer = $.Deferred();

        jsonp({
            url: 'yungou/act/' + CONFIG.ygActId + '/periodicl/current',
            callback: 'periodCallback',
            success: function(data) {
                CONFIG.periodInfo = data.data;
                $('#periodId').html(data.data.current_p);
                $('#lastPeriodId').html(Number(data.data.current_p - 1));
                if (data.data.current_p == 1) {
                    $('#last-period-pannel').hide();
                }
                defer.resolve(data.data);
            }
        })

        return defer.promise();
    },

    //获取商品列表
    getGoodsList: function(period, showLoading) {
        var defer = $.Deferred();
        period = period ? period : CONFIG.periodInfo.current_p;

        jsonp({
            url: 'yungou/act/' + CONFIG.ygActId + '/periodicl/' + period,
            callback: 'goodListCallback',
            showLoading: showLoading ? 1 : 0,
            success: function(data) {
                defer.resolve(data.data);
            }
        })
        return defer.promise();
    },

    //获取单个商品
    getSingleGood: function(obj) {
        var defer = $.Deferred();

        jsonp({
            url: 'yungou/act/' + CONFIG.ygActId + '/periodicl/' + obj.periodId,
            callback: 'singleCallback',
            data: {
                act_good_id: obj.goodId
            },
            success: function(data) {
                defer.resolve(data.data);
            }
        })
        return defer.promise();
    },

    // 获取购买记录
    getRecordInfo: function(period, showLoading) {
        var defer = $.Deferred();
        period = period ? period : CONFIG.periodInfo.current_p;

        if (CONFIG.isLogin) {
            jsonp({
                url: 'yungou/act/' + CONFIG.ygActId + '/record/periodicl/' + period,
                callback: 'recordCallback',
                showLoading: showLoading ? 1 : 0,
                success: function(data) {
                    defer.resolve(data.data);
                }
            })
        } else {
            defer.resolve(null);
        }
        return defer.promise();
    },

    // 获取本期的云购结果
    getPeizeRes: function(period, showLoading) {
        var defer = $.Deferred();
        period = period ? period : CONFIG.periodInfo.current_p;

        if (CONFIG.isLogin) {
            jsonp({
                url: 'yungou/act/' + CONFIG.ygActId + '/results/periodicl/' + period,
                callback: 'lastCallback',
                showLoading: showLoading ? 1 : 0,
                success: function(data) {
                    defer.resolve(data.data);
                }
            })
        }
        return defer.promise();
    },

    //商品购买
    buyGood: function(data) {
        var goodId = data.goodId;
        var buyCnt = data.buyCnt;
        var defer = $.Deferred();

        jsonp({
            url: 'yungou/act/' + CONFIG.ygActId + '/buy/good/' + goodId + '/' + buyCnt,
            callback: 'buyCallback',
            beforeSend: function() {
                if(CONFIG.lockBuy){
                    return false;
                } 
                CONFIG.lockBuy = true;
            },
            success: function(data) {
                if (data.data && data.data.yb_count > 0) {
                    GetInfo.getKubi(); //刷新酷币
                    return defer.resolve(data.data);
                }
            }, 
            complete: function() {
                CONFIG.lockBuy = false;
            }
        })
        return defer.promise();
    },

    // 获取单个商品购买排行榜
    getSingleRank: function(act_good_id) {
        var defer = $.Deferred();
        jsonp({
            url: 'yungou/act/' + CONFIG.ygActId + '/rank/good/' + act_good_id,
            callback: 'singleRankCallback',
            success: function(data) {
                defer.resolve(data.data);
            }
        })
        return defer.promise();
    },

}

var Render = {

    // 设置倒计时
    renderTimmer: function(endTime) {
        if (endTime) {
            var timerStart = Number(endTime) - parseInt((new Date().getTime())/1000);
            var timmerArray = timeTrans(timerStart);
            timmer = setInterval(function() {
                timmerArray[2] -- ;
                if (timmerArray[0] == 0 && timmerArray[1] == 0 && timmerArray[2] == 0) {
                    clearInterval(timmer);
                    $('.timer-time').html("00:00:00");
                    new TipBox({str: '本期结束，即将刷新下一期！', type: 'toastBox'});
                    setTimeout(function(){
                        location.reload();
                    }, 3000)
                    return ;
                } else {
                    if (timmerArray[2] < 0) {
                        timmerArray[2] = 59;
                        timmerArray[1] --;
                        if (timmerArray[1] < 0) {
                            timmerArray[1] = 59; 
                            timmerArray[0] --;
                        }
                    }
                }
                $('.timer-time').html(changeNum(timmerArray[0]) + ':' + changeNum(timmerArray[1]) + ':' + changeNum(timmerArray[2]));
            }, 1000);
        } else {
            clearInterval(timmer);
            $('.timer-time').html("00:00:00");
        }

        function timeTrans(timeData) {
            var hoursAgo = parseInt(timeData / (60 * 60));
            var minutesAgo = parseInt(parseInt(timeData / 60) % 60);
            var secondsAgo = parseInt(timeData % 60);
            return [hoursAgo, minutesAgo, secondsAgo];
        }
    },

    //期次渲染
    renderPeriod: function() {
        var currentP = CONFIG.periodInfo.current_p;
        var containerWidth = $('.header-fixed').width();
        var widthCount = 0;
        var perWidth = 0;
        var periodListHtml = '';
        var slideIndex = Number(currentP);

        for(var i = 1; i < Number(currentP); i++) {
            periodListHtml += '<li>'+ (i == 1 ? '<div class="text-l"></div>' : '<div class="text-l"><</div>') + '<div class="period-pannel">第' + i + '期</div><div class="text-r">></div></li>';
        }
        periodListHtml += '<li>'+ (Number(currentP) == 1 ? '<div class="text-l"></div>' : '<div class="text-l"><</div>') + '<div class="period-pannel active">第' + currentP + '期</div></li>';
        var $periodListHtml = $(periodListHtml);
        widthCount = containerWidth * Number(currentP);
        perWidth = containerWidth;

        var slideAuto = 0 - (slideIndex-1) * perWidth;
        $('.period-list').html($periodListHtml).css('width', widthCount+'px');
        $('.period-list').children().css('width', perWidth + 'px');
        $('.period-list').animate({'translate3d': slideAuto + 'px, 0px, 0px'}, 0);

        //期数左右滑动切换
        $(document).on('touchend', '.period-list .text-l', slideRight);
        $(document).on('touchend', '.period-list .text-r', slideLeft);
        $(document).on('swipeLeft', '#header-slider', slideLeft);
        $(document).on('swipeRight', '#header-slider', slideRight);

        function slideLeft() {
            if (slideIndex == Number(currentP)) { // 未产生有效滑动不刷新
                return ;
            }
            slideIndex = ++slideIndex > Number(currentP) ? Number(currentP) : slideIndex;
            var slideAuto = 0 - (slideIndex-1) * perWidth; 
            $('.period-list').animate({
                translate3d: slideAuto + 'px, 0px, 0px'
            }, 350, 'easy-out');

            CONFIG.slideIndex = slideIndex;
            if (slideIndex == currentP) {
                Render.renderTimmer(CONFIG.periodInfo.end_time); // 设置倒计时
            } else {
                Render.renderTimmer(); // 设置倒计时
            }

            GetInfo.getGoodsList(slideIndex).then(function(data) { // 获取商品列表
                Render.renderGoodsList(data);
            }); 

            GetInfo.getRecordInfo(slideIndex).then(function(data) { // 获取获奖信息
                Render.renderRecord(data);
            }); 

            GetInfo.getPeizeRes(slideIndex).then(function(data) { // 获取中奖结果
                Render.renderPeizeRes(data);
            })
        }

        function slideRight() {
            if (slideIndex == 1) { // 未产生有效滑动不刷新
                return ;
            }
            slideIndex = --slideIndex < 1 ? 1 : slideIndex;
            var slideAuto = 0 - (slideIndex-1) * perWidth;
            $('.period-list').animate({
                translate3d: slideAuto + 'px, 0px, 0px'
            }, 350, 'easy-out');

            CONFIG.slideIndex = slideIndex;
            if (slideIndex == currentP) {
                Render.renderTimmer(CONFIG.periodInfo.end_time); // 设置倒计时
            } else {
                Render.renderTimmer(); // 设置倒计时
            }

            GetInfo.getGoodsList(slideIndex).then(function(data) { // 获取商品列表
                Render.renderGoodsList(data);
            }); 

            GetInfo.getRecordInfo(slideIndex).then(function(data) { // 获取获奖信息
                Render.renderRecord(data);
            }); 

            GetInfo.getPeizeRes(slideIndex).then(function(data) { // 获取中奖结果
                Render.renderPeizeRes(data);
            })
        }
    },

    //商品列表渲染
    renderGoodsList: function(data) {
        if(data && data.length > 0) {
            var firstGoodHtml = '';
            var listHtml = '';

            for (var i = 0, goodsLen = data.length; i < goodsLen; i++) {
                var goods = data[i];
                if (goods.sold_out == 1) { // 商品已售完
                    goods.yabao.sold = goods.yabao.total;
                }
                if (goods.is_board == 1) {  // 大额商品
                    firstGoodHtml += ''
                        + '<section id="first-banner-slider" class="first-banner-slider">'
                        + '    <div class="hd">'
                        + '        <ul class="list-unstyled">'
                        + '            <li class="">1</li>'
                        + '            <li class="on">2</li>'
                        + '            <li class="">3</li>'
                        + '        </ul>'
                        + '    </div>'
                        + '    <div class="bd">'
                        + '        <div class="tempWrap">'
                        + '            <ul class="list-unstyled" >'
                        + '                <li>' + (goods.sold_out ? '<div class="sold-out-icon">已售罄</div>' : '') + '<img src="' + goods.cover_1 + '" alt="大额精美商品,只需100酷币就有机会抢得"></li>'
                        + '                <li>' + (goods.sold_out ? '<div class="sold-out-icon">已售罄</div>' : '') + '<img src="' + goods.cover_2 + '" alt="大额精美商品,只需100酷币就有机会抢得"></li>'
                        + '                <li>' + (goods.sold_out ? '<div class="sold-out-icon">已售罄</div>' : '') + '<img src="' + goods.cover_3 + '" alt="大额精美商品,只需100酷币就有机会抢得"></li>'
                        + '            </ul>'
                        + '        </div>'
                        + '    </div>'
                        + '</section>'
                        + '<div class="first-goods-pannel">'
                        + '    <div class="first-good-title">' + goods.title +'</div>'
                        + '    <div class="first-pannel">'
                        + '        <div class="sell-cnt" style="width: ' + Number(goods.yabao.sold/goods.yabao.total*100) + '%"></div>'
                        + '    </div>'
                        + '    <div class="first-pannel-text">'
                        + '        <div class="text-left">'
                        + '            <p class="sold-cnt">' + goods.yabao.sold + '</p>'
                        + '            <p>已售份数</p>'
                        + '        </div>'
                        + '        <div class="text-right">'
                        + '            <p class="all-cnt">' + Number(goods.yabao.total - goods.yabao.sold) + '</p>'
                        + '            <p>剩余份数</p>'
                        + '        </div>'
                        + '    </div>'
                        + '</div>'
                        + '<div class="first-buy-btn unlogin-handle" data-gid=' + goods.act_good_id + '>'
                        + '    <img src="images/' + (goods.sold_out ? 'sold_out_01.png' : 'first-buy-btn.png') + '" alt="点击抢购">'
                        + '</div>'
                        + '<div class="first-buy-cnt">您已夺取<span class="myBuyCnt">' + Number(goods.yabao.my_count) + '</span>份</div>';

                        $('.first-surplus').html(Number(goods.yabao.total - goods.yabao.sold));
                } else {
                    listHtml += ''
                        + '<li class="goods-detail" data-gid=' + goods.act_good_id + '>'
                        + '    <div class="goods-left">'
                        + (goods.sold_out ? '<div class="sold-out-icon">已售罄</div>' : '')
                        + '        <img src="' + goods.cover_1 + '" alt="商品图片">'
                        + '        <div class="goods-pannel">'
                        + '            <div class="sell-cnt" style="width: ' + Number(goods.yabao.sold/goods.yabao.total*100) + '%"></div>'
                        + '        </div>'
                        + '        <div class="goods-pannel-text">'
                        + '            <div class="text-left">'
                        + '                <p class="sold-cnt">' + goods.yabao.sold + '</p>'
                        + '                <p>已售份数</p>'
                        + '            </div>'
                        + '            <div class="text-right">'
                        + '                <p class="all-cnt">' + Number(goods.yabao.total - goods.yabao.sold) + '</p>'
                        + '                <p>剩余份数</p>'
                        + '            </div>'
                        + '        </div>'
                        + '    </div>'
                        + '    <div class="goods-right">'
                        + '        <p class="goods-name">' + goods.title + '</p>'
                        + '        <p class="goods-no">(第 ' + goods.no + '/' + goods.quantity + ' 件)</p>'
                        + '        <p class="goods-value">已夺取: ' + goods.yabao.my_count + '份</p>'
                        + '        <div class="go-btn unlogin-handle" data-gid=' + goods.act_good_id + ' >'
                        + '            <img src="images/' + (goods.sold_out ? 'sold_out_02.png' : 'go-btn.png') + '" alt="立即购买">'
                        + '        </div>'
                        + '    </div>'
                        + '</li>';
                }
            }

            $('.first-container').html(firstGoodHtml);
            $('.goods-list').html(listHtml);
            TouchSlide({
                slideCell: "#first-banner-slider",
                titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell: ".bd ul",
                effect: "leftLoop",
                autoPlay: true, //自动播放
                autoPage: true,
                switchLoad: "data-src", //切换加载，真实图片路径为"_src"
                delayTime: 500,
                interTime: 5000
            });
        }
        
    }, 

    //单个商品渲染
    rendSingleGood: function(data) {
        if (data) {
            var renderhtml = '';
            var imgList = '<li><img src="' + data.cover_1 + '"></li>'
                        + (data.cover_2 ? '<li><img src="' + data.cover_2 + '"></li>' : '')
                        + (data.cover_3 ? '<li><img src="' + data.cover_3 + '"></li>' : '');
            if (data.sold_out == 1) { // 商品已售完
                data.yabao.sold = data.yabao.total;
            }
            console.info(JSON.stringify(data));
            console.info(data.yabao.my_count);
            renderhtml += ''
                    + '<section id="h-slider" class="banner-slider">'
                    + '    <div class="hd">'
                    + '        <ul class="list-unstyled">'
                    + '            <li class="">1</li>'
                    + '            <li class="on">2</li>'
                    + '            <li class="">3</li>'
                    + '        </ul>'
                    + '    </div>'
                    + '    <div class="bd">'
                    + '        <div class="tempWrap">'
                    + '            <ul class="list-unstyled" >'
                    + imgList
                    + '            </ul>'
                    + '        </div>'
                    + '    </div>'
                    + '</section>'
                    + '<div class="detail-goods-pannel">'
                    + '    <div class="detail-title">'
                    + data.title + '(第' + data.no + '/' + data.quantity + '件)'
                    + '    </div>'
                    + '    <div class="detail-pannel">'
                    + '        <div class="sell-cnt" style="width: ' + Number(data.yabao.sold/data.yabao.total*100) + '%"></div>'
                    + '    </div>'
                    + '    <div class="detail-pannel-text">'
                    + '        <div class="text-left">'
                    + '            <p class="sold-cnt">' + data.yabao.sold + '</p>'
                    + '            <p>已售份数</p>'
                    + '        </div>'
                    + '        <div class="text-right">'
                    + '            <p class="all-cnt">' + Number(data.yabao.total - data.yabao.sold) + '</p>'
                    + '            <p>剩余份数</p>'
                    + '        </div>'
                    + '    </div>'
                    + '</div>'
                    + '<div class="detail-input-container">'
                    + '    <div class="input-pannel">'
                    + '        <div class="input-icon"><i class="iconfont icon-reduce"></i></div>'
                    + '        <div><input type="number" name="detail-buy-cnt" id="detail-buy-cnt" value="1" /></div>'
                    + '        <div class="input-icon"><i class="iconfont icon-plus"></i></div>'
                    + '    </div>'
                    + '    <div class="buy-btn detail-buy-btn">'
                    + '        <img src="images/go-btn.png" alt="立即购买">'
                    + '        <div>已购买' + data.yabao.my_count + '份</div>'
                    + '    </div>'
                    + '    <div class="detail-per-money">'
                    + '        (<span>' + data.pre_kubi + '</span>酷币/份)'
                    + '    </div>'
                    + '</div>';
            $('#detail-main').html(renderhtml);
            TouchSlide({
                slideCell: "#h-slider",
                titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell: ".bd ul",
                effect: "leftLoop",
                autoPlay: true, //自动播放
                autoPage: true,
                switchLoad: "data-src", //切换加载，真实图片路径为"_src"
                delayTime: 500,
                interTime: 5000
            });
        }
    },

    //渲染获奖信息
    renderRecord: function(data) {
        var result1 = '', result2 = '';
        if (data && data.length > 0) {
            for (var i = 0, prizeLen = data.length; i < prizeLen; i++) {
                if (data[i].result) {
                    var address = data[i].address;
                    var addressHtml = address ? '<span class="ready-btn" data-oid=' + data[i].order_id + ' data-sid=' + data[i].id + '>已填写收货地址</span>'
                         : '<span class="zhong-btn" data-oid=' + data[i].order_id + ' data-sid=' + data[i].id + '>填写收货地址</span>';
                    result1 += ''
                        + ' <li class="record-item">'
                        + '     <div class="record-header">'
                        + '         <span class="record-title">' + data[i].title + ' (第' + data[i].no + '件)</span>'
                        + '         <span class="record-statu zhong"><i class="iconfont icon-prize"></i>中奖</span>'
                        + '     </div>'
                        + '     <div class="record-footer">'
                        + '         <div class="record-left">'
                        + '             已购买<span class="myBuyCnt">' + data[i].quantity + '</span>份&nbsp;&nbsp;&nbsp;'
                        + addressHtml
                        + '         </div>'
                        + '         <div class="record-right">'
                        + dateFmt(data[i].time)
                        + '         </div>'
                        + '     </div>'
                        + ' </li>';
                } else {
                    result2 += ''
                        + ' <li class="record-item">'
                        + '     <div class="record-header">'
                        + '         <span class="record-title">' + data[i].title + ' (第' + data[i].no + '件)</span>'
                        + '         <span class="record-statu"><i class="iconfont icon-noprize"></i>' + (data[i].drawed ? '未中奖' : '未开奖') + '</span>'
                        + '     </div>'
                        + '     <div class="record-footer">'
                        + '         <div class="record-left">'
                        + '             已购买<span class="myBuyCnt">' + data[i].quantity + '</span>份&nbsp;&nbsp;&nbsp;'
                        + '         </div>'
                        + '         <div class="record-right">'
                        + dateFmt(data[i].time)
                        + '         </div>'
                        + '     </div>'
                        + ' </li>';
                }
            }
        } else {
            result1 = '<li class="record-line">快去试试手气吧</li>';
        }
        $('.record-list').html(result1 + result2);
        
    },

    //渲染上期次的中奖结果
    renderPeizeRes: function(data) {
        var  lastPrizeHtml = '';
        if (data && data.length > 0) {
            for (var i = 0, prizeLen = data.length; i < prizeLen; i++) {
                var prizeItem = data[i];
                var prizerHtml = '';
                for (var j = 0, prizerLen = prizeItem.winners.length; j < prizerLen; j++) {
                    prizerHtml += '<p>' + prizeItem.winners[j].nickname + '</p>';
                }
                lastPrizeHtml += ''
                    + ' <li class="prize-item">'
                    + '    <div> <span class="prize-title">' + data[i].title + '</span></div>'
                    + '    <div class="prizer-names">' 
                    + prizerHtml 
                    + '    </div>'
                    + ' </li>';
            }
        } else {
            lastPrizeHtml = '<li class="record-line">暂无获奖信息</li>';
        }
        $('.prize-list').html(lastPrizeHtml);
    },

    //渲染排行榜信息
    renderSingleRank: function(resData) {
        var singleRankHtml = '';
        if (resData && resData.rank) {
            var data = resData.rank;
            if (data && data.length > 0) {
                for (var i = 0, recordLen = data.length; i < recordLen; i++) {
                    singleRankHtml += ''
                            + '<li>'
                            + '    <div>' + data[i].nickname + '</div>'
                            + '    <div> 份数:' + data[i].total + '</div>'
                            + '</li>';
                }
                $('.detail-rank-top').show();
            } else {
                $('.detail-rank-top').hide();
            }
            $('.rank-list').html(singleRankHtml);
        }
    } 
}