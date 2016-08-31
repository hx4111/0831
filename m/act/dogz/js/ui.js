/**
 * Created by 郝旭 on 2016/3/14.
 */

function bindTouchEvent() { // 绑定touch事件
    var iconDou = {
        rr: 0.1,
        x: 42,//6.157
        y: 57.7,//4.345
        r: 0.1,
        max: 22,//2.17858
        isFit: true,
        pxCm: 0.06,
        boolLongTouch: false,
        aTemp: 0.000001,
    }; //初始化的目标位置 （单位%）
    var a = [0.00001, 0.000006, 0.000003]; // 定义加速度 （单位/10ms）
    var timestampStart = null, timestampEnd = null;
    var timer = null;
    var svgCircle = document.getElementById('svg-circle');
    svgCircle.setAttribute('cx', iconDou.x + '%');
    svgCircle.setAttribute('cy', iconDou.y + '%');
    $('.finger-block').on('singleTap', touchReset).on('longTap', touchStart);
    document.getElementsByClassName('finger-block')[0].addEventListener('touchend', touchEnd, false);
    function touchReset() {
        iconDou.r = iconDou.rr;
        iconDou.isFit = true;
        svgCircle.setAttribute('r', iconDou.r + '%');
    }
    function touchStart() {
        iconDou.boolLongTouch = true;
        if (userInfo_g.points < 1) {
            new TipBox({str: "你的可用助攻次数不足，请及时充值！"});
            return false;
        }
        var random = Math.floor((Math.random()*3));
        iconDou.aTemp = a[random];
        timestampStart = new Date().getTime();
        render();
    }

    function touchEnd() {
        if(!iconDou.boolLongTouch) {
            return false;
        }
        iconDou.boolLongTouch = false;
        timestampEnd = new Date().getTime();
        clearTimeout(timer);
        if (iconDou.isFit) {
            var resLength = (iconDou.r * iconDou.pxCm).toFixed(2);
            var commitInfo = hex_md5(userInfo_g.key + '' + resLength);
            commitGameRes(resLength, commitInfo);
            new TipBox({str:'本次共帮一瓜涨大了'+ resLength + 'cm', btnCallback: function(){touchReset();}});
        } else {
            var resLength = 0;
            var commitInfo = hex_md5(userInfo_g.key + '' + resLength);
            commitGameRes(resLength, commitInfo);
        }
        function commitGameRes (res, commitInfo) {
            if (!dateOutBox()) {
                return ;
            }

            console.info(DogzConfig.baseurl + '/melee/' + DogzConfig.cycle_id + '/game/data/' + resLength + '/user/' + userInfo_g.ccid + '/'
                + userInfo_g.cctoken + '/' + userInfo_g.usertype + '/' + userInfo_g.device_id + '/k/' + commitInfo);
            $.ajax({
                url: DogzConfig.baseurl + '/melee/' + DogzConfig.cycle_id + '/game/data/' + resLength + '/user/' + userInfo_g.ccid + '/'
                + userInfo_g.cctoken + '/' + userInfo_g.usertype + '/' + userInfo_g.device_id + '/k/' + commitInfo,
                dataType: 'jsonp',
                success: function(data) {
                    if (data.msg == "success") {
                        $('.user li').eq(2).html(userInfo_g.points - 1);
                        return true;
                    }
                },
                error: function (xhr) {
                }
            });
        }
        getInfoClass.getGameInfo(userInfo_g); // 每次提交数据后重新拉取一次，以获取发送游戏数据所需要的key
    }

    //启动render的计数器
    function render() {
        timer = setTimeout(function () {
            if (iconDou.isFit) {
                render();
                renderDou();
            }
        }, 10)
    }

    //render 渲染函数
    function renderDou() {
        var timestampNow = new Date().getTime();
        var between = timestampNow - timestampStart;
        var w = iconDou.aTemp * between * between; //增加的距离
        if (w < iconDou.r) { // 小于初始化的距离时
            return;
        } else {
            iconDou.r = w;
        }

        svgCircle.setAttribute('r',iconDou.r + '%');
        if (w > iconDou.max) { //超出最大距离
            iconDou.isFit = false;
            clearTimeout(timer);
            new TipBox({ str: "不小心爆掉了!", btnCallback: function(){touchReset();}});
        }
    }

}
