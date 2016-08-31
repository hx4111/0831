
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
                url: 'yungou/act/' + CONFIG.ygActId + '/record/all',
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
                    $('.deadline').html("00:00:00");
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
                $('.deadline').html(changeNum(timmerArray[0]) + ':' + changeNum(timmerArray[1]) + ':' + changeNum(timmerArray[2]));
            }, 1000);
        } else {
            clearInterval(timmer);
            $('.deadline').html("00:00:00");
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
        var id = (Number(currentP) - 1) % 4;
        var  idIndex = parseInt((Number(currentP) - 1) / 4);

        $('.period-index-0' + id).find('.period-pannel div').addClass('period-now');
        for  (var i = 0; i < 4; i++) {
            if (i < id) {
                $('.period-index-0' + i).append('<p>已结束</p>');
                $('.period-index-0' + i).on('click', function() {
                    $('.period-pannel div').removeClass('period-now');
                    $(this).find('.period-pannel div').addClass('period-now');
                    CONFIG.slideIndex = idIndex * 4 + Number($(this).data('index'));
                    changePeriod(CONFIG.slideIndex);
                })
            } else if (id == i) {
                $('.period-index-0' + i).append('<p>进行中</p>');
                $('.period-index-0' + i).on('click', function() {
                    $('.period-pannel div').removeClass('period-now');
                    $(this).find('.period-pannel div').addClass('period-now');
                    CONFIG.slideIndex = idIndex * 4 + Number($(this).data('index'));
                    changePeriod(CONFIG.slideIndex);
                })
            } else {
                $('.period-index-0' + i).append('<p class="font-color-c">未开始</p>');
            }
        }

        function changePeriod(slideIndex) {
            if (slideIndex == CONFIG.periodInfo.current_p) {
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
            var listHtml = '', btnText = '';

            for (var i = 0, goodsLen = data.length; i < goodsLen; i++) {
                var goods = data[i];
                if (goods.sold_out == 1) { // 商品已售完
                    goods.yabao.sold = goods.yabao.total;
                    btnText = '<div class="sold-out">已经售罄</div>'
                } else {
                    btnText = '<div>立即夺宝</div>';
                }
                if (goods.is_board == 1) {  // 大额商品
                    firstGoodHtml += ''
                        + '<div class="first-goods-poster goods-detail" data-gid="' + goods.act_good_id + '">'
                        + '    <div class="hd">'
                        + '        <ul class="list-unstyled">'
                        + '            <li></li>'
                        + '        </ul>'
                        + '    </div>'
                        + '    <div class="bd">'
                        + '        <div class="tempWrap">'
                        + '            <ul class="list-unstyled">'
                        + '                <li><img src="' + goods.cover_1 + '" alt=""></li>'
                        + '            </ul>'
                        + '        </div>'
                        + '    </div>'
                        + '</div>';
                    if (goods.sold_out == 1) {
                        $('.first-good-buy-btn img').attr('src', 'images/first-buy-btn2.jpg')
                    }
                    $('.first-goods-sold').html(goods.yabao.sold);
                    $('.first-title').html(goods.title);
                    $('.first-goods-left').html(Number(goods.yabao.total - goods.yabao.sold));
                    $('.first-good-buy-btn').data('gid', goods.act_good_id);
                } else {
                    listHtml += ''
                        + '<li class="goods-item goods-detail" data-gid="' + goods.act_good_id + '">'
                        + '    <div class="item-left">'
                        + '        <img src="' + goods.cover_1 + '" alt="">'
                        + '    </div><div class="item-right">'
                        + '        <div class="goods-title">'
                        +              goods.title
                        + '        </div>'
                        + '        <div class="goods-middle">'
                        + '            <div class="item-sold-info">'
                        + '                <div class="text-l">'
                        + '                    已售' + goods.yabao.sold
                        + '                </div><div class="text-r">'
                        + '                    剩余' + Number(goods.yabao.total - goods.yabao.sold)
                        + '                </div>'
                        + '            </div>'
                        + '            <div class="item-sold-pannel">'
                        + '                <div class="item-sold-bg" style="width: ' + Number(goods.yabao.sold/goods.yabao.total*100) + '%"></div>'
                        + '            </div>'
                        + '        </div>'
                        + '        <div class="goods-bottom">'
                        +              btnText
                        + '        </div>'
                        + '    </div>'
                        + '</li>';
                }
            }
            
            $('#first-goods-block').html(firstGoodHtml);
            $('.goods-list').html(listHtml);
            setTimeout(function() {
                $('.item-right').css('height', $('.item-left').height());
            }, 500);
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
            /*var imgList = '<li><img src="' + data.cover_1 + '"></li>'
                        + (data.cover_2 ? '<li><img src="' + data.cover_2 + '"></li>' : '')
                        + (data.cover_3 ? '<li><img src="' + data.cover_3 + '"></li>' : '');*/
            var imgList = '';
            if (data.is_board == 1) {
                imgList = '<li><img src="' + data.cover_1 + '"></li>';
            } else {
                imgList = '<li><img src="' + data.cover_2 + '"></li>';
            }
            if (data.sold_out == 1) { // 商品已售完
                data.yabao.sold = data.yabao.total;
            }
            console.info(JSON.stringify(data));
            console.info(data.yabao.my_count);
            renderhtml += ''
                + '<div class="hd">'
                + '    <ul class="list-unstyled">'
                + '        <li></li>'
                + '    </ul>'
                + '</div>'
                + '<div class="bd">'
                + '    <div class="tempWrap">'
                + '        <ul class="list-unstyled">'
                +              imgList
                + '        </ul>'
                + '    </div>'
                + '</div>';
            $('.goods-title').html(data.title);
            $('.detail-sold-bg').css('width', Number(data.yabao.sold/data.yabao.total*100) + '%');
            $('.detail-cnt .text-l span').html(data.yabao.sold);
            $('.detail-cnt .text-r span').html(Number(data.yabao.total - data.yabao.sold));
            $('.detail-per-money span').html(data.pre_kubi);
            $('.my-buy-cnt span').html(data.yabao.my_count);
            $('.detail-goods-poster').html(renderhtml);
            TouchSlide({
                slideCell: "#detail-goods-block",
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
                    var addressHtml = address ? '<span class="ready-btn">已填写收货地址</span>'
                         : '<span class="address-btn" data-oid=' + data[i].order_id + ' data-sid=' + data[i].id + '>填写收货地址</span>';
                    result1 += ''
                        + '<li class="order-item">'
                        + '    <div class="order-top">'
                        +          data[i].title + '(第' + data[i].no + '件)  X ' + data[i].quantity
                        + '    </div>'
                        + '    <div class="order-bottom">'
                        + '        <div class="order-bottom-left">'
                        + '            <span><i class="iconfont icon-prize"></i>中奖</span>'
                        +              addressHtml
                        + '        </div><div class="order-bottom-right">'
                        +              dateFmt(data[i].time)
                        + '        </div>'
                        + '    </div>'
                        + '</li>';
                } else {
                    result2 += ''
                        + '<li class="order-item">'
                        + '    <div class="order-top">'
                        +          data[i].title + '(第' + data[i].no + '件)  X ' + data[i].quantity
                        + '    </div>'
                        + '    <div class="order-bottom">'
                        + '        <div class="order-bottom-left">'
                        + '            <span><i class="iconfont icon-noprize"></i>' + (data[i].drawed ? '未中奖' : '未开奖') + '</span>'
                        + '        </div><div class="order-bottom-right">'
                        +              dateFmt(data[i].time)
                        + '        </div>'
                        + '    </div>'
                        + '</li>';
                }
            }
        } else {
            result1 = '<li>快去试试手气吧</li>';
        }
        $('.order-list').html(result1 + result2);
    },

    //渲染上期次的中奖结果
    renderPeizeRes: function(data) {
        var  lastPrizeHtml = '';
        if (data && data.length > 0) {
            for (var i = 0, prizeLen = data.length; i < prizeLen; i++) {
                var prizeItem = data[i];
                var prizerHtml = '';
                for (var j = 0, prizerLen = prizeItem.winners.length; j < prizerLen; j++) {
                    prizerHtml += '<p>' + (j + 1) + '.' + prizeItem.winners[j].nickname + '</p>';
                }
                lastPrizeHtml += ''
                    + '<li class="prize-item">'
                    + '    <div> <span class="prize-title"> ' + data[i].title + ' : </span></div>'
                    + '    <div class="prizer-names">'
                    +          prizerHtml
                    + '    </div>'
                    + '</li>';
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
                        + '<li><div class="text-l">' + data[i].nickname + '</div><div class="text-r"> X ' + data[i].total + '</div></li>';
                }
            } else {
                singleRankHtml += '<li>暂无土豪上榜</li>';
            }
            $('.rank-list').html(singleRankHtml);
        }
    } 
}

function commonBind() {
    //分享赚酷币点击
    $('.go-share').on('click', function() {
        if (CONFIG.isLogin) {
            var shareData = {
                'title' : '酷币夺宝',
                'describe' : '酷币夺宝,只要100酷币就有机会抢得精美手办,快来参与吧',
                'imageurl' : 'http://promote.comicool.cn/ygshare/images/yg_share.jpg',
                'page_url': 'http://promote.comicool.cn/ygshare/index.php?ccid=' + CONFIG.p_userinfo.ccid
            };
            callAppFunction('popupSharePanel', shareData);  
        }
    })

    //前往评论区
    $('.go-post').on('click', function() {
        if (CONFIG.isApp) {
            callAppFunction('openNewBrowser', {
                url: CONFIG.postPage, 
                title: '可米酱的百宝囊--讨论区'
            })
        } else {
            window.open(CONFIG.postPage);
        }
    })
}