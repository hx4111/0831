
var readRecord = [false, false, false, false, false];
var g_userinfo = {};
var nowDate = new Date().getDate();
var nowIndex = nowDate - 7;


function init() {
    if (CONFIG.isApp) {
        setByUserLoginStatus({isLogin: loginCallback, unLogin: unloginCallback});
    } else {
        $(document).on('touchend', '.unlogin-handle', function() {
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

    $('.header-left-inner').html('7.' + (nowDate>11 ? 11 : nowDate) + '新作');
    initData();
}

function initData() {
    var readCookie = getCookie('readRecord0707');
    if (readCookie) {
        readRecord = readCookie.split(',');
    } else {
        setCookie('readRecord0707', readRecord, 30);
    }
}

function renderMain() {
    if (nowIndex > 4) {
        nowIndex = 4;
    }
    if (nowIndex < 0) {
        nowIndex = 0;
    }
    $('.book-block').eq(nowIndex).addClass('now-block');

    render.renderBookBlock(); //渲染日阅读模块
    render.renderCover(); // 渲染当前的阅读漫画封面
    var bookid = $('.now-block').data('bookid');
    $(document).on('touchend', '.go', function() {
        if (g_userinfo) { // 只有登录状态下才记录 
            readRecord[nowIndex] = true;
            setCookie('readRecord0707', readRecord, 30);
        }
    })

}

var render = {

    renderBookBlock: function() {
        var jdData = 0;
        for (var i=0; i<=nowIndex; i++) {
            if (readRecord[i] == "true") {
                jdData += 20;
                $('.book-block').eq(i).find('img').attr('src', 'images/read-bg.png');
            } else {
                $('.book-block').eq(i).find('img').attr('src', 'images/book-bg.png');
            }
        }
        $('#jd-data').html(jdData);
        if (jdData == 100) {
            $('#door-img').attr('src', 'images/door-open.jpg').data('ccid', 11628);
        }
    },

    renderCover: function() {
        var bookid = $('.now-block').data('bookid');
        var epid = $('.now-block').data('epid');
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
                if (epid) {
                    $('.read-handle').data('epid', epid);
                }
            }
        })
    }
}