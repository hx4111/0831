/**
 * Created by 郝旭 on 2016/3/14.
 */
var userInfo_g = {
    'drawSpan': 40
};

function forTest(str, debug) {
    debug = false;
    if (debug) {
        $('.box').after($('<div>' + str + '</div>'));
        console.info(str);
    }
}

function dateOutBox () {
    var timeStamp = new Date().getTime();
    var outDate = 1460649600; // 2016-04-15 00:00:00
    if (timeStamp >= outDate) {
        new TipBox({str: '活动已结束，谢谢参与！'});
        return false;
    }
    return true;
}

function main() {
    dateOutBox();
    $('.drawSpan').html('(每次消耗' + userInfo_g.drawSpan + '酷币)');
    if (isApp) {
        setByUserLoginStatus({isLogin: loginCallback, unLogin: unloginCallback});
    }

    //未登录回调
    function unloginCallback() {

        getInfoClass.getRankInfo('today');
        getInfoClass.getRankInfo('yesterday');
        getInfoClass.getAwardInfo();

        //设置App里登录后的回调函数
        callAppFunction('setJSCallback', {
            'account_event': 'loginHandler'
        });
        document.getElementById('draw').addEventListener('touchend', jumpLoginPage);
        document.getElementById('prize').addEventListener('touchend', jumpLoginPage);
        document.getElementById('user-login').addEventListener('touchend', jumpLoginPage);
        document.getElementById('finger-block').addEventListener('touchend', jumpLoginPage);
        window.loginHandler = function (obj) {
            document.getElementById('draw').removeEventListener('touchend', jumpLoginPage);
            document.getElementById('prize').removeEventListener('touchend', jumpLoginPage);
            document.getElementById('user-login').removeEventListener('touchend', jumpLoginPage);
            document.getElementById('finger-block').removeEventListener('touchend', jumpLoginPage);
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
        $('.user-login h3').hide();
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
            that.getAwardInfo();
        }

        initInfo(userinfo, bindEvent);
    }

    function bindEvent() {
        bindTouchEvent();

        // 100酷币兑换2次
        $('.user-login img').on('touchend', function () {
            if (!userInfo_g) {
                new TipBox({str: '请先登录'});
                return false;
            } else {
                if (!dateOutBox()) {
                    return ;
                }
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
        })

        //展开我获得的奖品记录
        $('#prize a').on('touchend', function () {
            if (userInfo_g) {
                getInfoClass.getMyAwardInfo(userInfo_g.ccid);
                $('.my-award').show();
                $('#ShareBg').show();
            } else {
                new TipBox({str: '请先登录'});
            }
        })

        $('.btn-close').on('touchend', function () {
            $('.my-award').hide();
            $('#ShareBg').hide();
        })

        $('.getPrize').on('touchend', function () {
            var timestampStart = new Date();
            if (userInfo_g.credit < userInfo_g.drawSpan) {
                new TipBox({type: 'toastBox', str: '酷币余额不足'});
                return false;
            } else {
                if (!dateOutBox()) {
                    return ;
                }
                getByAjax({
                    url: DogzConfig.baseurl + '/melee/' + DogzConfig.cycle_id + '/draw/user/' + userInfo_g.ccid + '/' + userInfo_g.cctoken + '/' + userInfo_g.usertype + '/' + userInfo_g.device_id,
                    dataType: 'jsonp',
                    success: function (data) {
                        var timestampEnd = new Date();
                        if (data.code == 0) {
                            userInfo_g.credit = data.data.credit;
                            $('.user li').eq(1).html('酷币余额:' + userInfo_g.credit);
                            new TipBox({str: data.data.prize});
                        } else {
                            new TipBox({str: data.msg});
                        }
                        getInfoClass.getGameInfo(userInfo_g);
                    },
                    error: function (xhr, status, error) {
                        console.log('getDrawInfo ajax error!');
                        console.log(xhr);
                    }
                })
            }
        })

        //跳转兑吧
        $('.exchange').on('touchend', function () {
            callAppFunction('openMallPage', {});
        })

        $('.newTit li').eq(1).on('touchend', function () {
            getInfoClass.getRankInfo('today');
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
                        $('.user li').eq(0).html('昵称:' + userInfo_g.nickname);
//                      $('.user li').eq(0).html("昵称:"+userInfo_g.nickname);
                    } else {
                        $('.user li').eq(0).html('昵称:可米酱');
//                      $('.user li').eq(0).html('昵称:可米酱');
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
                    $('.user li').eq(1).html('酷币余额:' + userInfo_g.credit);
                    $('.user li').eq(2).html('助攻次数:' + userInfo_g.points);
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

    // 获取奖励说明
    getAwardInfo: function () {
        $.ajax({
            url: DogzConfig.baseurl + '/melee/' + DogzConfig.cycle_id + '/awardtext',
            dataType: 'jsonp',
            success: function (data) {
                userInfo_g.award_text = data.data;
                $('#award').html(userInfo_g.award_text);
            },
            error: function (xhr, status, error) {
                console.log('getAwardInfo ajax error!');
                console.log(xhr + '/t ' + status + ' /t ' + error);
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
                        $('#today').html('');
                        var len = userInfo_g.today.toplist.length > 10 ? 10 : userInfo_g.today.toplist.length;
                        for (var i = 0; i < len; i++) {
                            var itemT = userInfo_g.today.toplist[i];
                            var $rankItemT =
                                $('<ul>'
                                    + '  <li>NO.' + itemT.rank + '</li>'
                                    + '  <li>' + itemT.nickname + '</li>'
                                    + '  <li>' + itemT.data + ' cm</li>'
                                    + '</ul>');
                            $('#today').append($rankItemT);
                        }
                        var me = userInfo_g.today.me;
                        if(me && me.data) {
                            var $me = $('<div class="champion"> 您当前排名：' + me.rank + '位，&nbsp;&nbsp;&nbsp;&nbsp;' + me.data +'cm</div>');
                            $('#today').append($me);
                        }
                    } else if (rankType == 'yesterday') {
                        // 昨日排行
                        $('#yesterday').html('');
                        var len = userInfo_g.yesterday.toplist.length > 10 ? 10 : userInfo_g.yesterday.toplist.length;
                        for (var i = 0; i < len; i++) {
                            var itemY = userInfo_g.yesterday.toplist[i];
                            var $rankItemY = $('<ul>'
                                + '<li>NO.' + itemY.rank + '</li>'
                                + '<li>' + itemY.nickname + '</li>'
                                + '<li>' + itemY.data + ' cm</li>'
                                + '</ul>');
                            $('#yesterday').append($rankItemY);
                        }
                        var championInfo = userInfo_g.yesterday.champion;
                        var $champion = $('<div class="champion">NO.1 ' + championInfo.user.nickname + '获得了 &nbsp; ' + championInfo.award + 'QB</div>');
                        $('#yesterday').append($champion);
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
            url: DogzConfig.baseurl + '/melee/' + DogzConfig.cycle_id + '/award/user/' + ccid,
            dataType: 'jsonp',
            success: function (data) {
                if (data.data.length > 0) {
                    //render 我的奖品列表
                    $('.my-award ul').html('');
                    userInfo_g.myAwardList = data.data;
                    for (var i = 0, len = userInfo_g.myAwardList.length; i < len; i++) {
                        var winTime = new Date(userInfo_g.myAwardList[i].win_time * 1000);
                        var winMonth = winTime.getMonth() + 1;
                        var winDay = winTime.getDate();
                        var winHour = winTime.getHours();
                        var winMinute = winTime.getMinutes();
                        var winTimeLocal = winMonth + '月' + winDay + '日 &nbsp;&nbsp;' + winHour + '&nbsp;:&nbsp;' + winMinute;
                        var $awardItem = $('<li>' + userInfo_g.myAwardList[i].commodity_name + '&nbsp;&nbsp;&nbsp;&nbsp;' + winTimeLocal + '</li>');
                        $('.my-award ul').append($awardItem);
                    }
                } else {
                    $('.my-award ul').html('<span>暂未获奖，继续努力!</span>');
                }
            },
            error: function (xhr, status, error) {
                console.log('getMyAwardInfo error');
                console.log(xhr + '/t ' + status + ' /t ' + error);
            }
        })
    }
}

