
var userInfo_g = {};

function main() {
    if (CONFIG.isApp) {
        setByUserLoginStatus({isLogin: loginCallback, unLogin: unloginCallback});
    } else {
        $('.post-btn, .praise').on('click', function() {
            if (CONFIG.isWeixin) {
                drawToast('点击右上角使用默认浏览器打开,下载最新App');
                return;
            }
            window.location.href = 'http://m.app.comicool.cn/smart_open/main.php?ch=prom5';
        })
    }

    //未登录回调
    function unloginCallback() {
    	console.info('unlogin ...');
        //设置App里登录后的回调函数
        callAppFunction('setJSCallback', {
            'account_event': 'loginHandler'
        });
        document.getElementById('post-btn').addEventListener('click', jumpLoginPage);
        window.loginHandler = function (obj) {
            document.getElementById('post-btn').removeEventListener('click', jumpLoginPage);
            setByUserLoginStatus({isLogin: loginCallback});
        }

        function jumpLoginPage() {
            callAppFunction('openLoginPage', {});
        }
    }

    //已登录回调
    function loginCallback(userinfo) {
    	console.info('login ...');
        $.extend(userInfo_g, userinfo);
        //  初始化信息

        bindEvent();
    }
}

function bindEvent() {
	//填写收货地址
    $('.post-btn').on('click', function() {
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
        if (qqnum && phonenum) {
            $.ajax({
                url: CONFIG.ajaxBase + 'userinfo_report4h5',
                dataType: 'jsonp',
                jsonpCallback: 'jsonp_userinfo_report',
                data: {
                    "device_id": userInfo_g.device_id,
                    "ccid": userInfo_g.ccid,
                    "cctoken": userInfo_g.cctoken,
                    "user_type": userInfo_g.usertype,
                    "phone_num": phonenum,
                    "qq": qqnum,
                },
                beforeSend: function() {
                    $('.loading-spinner').show();
                },
                success: function(data) {
                    console.info(JSON.stringify(data));
                    if (data.ret == 0) {
                        //submit success
                        $('.post-address').hide();
                        drawToast('提交信息成功，请持续关注中奖信息，魔兽电影票等你拿！');
                    } else {
                        $('.post-address').hide();
                        drawToast('提交信息出错,请重试！');
                    }
                },
                error: function(err) {
                    console.info(JSON.stringify(err));
                    $('.post-address').hide();
                    drawToast('提交信息出错,请重试！');
                },
                complete: function() {
                    $('.loading-spinner').hide();
                },
            });
        } else {
            drawToast('请完善收货信息');
        }
        
    })

}