/**
 * Created by 郝旭 on 2016/3/14.
 */
var userInfo_g = {};
//测试：http://comicool.cn:8000/
//正式：http://api.comicool.cn/

var DogzConfig = {
    baseurl: "http://api.comicool.cn/",
    cycle_id: 2,
    beginDate: new Date('2016-05-27').getTime()/1000,
    endDate: new Date('2016-06-03').getTime()/1000,
    submitAjaxBase: 'http://proxy.icomico.com/', //'http://proxy.icomico.com/',  'http://121.201.7.97:8004/'
}

var awardArray = [['生肖猪', '生肖鸡'],['生肖狗', '生肖牛'],['生肖虎', '生肖龙'],['生肖蛇', '生肖兔'],['生肖马', '生肖鼠'],['生肖羊', '生肖猴']];

//渠道号是test调用测试接口
if (isInternal()) {
    DogzConfig.baseurl = 'http://comicool.cn:8000/';
}
if (location.hostname.indexOf('192.168') != -1) {
   DogzConfig.baseurl = 'http://comicool.cn:8000';
}

function getByAjax(ajaxConfig) {
    $.ajax({
        url: ajaxConfig.url,
        dataType: 'jsonp',
        data: ajaxConfig.data ? ajaxConfig.data : '',
        beforeSend: function() {
            $('.loading-spinner').show();
            if (ajaxConfig.beforeSend && ajaxConfig.beforeSend() === false) {//如果填写了beforSend且返回值为false
                return false;
            }
        },
        success: ajaxConfig.success,
        complete: function() {
            ajaxConfig.complete && ajaxConfig.complete();
            $('.loading-spinner').hide();
        },
    });
}

function dateOutBox () {
    var timeStamp = new Date().getTime()/1000;
    var outDate = DogzConfig.endDate; 
    if (timeStamp >= outDate) {
        new TipBox({str: '活动已结束，谢谢参与！'});
        return false;
    }
    return true;
}

function betweenDate () {
    return Math.round(((new Date().getTime()/1000) - DogzConfig.beginDate)/(24*60*60));
}

function main () {
    dateOutBox();

    //点赞数
    $.ajax({
        url: 'http://comicool.cn/simple_vote.php',
        dataType: "jsonp",
        data: {},
        jsonpCallback: "jsonp_match",
        success: function (data) {
            var praiseCnt = data.results[47];
            $(".praise-cnt").html(praiseCnt);
        }
    })

    if (getCookie('doraemon_praise') == "true") {
        $('.praised-btn').show();
        $('.praise-btn').hide();
    } else {
        $('.praised-btn').hide();
        $('.praise-btn').show();
    }

    //活动奖励图片
    $('#award-img').attr('src', 'http://cdn.icomicool.cn/m/act/201605/doraemon/images/award_0' + (betweenDate() > 6 ? 6 : betweenDate()) + '.jpg')

    //活动规则
    $('.rule-btn').on('click', function () {
        $('.rule-container').show();
    })

    $('.rule-container .icon-guanbi').on('click', function() {
        $('.rule-container').hide();
    })

    //点赞
    $('.praise-btn').on('click', function() {
        $(this).hide();
        $('.praised-btn').show();
        var num = $(".praise-cnt").html();
        $(".praise-cnt").html(parseInt(num) + 1);
        $.get("http://comicool.cn/simple_vote.php?sel=47");
        setCookie("doraemon_praise", "true", 30)
    })

    //取消点赞
    $('.praised-btn').on('click', function() {
        new TipBox({str: '你已经点过赞了'});
    })

    $('.tip-next').on('click', function() {
        new TipBox({str: '更多精彩活动尽在六月,敬请期待！'});
    })

    if (isApp) {
        bindTouchEvent();
        
        //跳转兑吧
        $('.go-mall').on('click', function () {
            callAppFunction('openMallPage', {});
        })

        //跳转我的
        $('.go-duty').on('click', function () {
            callAppFunction('returnToMainTab', {"tab_name":"mine" });
        })

        setByUserLoginStatus({isLogin: loginCallback, unLogin: unloginCallback});
    }

    //未登录回调
    function unloginCallback() {

        //设置App里登录后的回调函数
        callAppFunction('setJSCallback', {
            'account_event': 'loginHandler'
        });
        document.getElementById('login-btn').addEventListener('click', jumpLoginPage);
        document.getElementById('exchange-btn').addEventListener('click', jumpLoginPage);
        document.getElementById('ctrl-hand').addEventListener('click', jumpLoginPage);
        window.loginHandler = function (obj) {
            document.getElementById('login-btn').removeEventListener('click', jumpLoginPage);
            document.getElementById('exchange-btn').removeEventListener('click', jumpLoginPage);
            document.getElementById('ctrl-hand').removeEventListener('click', jumpLoginPage);
            setByUserLoginStatus({isLogin: loginCallback});
        }

        function jumpLoginPage() {
            callAppFunction('openLoginPage', {});
        }
    }

    //已登录回调
    function loginCallback(userinfo) {

        $.extend(userInfo_g, userinfo);
        //  初始化信息
        $('.login-btn').hide();
        $('.user-container').css('display', 'inline-block');
        function initInfo(userinfo, bindEventCall) {

            var that = getInfoClass;
            var fnDone = [];
            var cb = function (i) {
                fnDone.push(i);

                if (fnDone.length == fnQue.length) {
                    bindEventCall.call();
                }
            }
            var fnQue = [
                function (i) {
                    that.getUserInfo(userinfo, function () {
                        cb(i);
                    });
                },
                function (i) {
                    that.getGameInfo(userinfo, function () {
                        cb(i);
                    });
                }
            ];
            fnQue.forEach(function (fn, i) {
                fn(i);
            })
            that.getRankInfo('today');
            that.getRankInfo('yesterday');
        }

        initInfo(userinfo, bindEvent);
    }

    function bindEvent() {

        // 100酷币兑换1次
        $('#exchange-btn img').on('click', function () {
            console.info('click exchange-btn');
            if (!userInfo_g) {
                new TipBox({str: '请先登录'});
                return false;
            } else {
                if (!dateOutBox()) {
                    return ;
                }
                new TipBox({str: '是否花费100酷币兑换一次助攻？', btnText: ['不要', '是哒'], btnCallback: exchangeFun });

                function exchangeFun() {
                    if (this.innerText == '不要') {
                        return;
                    } else {
                        var userCredit = Number(userInfo_g.credit ? userInfo_g.credit : 0);
                        if (userCredit < 100) {
                            new TipBox({type: 'toastBox', str: '酷币余额不足'});
                            return false;
                        }
                        getByAjax({
                            url: DogzConfig.baseurl + '/melee/' + DogzConfig.cycle_id + '/game/point/user/' + userInfo_g.ccid + '/'
                            + userInfo_g.cctoken + '/' + userInfo_g.usertype + '/' + userInfo_g.device_id,
                            dataType: 'jsonp',
                            success: function (data) {
                                if (data.msg) {
                                    new TipBox({str: data.msg});
                                }
                            },
                            complete: function() {
                                getInfoClass.getGameInfo(userInfo_g);
                            },
                            error: function (xhr, status, error) {
                            }
                        })
                    }
                }

            }
        })

        //展开我获得的奖品记录
        $('.my-award').on('click', function () {
            if (userInfo_g) {
                getInfoClass.getMyAwardInfo(userInfo_g.ccid);
                $('.myaward-container').show();
            } else {
                new TipBox({str: '请先登录'});
            }
        })

        //点击关闭奖品记录
        $('.myaward-close').on('click', function() {
            $('.myaward-container').hide();
        })

        //填写收货地址
        $('.address-btn').on('click', function() {
            $('.myaward-container').hide();
            $('.post-address').show();
        })

        $('.cancel-btn').on('click', function() {
            $('.post-address').hide();
        })

        //提交收货地址信息
        $('.submit-btn').on('click', function() {
            console.info('submit click');
            var qqnum = document.getElementById('qqnum').value;
            var phonenum = document.getElementById('phonenum').value;
            var truename = document.getElementById('truename').value;
            var address = document.getElementById('address').value;
            if (qqnum && phonenum && address && truename) {
                $.ajax({
                    url: DogzConfig.submitAjaxBase + 'userinfo_report4h5',
                    dataType: 'jsonp',
                    jsonpCallback: 'jsonp_userinfo_report',
                    data: {
                        "device_id": userInfo_g.device_id,
                        "ccid": userInfo_g.ccid,
                        "cctoken": userInfo_g.cctoken,
                        "user_type": userInfo_g.usertype,
                        "phone_num": phonenum,
                        "qq": qqnum,
                        "name": truename,
                        "address": address,
                    },
                    beforeSend: function() {
                        $('.loading-spinner').show();
                    },
                    success: function(data) {
                        console.info(JSON.stringify(data));
                        if (data.ret == 0) {
                            //submit success
                            $('.post-address').hide();
                            new TipBox({str: '活动奖品会在活动结束后5个工作日内发货,感谢您的参与！'})
                        } else {
                            $('.post-address').hide();
                            new TipBox({str: '提交信息出错,请重试！'})
                        }
                    },
                    error: function(err) {
                        console.info(JSON.stringify(err));
                        $('.post-address').hide();
                        new TipBox({str: '提交信息出错,请重试！'})
                    },
                    complete: function() {
                        $('.loading-spinner').hide();
                    },
                });
            } else {
                new TipBox({str: '请完善收货信息'});
            }
            
        })
    }
}

var getInfoClass = {

    //获取用户信息
    getUserInfo: function (userinfo, callback) {
        $.ajax({
            url: DogzConfig.baseurl + '/user/' + userinfo.ccid,
            dataType: 'jsonp',
            success: function (data) {
                if (data.data) {
                    $.extend(userInfo_g, data.data);
                    if (userInfo_g.nickname) {
                        $('.username').html(userInfo_g.nickname);
                    } else {
                        $('.username').html('可米酱');
                    }
                } else {
                    new TipBox({'str': data.msg});
                }
                if (callback) {
                    callback.call();
                }
            },
            error: function (xhr, status, error) {
                console.log('getUserInfo ajax error!');
                console.log(xhr);
            }
        })
    },

    // 获取游戏数据
    getGameInfo: function (userinfo, callback) {
        $.ajax({
            url: DogzConfig.baseurl + '/melee/' + DogzConfig.cycle_id + '/game/user/' + userinfo.ccid + '/' + userinfo.cctoken + '/' + userinfo.usertype + '/' + userinfo.device_id,
            dataType: 'jsonp',
            success: function (data) {
                if (data.data) {
                    $.extend(userInfo_g, data.data);
                    $('.kubi-cnt').html(userInfo_g.credit);
                    $('.shot-cnt').html(userInfo_g.points);
                } else {
                    new TipBox({str: data.msg});
                }
                if (callback) {
                    callback.call();
                }
            },
            error: function (xhr, status, error) {
                console.log('getGameInfo ajax error!');
                console.log(xhr);
            }
        })
    },

    // 获取排行
    getRankInfo: function (rankType) {
        var ccidTemp = userInfo_g.ccid ? userInfo_g.ccid : 0;
        $.ajax({
            url: DogzConfig.baseurl + '/melee/' + DogzConfig.cycle_id + '/rank/' + rankType + '/ccid/' + ccidTemp,
            dataType: 'jsonp',
            success: function (data) {
                if (data.data) {
                    userInfo_g[rankType] = data.data;
                    if (rankType == 'today') {
                        // 今日排行
                        $('#today-rank').html('');
                        var len = userInfo_g.today.toplist.length > 10 ? 10 : userInfo_g.today.toplist.length;
                        var liItemToday = '';
                        for (var i = 0; i < len; i++) {
                            var itemT = userInfo_g.today.toplist[i];
                            liItemToday += ''
                                +'<li class="tab-li">'
                                +'    <div class="rank">' + itemT.rank + '</div><div class="rankname">' + itemT.nickname + '</div><div class="rankres">' + itemT.data + 'cm</div>'
                                +'</li>';
                        }
                        $('#today-rank').append(liItemToday);
                        var me = userInfo_g.today.me;
                        if(me && me.data) {
                            var $me = $('<div class="champion"> 您当前排名：第' + me.rank + '名，&nbsp;&nbsp;&nbsp;&nbsp;' + me.data +'cm</div>');
                            $('#today-rank').append($me);
                        }
                    } else if (rankType == 'yesterday') {
                        // 昨日排行
                        $('#yesterday-rank').html('');
                        var len = userInfo_g.yesterday.toplist.length > 10 ? 10 : userInfo_g.yesterday.toplist.length;
                        var liItemYestoaday = '';
                        for (var i = 0; i < len; i++) {
                            var itemY = userInfo_g.yesterday.toplist[i];
                            liItemYestoaday += ''
                                +'<li class="tab-li">'
                                +'    <div class="rank">' + itemY.rank + '</div><div class="rankname">' + itemY.nickname + '</div><div class="rankres">' + itemY.data + 'cm</div>'
                                +'</li>';
                        }
                        $('#yesterday-rank').append(liItemYestoaday);
                    }
                }
            },
            error: function (xhr, status, error) {
                console.log('rankinfo error');
                console.log(xhr + '/t ' + status + ' /t ' + error);
            }
        })
    },

    // 获取我获得的奖品列表
    getMyAwardInfo: function (ccid) {
        $.ajax({
            url: DogzConfig.baseurl + '/melee/' + DogzConfig.cycle_id + '/topuser',
            dataType: 'jsonp',
            success: function (data) {
                if (data.data.length > 0) {
                    var awardHtml = '';
                    //render 我的奖品列表
                    for (var i=0, awardLen=data.data.length; i<awardLen; i++) {
                        for (var j=0, jLen=data.data[i].length; j<jLen; j++) {
                            if(data.data[i][j] == ccid) {
                                awardHtml += '<li><div class="award-name">' + awardArray[i][j] + '</div><div class="award-time">第' + (i+1) + '天</div></li>';                                    ;
                            }
                        }
                    }
                    console.info(awardHtml);
                    if(awardHtml) {
                        $('.myaward-list').html(awardHtml);
                    }
                }
            },
            error: function (xhr, status, error) {
                console.log('getMyAwardInfo error');
                console.log(xhr + '/t ' + status + ' /t ' + error);
            }
        })
    }
}

