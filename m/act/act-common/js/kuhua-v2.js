var Comi = {};
var DOWNLOAD_URL = 'http://m.app.comicool.cn/smart_open/main.php?ch=kh';

Comi.Utils = {
  LocalStorage: {
    add: function(key, val) {
      window.localStorage.setItem(key, val);
      return val;
    },
    del: function(key) {
      window.localStorage.removeItem(key);
    },
    get: function(key) {
      return window.localStorage.getItem(key);
    }
  },
  getUserInfo: function() {
    var userStr = Comi.Utils.LocalStorage.get('comiUserData');
    var user = JSON.parse(userStr);

    if (user == null || user && user.outDated) {
      return null;
    } else {
      return user;
    }
  },
//getDeviceID: function () {
//  var deviceID = Comi.Utils.LocalStorage.get('deviceID') || Comi.Utils.LocalStorage.add('deviceID', createDeviceID());
//  this.getDeviceID = function () {
//      return deviceID;
//  };
//  return deviceID;
//}
getDeviceID: function() {
					var deviceID = Comi.Utils.LocalStorage.get('deviceID');
					if (!deviceID) {
						deviceID = createDeviceID();
						Comi.Utils.LocalStorage.add('deviceID', deviceID, 9999);
					}
					return deviceID;
				}
};

var ua=navigator.userAgent.toLowerCase(),
    isIOS = false,
    isMobile = ua.indexOf('mobile')>0,
    isWeixin = (/micromessenger/.test(ua)) ? true : false,
    isQQ = (/qq\//.test(ua)) ? true : false,
    isIOS = ua.indexOf('(ip')>0 && isMobile,
    isWeibo = (/Weibo/i.test(ua)) ? true : false,
    isAndr = ua.indexOf('android') > -1 || ua.indexOf('linux') > -1;

// 图片递归加载
function loadpic(list,callback){
    if( $.isArray(list) && list.length ){
        var item = list.shift();
        var image = new Image();
        image.src = item;
        image.alt = '可米酷漫画';
        image.onload = function(){
            $('.sr-con').append($(this));
            loadpic(list,callback);
        };
    }else{
        $.isFunction(callback) && callback(list);
    }
}

loadpic(imgList,function(){
    $('.sr-foot').show();
});

//点击下载
$('.header-openapp, .sr-foot-img, .download-tip').on('click', function () {
    window.location.href = DOWNLOAD_URL;
});

//点击关闭下载提示
$('.download-close').on('click', function (e) {
    e.stopPropagation();
    $('body').addClass('hide-download');
});

//悬浮按钮
$('.goto-home').on('touchend', function (e) {
    e.stopPropagation();

    var target = $(e.target);
    var activeClass = 'goto-home-expand';

    if (target.hasClass('goto-home')) {
        e.preventDefault();
        var list = target.find('ul');
        var hideFn = function () {
            list.removeClass(activeClass);
            $(document).off('touchend', hideFn);
        };

        if (!target[0].hideFn) {
            target[0].hideFn = hideFn;
        }

        if (list.hasClass(activeClass)) {
            hideFn();
        } else {
            list.addClass(activeClass);
            $(document).on('touchend', hideFn);
        }
        
    }
});

//上报访问数据
$.ajax({
    url: 'http://proxy.icomico.com/eventreport4h5',  //http://121.201.7.97/
    data: {
        comic_id: comic_id,
        ep_id: ep_id,
        device_id: Comi.Utils.getDeviceID()
    },
    type: 'get',
    dataType: 'jsonp',
    jsonp: 'callback',
    jsonpCallback: 'jsonp_eventreport'
});

//获取点赞数
$.ajax({
    url: 'http://proxy.icomico.com/getextinfo4h5',
    data: {
        comic_id: comic_id,
        device_id: Comi.Utils.getDeviceID()
    },
    dataType: 'jsonp',
    jsonpCallback:"jsonp_getextinfo",
    success: function (data) {
        if (data.msg === 'success' || data.ret === 0) {
            var arr = data.ep_ext_list;
            
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i].ep_id == ep_id) {
                    $('#praise-count').text(arr[i].praise_count);
                    break;
                }
            }
        }
    }
});

//点赞
(function() {
    var isPraised = 0;
    var user = Comi.Utils.getUserInfo();

    if (user) {
        var ccid = user.userid;
        //获取用户点赞过的单话数据
        $.ajax({
            url: 'http://proxy.icomico.com/syncextinfo4h5',
            data: {
                'operate': 2,
                'cc_id': ccid
            },
            dataType: 'jsonp',
            jsonpCallback: 'jsonp_syncextinfo',
            success: function(data) {
                var praisedArr = data.ep_ext_list;

                if (praisedArr && praisedArr.length) {
                    $.each(praisedArr, function(i, t) {
                        if (t.comic_id == comic_id && t.ep_id == ep_id) {
                            isPraised = 1;
                            return false;
                        }
                    });
                }

                setPraiseStatus(isPraised, ccid);
            }
        });
    } else {
        isPraised = +(Comi.Utils.LocalStorage.get(comic_id + '-' + ep_id + 'praised') || 0);
        setPraiseStatus(isPraised, null);
    }
})();

//设置点赞状态
function setPraiseStatus(isPraised, ccid) {
    var $btn = $('.ep-praise-btn');
    var status = isPraised;

    if (status == 1) {
        $btn.addClass('ep-praise-on');
    }

    $btn.data('praised', status).click(function(e) {
        var btnData = +$btn.data('praised');
        var ajaxData = {
            'operate': 1,
            'action': btnData + 1,
            'comic_id': comic_id,
            'ep_id': ep_id
        }

        if (ccid != null) {
            ajaxData.cc_id = ccid;
        }

        e.stopPropagation();
        $.ajax({
            url: 'http://proxy.icomico.com/syncextinfo4h5',
            data: ajaxData,
            dataType: 'jsonp',
            jsonpCallback: 'jsonp_syncextinfo',
            success: function(data) {
                var isPraised = +!btnData;

                if (isPraised == '1') {
                    $('#praise-count').html(function(i, v) {
                        return +(v) + 1;
                    });
                    !ccid && Comi.Utils.LocalStorage.add(comic_id + '-' + ep_id + 'praised', isPraised);
                } else {
                    $('#praise-count').html(function(i, v) {
                        return +(v) - 1;
                    });
                    !ccid && Comi.Utils.LocalStorage.del(comic_id + ep_id + 'praised');
                }

                $btn.toggleClass('ep-praise-on').data('praised', isPraised);
            }
        });
    });
}

//生成deviceID
function createDeviceID() {
  var timeStampToHex = 'a1' + new Date().getTime().toString(16).slice(-10);

  function hex4() {
    return ("0000" + Math.floor(Math.random() * 0x10000).toString(16)).slice(-4);
  }

  function hex8() {
    return ("00000000" + Math.floor(Math.random() * 0x100000000).toString(16)).slice(-8);
  }

  return timeStampToHex + hex8() + hex8() +hex4();
}

function headerToggleFade(action) {
    if (action === 'listen') {
        arguments.callee.listen.call(this);
    } else {
        arguments.callee.unlisten.call(this);
        this.removeClass('header-mini');
    }
}

headerToggleFade.listen = function () {
    var that = this;
    var touch = {};

    this.startTouch = function (e) {
        touch.startY = e.changedTouches[0].clientY;
        touch.startTime = new Date().getTime();
    };
    this.endTouch = function (e) {
        touch.endY = e.changedTouches[0].clientY;
        touch.endTime = new Date().getTime();
        touch.offset = touch.endY - touch.startY;
        touch.time = touch.endTime - touch.startTime;
        touch.dis = Math.abs(touch.offset);
        touch.dir = touch.offset < 0 ? 'up' : 'down';

        if (touch.dir === 'up' && touch.dis > 20) {
            that.removeClass('header-mini');
        } else if (touch.dir === 'down' && (touch.dis > 100 && touch.time < 200)) {
            that.addClass('header-mini');
        }
    };

    $(document).on('touchstart', this.startTouch);
    $(document).on('touchend', this.endTouch);
};

headerToggleFade.unlisten = function () {
    $(document).off('touchstart', this.startTouch);
    $(document).off('touchend', this.endTouch);
};

(function () {
    var header = $('.header');
    var headerHeight = header.height();
    var threshold = $('.header-t').height();
    var container = $('#sr-con');
    var gotopBtn = $('#gotop');
    var lock = false;

    $(window).on('scroll', function () {
        var curTop = $('body').scrollTop();

        if (curTop > threshold) {
            if (!lock) {
                lock = true;
                gotopBtn.show();
                header.css({
                    position: 'fixed',
                    top: -threshold
                });
                container.css({
                    marginTop: headerHeight
                });
                headerToggleFade.call(header, 'listen');
            }
        } else {
            lock = false;
            gotopBtn.hide();
            header.css({
                position: 'relative',
                top: 0
            });
            container.css({
                marginTop: 0
            });
            headerToggleFade.call(header, 'unlisten');
        }
    });

    //返回顶部
    gotopBtn.on('touchend', function(e) {
        e.preventDefault();//防止点击穿透
        $('html, body').scrollTop(0);
        $('.goto-home')[0].hideFn();
    });
})();