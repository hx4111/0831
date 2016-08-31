
var readRecord = [false, false, false, false, false];
var g_userinfo = {};
var nowDate = new Date().getDate()-1;
// var nowDate = 5;


function init() {
    if (CONFIG.isApp) {
        console.info('isApp');
        setByUserLoginStatus({isLogin: loginCallback, unLogin: unloginCallback});
    } else {
        $(document).on('touchend', '.unlogin-handle', function() {
            if (CONFIG.isWeixin) {
                new TipBox({str: '点击右上角使用默认浏览器打开,下载最新App'});
                return;
            } else {
                new TipBox({
                    str: '下载可米酷App,看漫画,做任务,参与精美周边抽取', 
                    btnText: ['取消', '确认'], 
                    btnCallback: function() {
                        if (this.innerText == '确认') {
                            window.location.href = 'http://m.app.comicool.cn/smart_open/main.php';
                        } else {
                            return;
                        }
                    }
                })
            } 
        })
    }

    function unloginCallback() {
        console.info('unLogin');
        //设置App里登录后的回调函数
        callAppFunction('setJSCallback', {
            'account_event': 'loginHandler'
        });
        $(document).on('touchend', '.unlogin-handle', jumpLoginPage);
        window.loginHandler = function (obj) {
            $(document).off('touchend', '.unlogin-handle', jumpLoginPage);
            setByUserLoginStatus({isLogin: loginCallback});
        }

        function jumpLoginPage() {
            callAppFunction('openLoginPage', {});
        }
    }

    function loginCallback(userinfo) {
        g_userinfo = userinfo;
        $('.username').html(userinfo.nickname).removeClass('unlogin-handle');
        
    }

    $('.header-left-inner').html('7.' + (nowDate+1 > 5 ? 6 : nowDate+1) + '新作');

    var readCookie = getCookie('readRecord');
    if (readCookie) {
        readRecord = readCookie.split(',');
    } else {
        setCookie('readRecord', readRecord, 30);
    }
    console.info(readRecord);
}

function renderMain() {
    if (nowDate > 5) {
        nowDate = 5;
    }
    if (nowDate == 0) {
        nowDate = 1;
    }
    $('.book-block').eq(nowDate-1).addClass('now-block');

    render.renderBookBlock(); //渲染日阅读模块
    render.renderCover(); // 渲染当前的阅读漫画封面
    var bookid = $('.now-block').data('bookid');
    $(document).on('touchend', '.go', function() {
        if (g_userinfo) { // 只有登录状态下才记录 
            readRecord[nowDate-1] = true;
            setCookie('readRecord', readRecord, 30);
        }
    })

}

var render = {

    renderBookBlock: function() {
        var jdData = 0;
        for (var i=0; i<nowDate; i++) {
            if (readRecord[i] == "true") {
                jdData += 20;
                $('.book-block').eq(i).find('img').attr('src', 'http://cdn.icomicool.cn/m/act/holidaynews0701/images/read-bg.png');
            } else {
                $('.book-block').eq(i).find('img').attr('src', 'http://cdn.icomicool.cn/m/act/holidaynews0701/images/book-bg.png');
            }
        }
        $('#jd-data').html(jdData);
        if (jdData == 100) {
            $('#door-img').attr('src', 'images/door-open.jpg').addClass('go').data('ccid', 11628);
        }
    },

    renderCover: function() {
        var bookid = $('.now-block').data('bookid');

        jsonp({
            url: 'comicdetail4web',
            jsonpCallback: 'jsonp_comicdetail',
            data: {
                comic_id: bookid
            },
            success: function(data) {
                $('#book-cover').attr('src', 'http://cdn.icomico.com/' + data.comic_info.pc_horizontal_poster);
                $('.book-header-right').html(data.comic_info.comic_title);
                $('.read-handle').data('ccid', bookid);
            }
        })
    }
}