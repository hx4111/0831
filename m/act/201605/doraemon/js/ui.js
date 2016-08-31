/**
 * Created by 郝旭 on 2016/3/14.
 */

var touchConfig = {
    startWidth: 20,
    touchWidth: 20,
    speed: 2,
    boolLongTouch: false,
    speedType: 1,
    direction: 1,
};

function bindTouchEvent() { // 绑定touch事件
    $('.ctrl-hand').on('singleTap', touchReset).on('longTap', touchStart);

    document.getElementsByClassName('ctrl-hand')[0].addEventListener('touchend', touchEnd, false);
    function touchReset() {
        touchConfig.touchWidth = touchConfig.startWidth;
        $('.shot-show-panel').css('width', touchConfig.touchWidth + '%');
    }
    function touchStart() {
        touchConfig.boolLongTouch = true;
        if (userInfo_g.points < 1) {
            new TipBox({str: "你的可用射击次数不足，请及时兑换！"});
            return false;
        }
        var random = Math.ceil((Math.random()*3));
        touchConfig.speedType = random;
        render();
    }

    function touchEnd() {
        if(!touchConfig.boolLongTouch) {
            return false;
        }
        touchConfig.boolLongTouch = false;
        clearTimeout(timer);
        var resLength = touchConfig.touchWidth;
        var commitInfo = hex_md5(userInfo_g.key + '' + resLength);
        commitGameRes(resLength, commitInfo); 
        new TipBox({str:'本次射击长度'+ resLength + 'cm', btnCallback: function(){touchReset();}});
        function commitGameRes (res, commitInfo) {
            if (!dateOutBox()) {
                return ;
            }

            $.ajax({
                url: DogzConfig.baseurl + '/melee/' + DogzConfig.cycle_id + '/game/data/' + resLength + '/user/' + userInfo_g.ccid + '/'
                + userInfo_g.cctoken + '/' + userInfo_g.usertype + '/' + userInfo_g.device_id + '/k/' + commitInfo,
                dataType: 'jsonp',
                success: function(data) {
                    if (data.msg == "success") {
                        return true;
                    } else {
                        new TipBox({str: data.msg});
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
            if (touchConfig.direction) {
                touchConfig.touchWidth += touchConfig.speed * touchConfig.speedType;
                if (touchConfig.touchWidth > 100) {
                    touchConfig.touchWidth = 100;
                    touchConfig.direction = 0;
                }
            } else if (touchConfig.direction == 0) {
                touchConfig.touchWidth -= touchConfig.speed * touchConfig.speedType;
                if (touchConfig.touchWidth < 0) {
                    touchConfig.touchWidth = 0;
                    touchConfig.direction = 1;
                }
            }
            $('.shot-show-panel').css('width', touchConfig.touchWidth + '%');
            render();
        }, 10)
    }

}
