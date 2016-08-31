// FastClick.attach(document.body);

var retry = true;
var ua=navigator.userAgent.toLowerCase(),
    isMobile = ua.indexOf('mobile')>0,
    isWeixin = (/micromessenger/.test(ua)) ? true : false,
    isQQ = (/qq\//.test(ua)) ? true : false,
    isIOS = ua.indexOf('(ip')>0 && isMobile,
    isWeibo = (/Weibo/i.test(ua)) ? true : false,
    isApp = (/icomico/i.test(ua)) ? true : false,
    isIOSApp = (/icomico_ios./i.test(ua)) ? true : false,
    isAndroidApp = (/icomico_adr./i.test(ua)) ? true : false;

function callAppFunction(func, args, callback) {
    //alert(func + ', 1');
    var argsString = JSON.stringify(args);
    if (isAndroidApp) {
        if (!comicool) {
            return false;
        }
        var result = eval("comicool." + func + "('" + argsString + "');");
        if (callback) {
            callback(result);
        }
    } else if (isIOSApp) {
        function handleCallback(func, args) {
            //alert(func);
            if (func != "setJSCallback") {
                return;
            }
            for (eventName in args) {
                window.WebViewJavascriptBridge.registerHandler(args[eventName], function(data, responseCallback) {
                    var appDataStr = JSON.stringify(data);
                    eval(args[eventName] + "('" + appDataStr + "');");
                });
            }
        }

        if (window.WebViewJavascriptBridge) {
            //alert(func + "1");
            window.WebViewJavascriptBridge.callHandler(func, argsString, callback);
            handleCallback(func, args);
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function() {
                //alert(func);
                window.WebViewJavascriptBridge.callHandler(func, argsString, callback);
                handleCallback(func, args);
            }, false);
        }
    } else {
        return false;
    }
    return true;
}

function setCookie(name,value,days){
    var days = days || 7;        //此 cookie 将被保存 7 天
    var exp = new Date(); 
    exp.setTime(exp.getTime() + days*24*60*60*1000); 
    document.cookie = name + "="+ escape(value) + ";expires=" + exp.toGMTString();
};

function getCookie(name){ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        return unescape(arr[2]);
    }
    else{
        return null; 
    }
};

var ACTID = 15;
window.onload = function() {
    if (isWeixin) {
        var url = encodeURIComponent(location.origin + location.pathname + location.search);

        $.ajax({
            url: 'http://comicool.cn/webapi/wxauth.php?url=' + url,
            type: 'GET',
            dataType: 'jsonp',
            jsonp: 'callback',
            jsonpCallback: 'jsonp_wxapi',
            success: function(data) {
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appId, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature,// 必填，签名，见附录1
                    jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

                wx.ready(function() {
                    var shareObj = {
                        title: '万眼引力 吸睛大法', // 分享标题
                        desc: '只是为了在人群中闪瞎你的眼', // 分享描述
                        link: 'http://m.comicool.cn/act/201505/bargain/index.html', // 分享链接
                        imgUrl: 'http://m.comicool.cn/act/201505/bargain/images/share-img2.jpg'
                    };

                    wx.onMenuShareAppMessage(shareObj);
                    wx.onMenuShareTimeline(shareObj);
                    wx.onMenuShareQQ(shareObj);
                    wx.onMenuShareWeibo(shareObj);
                });
            }
        });
    }
    setDefaultPage();
};

function setDefaultPage() {
    var data = {
        goods : [
            {
                source: '神兽退散',
                imgPic: 'ssts-1.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '487'
            },
            {
                source: '神兽退散',
                imgPic: 'ssts-2.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '494'
            },
            {
                source: '神兽退散',
                imgPic: 'ssts-3.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '506'
            },
            {
                source: '神兽退散',
                imgPic: 'ssts-4.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '510'
            },
            {
                source: '神兽退散',
                imgPic: 'ssts-5.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '508'
            },
            {
                source: '神兽退散',
                imgPic: 'ssts-6.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '495'
            },
            {
                source: '神兽退散',
                imgPic: 'ssts-7.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '496'
            },
            {
                source: '神兽退散',
                imgPic: 'ssts-8.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '498'
            },
            {
                source: '重症隔离',
                imgPic: 'zzgl-1.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '501'
            },
            {
                source: '重症隔离',
                imgPic: 'zzgl-2.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '502'
            },
            {
                source: '喰客',
                imgPic: 'canke-1.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '492'
            },
            {
                source: '喰客',
                imgPic: 'canke-2.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '493'
            },
            {
                source: '喰客',
                imgPic: 'canke-3.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '500'
            },
            {
                source: '非人类事务所',
                imgPic: 'frlsws-1.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '490'
            },
            {
                source: '非人类事务所',
                imgPic: 'frlsws-2.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '491'
            },
            {
                source: '诡来了',
                imgPic: 'gll-1.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '504'
            },
            {
                source: '诡来了',
                imgPic: 'gll-2.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '505'
            },
            {
                source: '诡来了',
                imgPic: 'gll-3.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '488'
            },
            {
                source: '锵锵锵实验室',
                imgPic: 'qqqsys-1.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '485'
            },
            {
                source: '锵锵锵实验室',
                imgPic: 'qqqsys-2.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '486'
            },
            {
                source: '锵锵锵实验室',
                imgPic: 'qqqsys-3.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '509'
            },

            {
                source: '锵锵锵实验室',
                imgPic: 'qqqsys-4.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '497'
            },
            {
                source: '锵锵锵实验室',
                imgPic: 'qqqsys-5.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '503'
            },
            {
                source: '这个猩猩不太萌',
                imgPic: 'zgxxbtm-1.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '499'
            },
            {
                source: '君灵天下',
                imgPic: 'jltx-1.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '489'
            },
            {
                source: '玻璃花',
                imgPic: 'blh-1.jpg',
                price: 0,
                cut_num: 0,
                goods_id: '507'
            }
        ]
    };

    if(data.goods) {
        var listHtml = '';
        var imgAlt = '可米酷漫画,comicool,手机漫画,原创漫画,漫画app';
        for (var i = 0, len = data.goods.length; i < len; i++) {
            listHtml += ''
                     +  '<li data-id="' + (10 + i) + '" class="crazy-buy" data-gid="' + data.goods[i].goods_id + '">'
                     +       '<div class="li-img">'
                     +          '<img src="http://cdn.icomicool.cn/m/act/201505/bargain/images/goods-thumb/' + data.goods[i].imgPic + '" data-large="http://cdn.icomicool.cn/m/act/201505/bargain/images/goods/' + data.goods[i].imgPic + '" alt="' + imgAlt + '" />'
                     +       '</div>'
                     +       '<h3>来自：' + data.goods[i].source + '</h3>'
                     +       '<p>'
                     +           '<span class="li-status">已挨<i>' + data.goods[i].cut_num + '</i>刀</span>'
                     +           '<span class="li-prize">¥' + data.goods[i].price + '</span>'
                     +       '</p>'
                     +       '<a href="javascript:;">抢购</a>'
                     +  '</li>'
        };
        $('.goods-list').html(listHtml);
        $('.goods-list .li-img img').on('load', function() {
            $(this).css('opacity', 1);
        })
    }

    $('.rule-btn a.rule-lnk').on('click',function(){
        $('.dialog-rule').show();
        dialogBgShow();
    });

    $('.dialog-common a.clo, .dialog-thanks a.clo, .thanks-btn a').on('click',function(){
        $('.dialog-common, .dialog-thanks').hide();
        dialogBgHide();
    });

    checkUser();
}

function checkUser() {
    var ajaxData = {
        'ccid' : '',
        'usertype' : '',
        'cctoken' : '',
        'deviceid' : '',
    }

    if (isApp) {//如果是App环境
        $('.goods-list').removeClass('wx-goods');
        callAppFunction('getAccountInfo', {}, function(result) {
            /**
             * 安卓未登录返回undefined，登录后返回json字符串
             * IOS未登录返回{}，登录后返回json对象
             */
            var result = result && isAndroidApp ? JSON.parse(result) : result;

            //如果result是对象且存在ccid属性（即已登录）
            if (result instanceof Object && result.hasOwnProperty('ccid')) {

                ajaxData = JSON.stringify(result);
                loginHandler(ajaxData);
            } else {//未登录
                $('.h-login').show();
                callAppFunction('setJSCallback', {//设置App里登录后的回调函数
                    'account_event': 'loginHandler'
                });

                $('.h-login span').on('click', function() {
                    callAppFunction('openLoginPage', {});
                });
                initPage(ajaxData);
            }
        });
    } else {
        var remainTimes = getCookie('remainTimes');

        if (remainTimes == null) {
            setCookie('remainTimes', 1, 30);
        }

        ajaxData.ccid = '1';
        ajaxData = JSON.stringify(ajaxData);
        loginHandler(ajaxData);

        $('.h-login').hide();
        $('.h-chance').show();
        $('.down-tip').show();
        var _footerHeight = $('.down-tip').height();
        $('.pagebox').css('paddingBottom', _footerHeight);
    }

    $('.goods-list li').on('click', function() {
        window.location.href = 'http://www.idingding.com/showDesign/getDesignInfoById.do?site=wap&desginId=' + $(this).data('gid');
        // var $li = $(this);
        // var rewardid = $li.data('id');
        // var imgSrc = $li.find('img').data('large');
        // var curPrice = $li.find('.li-prize').html().substr(1);
        // var cutTotal = $li.data('cut');
        // var comic = $li.find('h3').html();
        // var remainChance = $('.h-chance span').html();
        // var cutTimes = $li.find('.li-status i').html();
        
        // $('.detail-img img').attr('src', imgSrc);
        // $('.curr-price i').html(curPrice + '元');
        // $('.detail-from').html(comic);
        // $('.detail-chance em').html(remainChance);
        // $('.cut-price i').html(cutTotal + '元');

        // $('.dialog-detail').show();
        // dialogBgShow();
    });
}

function loginHandler(appDataStr) {
    var appDataObj = JSON.parse(appDataStr);

    $('.h-login').hide();
    $('.h-chance').show();

    if (isApp) {
        var shareJsonObj = {
            'title' : '万眼引力  吸睛大法',
            'describe' : '只是为了在人群中闪瞎你的眼',
            'imageurl' : 'http://m.comicool.cn/act/201505/bargain/images/share-img.jpg'
        };
        var shareJsonStr = JSON.stringify(shareJsonObj);

        callAppFunction("getDeviceID", {}, function (result) {
            appDataObj.deviceid = result;

            // alert(JSON.stringify(appDataObj));

            initPage(appDataObj);
            $('.share-btn').click(function() {
                dialogBgHide();
                $('.dialog-share').hide();
                sharePage(appDataObj);
                //app里弹出分享面板
                try {
                    comicool.popupSharePanel(shareJsonStr);
                } catch (e) {
                    window.location.href= 'http://comicool/popupSharePanel?title=' + shareJsonObj.title + '&describe=' + shareJsonObj.describe + '&imageurl=' + shareJsonObj.imageurl;
                }
            });
        });
    } else {
        var remainTimes = getCookie('remainTimes');

        initPage(appDataObj);
        $('.h-chance').find('span').text(remainTimes);
        $('.share-btn').click(function() {
            dialogBgShow();
            $('.dialog-share').hide();
            $('.share-tip').show();
        });
        $('.share-tip').click(function() {
            dialogBgHide();
            $(this).hide();
        });
    }
}

function initPage(appDataObj) {
    var ajaxData = {
        'ccid': appDataObj.ccid,
        'cctoken': appDataObj.cctoken,
        'usertype': appDataObj.usertype,
        'deviceid': appDataObj.deviceid,
        'activityid': ACTID
    };

    if (!isApp) {
        ajaxData.cip = returnCitySN.cip;
    }

    $.ajax({//获取页面基本信息
        url: 'http://proxy.icomico.com/activityindex',
        type: 'GET',
        dataType: 'jsonp',
        data: ajaxData,
        jsonp: 'callback',
        jsonpCallback: 'jsonp_activityindex',
        beforeSend: function() {
            // alert(JSON.stringify(ajaxData));
            loadingShow();
            console.log('initPage sending..', ajaxData);
        },
        success: function(data) {
            console.info('initPage success!', data);
            // alert(JSON.stringify(data));
            var rewardList = data.reward_list;

            if (isApp) {
                if (data.remainchance &&  data.remainchance >= 0) {
                    $('.h-chance').show().find('span').text(data.remainchance);
                }
            }

            //如果rewardList是数组且有长度
            if (rewardList instanceof Array && rewardList.length) {
                for(var i = 0, len = rewardList.length; i < len; i++) {
                    var info = rewardList[i];
                    var cutTimes = info.random_times + '';
                    var cutTotal = info.random_price_by_user / 100;
                    var $li = $('.goods-list').find('li[data-id="' + info.id + '"]');

                    if (isApp) {
                        $li.data('cut', cutTotal >= 0 ? cutTotal : 0);
                    } else {
                        cutTotal = getCookie('cutTotal' + info.id);

                        if (cutTotal == null) {
                            setCookie('cutTotal' + info.id, 0);
                            $li.data('cut', 0);
                        } else {
                            $li.data('cut', cutTotal);
                        }
                    }

                    if (cutTimes.length >= 4) {
                        $li.find('p > .li-status').html('千刀万剐');
                    } else {
                        $li.find('p > .li-status i').html(cutTimes);
                    }

                    $li.find('p > .li-prize').html('&yen;' + (info.price / 100));
                }
            }
        },
        complete: loadingHide,
        error : function(XMLHttpRequest, textStatus, errorThrown){
            errorShow('(' + XMLHttpRequest.status + ',' + XMLHttpRequest.readyState + ')');
        }
    });
}

function cutPrice(appDataObj, rewardObj) {
    var ajaxData = {
        'ccid': appDataObj.ccid,
        'cctoken': appDataObj.cctoken,
        'usertype': appDataObj.usertype,
        'deviceid': appDataObj.deviceid,
        'activityid': ACTID,
        'rewardid': rewardObj.rewardid
    };

    if (!isApp) {
        ajaxData.cip = returnCitySN.cip;
    }

    $.ajax({
        url: 'http://proxy.icomico.com/activityrandom',
        type: 'GET',
        dataType: 'jsonp',
        data: ajaxData,
        jsonp: 'callback',
        jsonpCallback: 'jsonp_activityrandom',
        beforeSend: function() {
            loadingShow();
            // alert(JSON.stringify(ajaxData))
            console.log('cutPrice sending..', ajaxData);
        },
        success: function(data) {
            console.info('cutPrice success!', data);
            var $li = rewardObj.$li;
            var cutNum = data.randomnum / 100;
            var cutTotal = (rewardObj.cutTotal + cutNum).toFixed(2);
            var curPrice = (rewardObj.curPrice - cutNum).toFixed(2);
            var remainChance = rewardObj.remainChance - 1;
            var cutTimes = rewardObj.cutTimes + 1;
            var id = $li.data('id');

            if (cutNum < 0) {
                alert('砍价失败');
                return false;
            }
            if (cutNum > rewardObj.curPrice) {
                cutNum = rewardObj.curPrice;
                curPrice = 0;
            }

            if (!isApp) {
                remainChance = getCookie('remainTimes') - 1;
                console.log(+getCookie('cutTotal' + id), curPrice, cutNum)
                cutTotal = (+getCookie('cutTotal' + id) + cutNum).toFixed(2);

                setCookie('remainTimes', remainChance, 30);
                setCookie('cutTotal' + id, cutTotal);
            }

            $('.h-chance span').html(remainChance);
            $('.share-info i').text(cutNum);
            $li.data('cut', cutTotal);
            $li.find('.li-prize').html('&yen;' + curPrice);
            $li.find('.li-status').html('已挨<i>' + cutTimes + '</i>刀');
            $('.dialog-detail').hide();
            $('.dialog-share').show();
        },
        complete: loadingHide,
        error : function(XMLHttpRequest, textStatus, errorThrown){
            errorShow('(' + XMLHttpRequest.status + ',' + XMLHttpRequest.readyState + ')');
        }
    });
}

function sharePage(appDataObj) {
    var ajaxData = {
        'ccid': appDataObj.ccid,
        'cctoken': appDataObj.cctoken,
        'usertype': appDataObj.usertype,
        'deviceid': appDataObj.deviceid,
        'activityid': ACTID
    };

    if (!isApp) {
        ajaxData.cip = returnCitySN.cip;
    }

    $.ajax({
        url: 'http://proxy.icomico.com/activityshare',
        type: 'GET',
        dataType: 'jsonp',
        data: ajaxData,
        jsonp: 'callback',
        jsonpCallback: 'jsonp_activityshare',
        success: function(data) {
            if (data.msg == 'success') {
                dialogBgShow();
                $('.dialog-thanks').show();
                $('.h-chance span').html(function(i, v) {
                    return parseInt(v) + 3;
                })
            }
        }

    })
}

function dialogBgShow() {
    $('.dialog-wraper').show();
}
function dialogBgHide() {
    $('.dialog-wraper').hide();
}
function loadingShow(){
    $('.loading').show();
}
function loadingHide(){
    $('.loading').hide();
}
function errorShow(txt){
    $('.errorbox').show();
    $('.error-con p').html('啊！~~加载中出现错误啦！<br>'+txt);
    $('.error-btn a').attr('href',window.location.href);
}


