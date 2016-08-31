/**
 * Created by hx on 2016/3/28.
 */
(function(win) {
    var base = location.origin;
    var deviceID = getCookie('deviceID') || setCookie('deviceID', createDeviceID(), 9999);
    win.CONFIG = {
        ajaxBase: 'http://proxy.icomico.com/', //测试：http://121.201.7.97:80/ 正式：http://proxy.icomico.com/
        rootUrl: base + '/tv',
        readerBase: base + '/tv/content/reader.html?',
        detailBase: base + '/tv/content/detail.html?',
        imgBase: 'http://cdn.icomico.com/',
        placeholder: base + '/images/blank.png',
        imgAlt: '可米酷漫画,comicool,手机漫画,原创漫画,漫画app',
        deviceID: deviceID
    };
})(window);

if (/localhost|192\.168/.test(location.hostname)) {
    CONFIG.ajaxBase = 'http://121.201.7.97:80/';
}

//获取页面URL参数名
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
};

//设置cookies
function setCookie(name,value,day){
    var Days = day || 7;
    var exp = new Date();
    var host = window.location.hostname;
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape(value) + ";expires=" + exp.toGMTString() + ';path=/;domain=' + host;
    return value;
};

//读取cookies
function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        return unescape(arr[2]);
    }
    else{
        return null;
    }
};

//删除cookies
function delCookie(name){
    setCookie(name, "", -1);
}

//生成deviceID
function createDeviceID() {
    var timeStampToHex = 'a0' + new Date().getTime().toString(16).slice(-10);

    function hex4() {
        return ("0000" + Math.floor(Math.random() * 0x10000).toString(16)).slice(-4);
    }

    function hex8() {
        return ("00000000" + Math.floor(Math.random() * 0x100000000).toString(16)).slice(-8);
    }

    return timeStampToHex + hex8() + hex8() +hex4();
}

