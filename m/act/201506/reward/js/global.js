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

//获取设备id，执行接口
callAppFunction("getDeviceID", "{}", function (result) {
    var appDeviceID = result;
    alert(appDeviceID);
    var url = '';
    var ajaxData = {
        'deviceid': appDeviceID,
        'activityid': 16,
        't' : (new Date()).valueOf()
    };

    $.ajax({
        url: url,
        data: ajaxData,
        type: 'get',
        timeout : '10000',
        dataType: 'jsonp',
        jsonp: 'callback',
        jsonpCallback: 'jsonp_activityindex',
        beforeSend: function() {
            loadingShow();
        },
        success: function(data) {
            //console.info('initPage success!', data);
        },
        complete: loadingHide,
        error : function(XMLHttpRequest, textStatus, errorThrown){
            alert('error');
            //errorShow('(' + XMLHttpRequest.status + ',' + XMLHttpRequest.readyState + ')');
        }
    });
});


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

window.onload = function() {
    //app分享与微信分享
    if (isApp) {
        var appShareObj = {
            'title' : '点赞就有话费！',
            'describe' : '看漫画还给补贴话费，踏马根本停不下来！',
            'imageurl' : 'http://cdn.icomicool.cn/m/act/201506/reward/images/share-img.jpg',
            'page_url' : 'http://m.comicool.cn/act/201506/reward/index.html'
        };
        /*var appShareStr = JSON.stringify(appShareObj);

        try {
            comicool.showShareBtn(appShareStr);
        } catch (e) {
            window.location.href= 'http://comicool/showShareBtn?title=' + appShareObj.title + '&describe=' + appShareObj.describe + '&imageurl=' + appShareObj.imageurl;
        }*/

        callAppFunction("showShareBtn", appShareObj);
    };

    if(isWeixin) {
        var wxUrl = 'http://comicool.cn/webapi/wxauth.php?url=' + encodeURIComponent(location.origin + location.pathname + location.search);
        
        //微信请求分享
        $.ajax({
            url: wxUrl,
            type: 'get',
            dataType: 'jsonp',
            jsonp: 'callback',
            jsonpCallback: 'jsonp_wxapi',
            success: function(data) {
                //alert(data);
                wx.config({
                    debug: false,
                    appId: data.appId, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature,// 必填，签名，见附录1
                    jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ']
                });
                wx.ready(function() {
                    var wxShareObj = {
                        title: '点赞就有话费！',
                        desc: '看漫画还给补贴话费，踏马根本停不下来！',
                        link: 'http://m.comicool.cn/act/201506/reward/index.html',
                        imgUrl: 'http://cdn.icomicool.cn/m/act/201506/reward/images/share-img2.jpg',
                        success: function() {
                            //分享成功后回调
                            //alert('succ');
                        },
                        cancel: function() {
                            //alert('cancel');
                        }
                    };

                    wx.onMenuShareAppMessage(wxShareObj);
                    wx.onMenuShareTimeline(wxShareObj);
                    wx.onMenuShareQQ(wxShareObj);
                });
            }
        });
    }

}   //window.onload 结束

