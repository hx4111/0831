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

//打开阅读元素操作调用  
$('.openLnk, .sr-bottomtip img, .sr-foot-img img').on('click',function(){
    if (isTipsShow()) {//ios里的微博
        $(this).parents('.sr-bottomtip').hide();
    } else {
        window.location.href = DOWNLOAD_URL;
    }
});

$('.toptip-btn a.clo').on('click', function(){
	$('.sr-bottomtip').hide();
});

$('a.back-btn').on('click', function(e){
	e.stopPropagation();
	$('.drop-tip').toggle();
	
});

$(document).on('click', function(e) {
	if (document.getElementById('drop-tip').style.display == 'block') {
    	$('.drop-tip').hide();
    };
});
//设置微信等判断出现提示内容
function isTipsShow(){
    if (isIOS && isWeibo) {
        $('.tips').removeClass('hide');
        return true;
    } else {
        return false;
    }
}

loadpic(imgList,function(){
    $('.sr-foot').show();
});

if ($('.goto-top').size()) {
    scrollToTop();
}

$('.header-comments').on('click', function () {
    if (confirm('下载可米酷app查看精彩评论~')) {
        window.location.href = DOWNLOAD_URL;
    }
});

//获取评论数
$.ajax({
    url: 'http://proxy.icomico.com/getcomments4h5',
    data: {
        comic_id: comic_id,
        ep_id: 0,
        comment_id: 0,
        page_size:0,
        page_direction:2,
        device_id: Comi.Utils.getDeviceID()
    },
    dataType: 'jsonp',
    jsonpCallback:"jsonp_getcomments",
    success: function (data) {
        if (data.msg === 'success' || data.ret === 0) {
            var total = data.comment_count;
            $('.header-comments').html(function (i, v) {
                if (total > 999) {
                    return v + '999+';
                } else {
                    return v + total + '条';
                }
            });
        }
    }
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

function scrollToTop(){
    $(window).scroll( function() { 
        var scrollValue=$(window).scrollTop();
        scrollValue > 125 ? $('.goto-top').addClass('show-top') : $('.goto-top').removeClass('show-top');
    } );  
    $('.goto-top').on('click',function(){
        document.documentElement.scrollTop = document.body.scrollTop = 0;
    }); 
}

(function () {
    var threshold = $('.sr-head-con').height();
    var tip = $('.sr-contip');
    var container = $('#sr-con');

    if (tip.size()) {
        window.addEventListener('scroll', function () {
            var curTop = $('body').scrollTop();

            if (tip.css('display') === 'none') return false;

            if (curTop > threshold) {
                container.css('margin-top', threshold);
                tip.css({
                    'position': 'fixed',
                    'top': 0
                });
            } else {
                container.css('margin-top', 0);
                tip.css({
                    'position': 'relative',
                    'top': 0
                });
            }
        }, false);
    }
})();

//上报访问数据
window.onload = function(){
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
}