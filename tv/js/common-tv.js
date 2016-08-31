/**
 * Created by hx on 2016/3/27.
 */
/**
 * 通过ajax的jsonp获取版块数据
 * @param  {Object} obj 可设置api、jsonpCallback、success、beforeSend、complete等
 * @return {Functioin}     返回内部的complete方法供外部执行（切换排行榜时要执行图片加载）
 */
function getByAjax(obj) {
    if (obj.beforeSend && (obj.beforeSend() === false)) { //如果填写了beforSend且返回值为false
        complete();
        return false;
    }
    var channel = getQueryString('ch') || getCookie('ch');
    var dataObj = $.extend(obj.data || {}, {
        device_id: CONFIG.deviceID,
        channel: channel
    });

    var ajaxParams = {
        url: obj.url || CONFIG.ajaxBase + obj.api,
        type: 'GET',
        data: dataObj,
        dataType: 'jsonp',
        jsonpCallback: obj.jsonpCallback,
        timeout: obj.timeout || 15000,
        complete: function () {
            obj.complete && obj.complete();
            complete();
        },
        success: obj.success,
        error: function () {
            obj.error && obj.error();
            !obj.notDefaultErr && errorPage();
        }
    };

    //执行请求
    $.ajax(ajaxParams);

    function complete() {
        $('html').removeClass('loading-page');
        //请求完成

        $('html').imgLoader({
            load: function (img) {
                if (obj.afterImgLoad && $(img).index() == 0) {
                    $('html').removeClass('loading-page');
                }
            },
            error: function (img) {
                // $(img).attr('src', errImg);
            }
        });

    }

    function errorPage() {
        var errorHtml = '<div class="errorbox">' + '<header class="header error-header">' + '<a href="' + location.origin + '/index.html" class="l-icon icon-home"></a>' + '</header>' + '<div class="error-main">' + '<div class="error-img">' + '<img src="images/error.png" alt="可米酷漫画,comicool,手机漫画,原创漫画,漫画app">' + '</div>' + '<div class="error-txt">' + '<p>三次元的网络不行呀</p>' + '<p><a href="javascript:window.location.reload()">再次刷新</a></p>' + '</div>' + '</div>' + '</div>';
        $('body').html(errorHtml);
    }
}

/**
 * 图片加载
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
$.fn.imgLoader = function (callback) {
    //图片递归加载

    $(this).find('img').each(function (i, el) {
        var img = new Image();
        var src = $(el).data('src');
        img.src = src;

        img.onload = function () {
            el.src = src;
            if (callback.load) {
                callback.load(el);
            }
        }

        img.onerror = function () {
            if (callback.error) {
                callback.error(el);
            }
        }
    })
}

/**
 * 按键绑定
 * @param  {Function} obj [description]
 * */
function KeyPressEvent(obj) {

    this.keyConfig = {
        'scrollPerHeight': 400,
        'rowCnt': [],
        'currentCnt': {x: 0, y: 0},
        'eventArray': [],
        'focusClass': 'focus-block',
        'leftkeyCallback': null,
        'rightkeyCallback': null,
        'upkeyCallback': null,
        'downkeyCallback': null,
        'enterkeyCallback': null,
        'esckeyCallback': null,
        'firstFoucs': null,
    };

    return this.init(obj);
}

KeyPressEvent.prototype.init = function(obj) {
    $.extend(this.keyConfig, obj);
    this.firstFocus();
    this.bindEvent();
    return this;
}

KeyPressEvent.prototype.firstFocus = function() {
    var keyConfig = this.keyConfig;
    if (keyConfig.eventArray && keyConfig.eventArray.length > 0) {
        if (keyConfig.firstFoucs) {
            keyConfig.currentCnt = {x: keyConfig.firstFoucs.x, y: keyConfig.firstFoucs.y};
            $(keyConfig.eventArray[keyConfig.firstFoucs.x][keyConfig.firstFoucs.y]).addClass(keyConfig.focusClass);
            this.scrollEvent(0);
        } else {
            keyConfig.currentCnt = {x: 0, y: 0};
            $(keyConfig.eventArray[keyConfig.currentCnt.x][keyConfig.currentCnt.y]).addClass(keyConfig.focusClass);
            this.scrollEvent(0);
        }
    }
}

KeyPressEvent.prototype.bindEvent = function() {
    var keyConfig = this.keyConfig;
    var _this = this;
    document.onkeydown = function (e) {
        var keycode = event.keyCode || event.which;
        console.info(keycode);
        switch (keycode) {
            case 37 :
                if (keyConfig.leftkeyCallback && typeof keyConfig.leftkeyCallback == 'function') {
                    keyConfig.leftkeyCallback.call();
                }
                leftkeyFun();
                break;
            case 38 :
                e.preventDefault();
                if (keyConfig.defaultScroll) {
                    _this.scrollEvent((0 - keyConfig.scrollPerHeight));
                } else {
                    upkeyFun();
                }

                if (keyConfig.upkeyCallback && typeof keyConfig.upkeyCallback == 'function') {
                    keyConfig.upkeyCallback.call();
                }
                break;
            case 39 :
                if (keyConfig.rightkeyCallback && typeof keyConfig.rightkeyCallback == 'function') {
                    keyConfig.rightkeyCallback.call();
                }
                rightkeyFun();
                break;
            case 40 :
                e.preventDefault();
                if (keyConfig.defaultScroll) {
                    _this.scrollEvent(keyConfig.scrollPerHeight);
                } else {
                    downkeyFun();
                }

                if (keyConfig.downkeyCallback && typeof keyConfig.downkeyCallback == 'function') {
                    keyConfig.downkeyCallback.call();
                }
                break;
            case 13 :
                e.preventDefault();
                if (keyConfig.enterkeyCallback && typeof keyConfig.enterkeyCallback == 'function') {
                    keyConfig.enterkeyCallback.call();
                }
                enterkeyFun();
                break;
            case 27 :
                // callAppFunction('setJSCallback', {'back_press_event' : 'escPressFunc'});
                break;
            default:
                break;
        }
    }

    function leftkeyFun () {
        if (keyConfig.eventArray && keyConfig.eventArray.length > 0) {
            if (keyConfig.currentCnt.x == 0 && keyConfig.currentCnt.y == 0) {
                return false;
            } else {
                if (keyConfig.currentCnt.y == 0) {
                    keyConfig.currentCnt.x -= 1;
                    keyConfig.currentCnt.y = keyConfig.eventArray[keyConfig.currentCnt.x].length - 1;
                } else {
                    keyConfig.currentCnt.y -= 1;
                }
            }
            $('.' + keyConfig.focusClass).removeClass(keyConfig.focusClass);
            $(keyConfig.eventArray[keyConfig.currentCnt.x][keyConfig.currentCnt.y]).addClass(keyConfig.focusClass);
        }
    }
    
    function rightkeyFun () {
        if (keyConfig.eventArray && keyConfig.eventArray.length > 0) {
            var xLen = keyConfig.eventArray.length, yLen = keyConfig.eventArray[keyConfig.currentCnt.x].length;
            if (keyConfig.currentCnt.x == xLen - 1 && keyConfig.currentCnt.y == yLen - 1) {
                return false;
            } else {
                if (keyConfig.currentCnt.y == yLen - 1) {
                    keyConfig.currentCnt.x += 1;
                    keyConfig.currentCnt.y = 0;
                } else {
                    keyConfig.currentCnt.y += 1;
                }
            }
            $('.' + keyConfig.focusClass).removeClass(keyConfig.focusClass);
            $(keyConfig.eventArray[keyConfig.currentCnt.x][keyConfig.currentCnt.y]).addClass(keyConfig.focusClass);
        }
    }

    function upkeyFun () {
        if (keyConfig.eventArray && keyConfig.eventArray.length > 0) {
            if (keyConfig.rowCnt[keyConfig.currentCnt.x] == 0) {  // 当前数组块的行数为1
                if (keyConfig.currentCnt.y > 0) { // 非当前数组的第一个元素
                    keyConfig.currentCnt.y = 0;
                } else { // 当前数组第一个元素
                    if (keyConfig.currentCnt.x > 0) { // 非第一个数组  跳转到上一数组的最后一个元素
                        keyConfig.currentCnt.x -= 1;
                        keyConfig.currentCnt.y = keyConfig.eventArray[keyConfig.currentCnt.x].length - 1;
                    }
                }
            } else { // 当前数组块的行数大于1
                if (keyConfig.currentCnt.y < keyConfig.rowCnt[keyConfig.currentCnt.x]) { // 当前所在列小于数组块的换行列数
                    if (keyConfig.currentCnt.y > 0) { // 非当前数组的第一个元素
                        keyConfig.currentCnt.y = 0;
                    } else { // 当前数组第一个元素
                        if (keyConfig.currentCnt.x > 0) { // 非第一个数组  跳转到上一数组的最后一个元素
                            keyConfig.currentCnt.x -= 1;
                            keyConfig.currentCnt.y = keyConfig.eventArray[keyConfig.currentCnt.x].length - 1;
                        }
                    }
                } else {
                    keyConfig.currentCnt.y -= keyConfig.rowCnt[keyConfig.currentCnt.x];
                }
            }
            $('.' + keyConfig.focusClass).removeClass(keyConfig.focusClass);
            $(keyConfig.eventArray[keyConfig.currentCnt.x][keyConfig.currentCnt.y]).addClass(keyConfig.focusClass);
            _this.scrollEvent();
        }
    }

    function downkeyFun () {
        if (keyConfig.eventArray && keyConfig.eventArray.length > 0) {
            var xLen = keyConfig.eventArray.length, yLen = keyConfig.eventArray[keyConfig.currentCnt.x].length;
            if (keyConfig.rowCnt[keyConfig.currentCnt.x] == 0) {  // 当前数组块的行数为1
                if (keyConfig.currentCnt.y < yLen - 1) { // 非当前数组的最后一个元素
                    keyConfig.currentCnt.y = yLen - 1;
                } else { // 当前数组最后一个元素
                    if (keyConfig.currentCnt.x < xLen - 1) { // 非最后一个数组  跳转到下一数组的第一个元素
                        keyConfig.currentCnt.x += 1;
                        keyConfig.currentCnt.y = 0;
                    }
                }
            } else { // 当前数组块的行数大于1
                if (keyConfig.currentCnt.y > yLen - keyConfig.rowCnt[keyConfig.currentCnt.x] - 1) { // 当前所在列为数组最后一行
                    if (keyConfig.currentCnt.y < yLen - 1) { // 非当前数组的最后一个元素
                        keyConfig.currentCnt.y = yLen - 1;
                    } else { // 当前数组最后一个元素
                        if (keyConfig.currentCnt.x < xLen - 1) { // 非最后一个数组  跳转到下一数组的第一个元素
                            keyConfig.currentCnt.x += 1;
                            keyConfig.currentCnt.y = 0;
                        }
                    }
                } else {
                    keyConfig.currentCnt.y += keyConfig.rowCnt[keyConfig.currentCnt.x];
                }
            }
            $('.' + keyConfig.focusClass).removeClass(keyConfig.focusClass);
            $(keyConfig.eventArray[keyConfig.currentCnt.x][keyConfig.currentCnt.y]).addClass(keyConfig.focusClass);
            _this.scrollEvent();
        }
    }

    function enterkeyFun () {
        var $focusblock = $('.' + keyConfig.focusClass);
        var a = $focusblock.data('a') || $focusblock.find('a').attr('href');
        var blockHttp = $focusblock.data('http');
        if (a) {
            window.location.href = CONFIG.rootUrl + a;
        } else if(blockHttp) {
            window.location.href = blockHttp;
        } else {
            $focusblock.click();
        }
    }
}

KeyPressEvent.prototype.scrollEvent = function(height) {
    var keyConfig = this.keyConfig;
    var scrollVal = 0;
    if (height) {
        scrollVal = document.body.scrollTop + height;
    } else {
        var foucsElement = $('.' + keyConfig.focusClass)[0];
        scrollVal = foucsElement.offsetTop;
        while (foucsElement = foucsElement.offsetParent) {
            scrollVal += foucsElement.offsetTop;
        }
        scrollVal -= 300;
    }
    $('body').scrollTo({toT: scrollVal});
}

KeyPressEvent.prototype.destroy = function() {
    this.keyConfig = {};
    return this;
}

$.fn.scrollTo =function(options){
    var defaults = {
        toT : 0,    //滚动目标位置
        durTime : 500,  //过渡动画时间
        delay : 30,     //定时器时间
        callback:null   //回调函数
    };
    var opts = $.extend(defaults,options),
        timer = null,
        _this = this,
        curTop = _this.scrollTop(),//滚动条当前的位置
        subTop = opts.toT - curTop,    //滚动条目标位置和当前位置的差值
        index = 0,
        dur = Math.round(opts.durTime / opts.delay),
        smoothScroll = function(t){
            index++;
            var per = Math.round(subTop/dur);
            if(index >= dur){
                _this.scrollTop(t);
                window.clearInterval(timer);
                if(opts.callback && typeof opts.callback == 'function'){
                    opts.callback();
                }
                return;
            }else{
                _this.scrollTop(curTop + index*per);
            }
        };
    timer = window.setInterval(function(){
        smoothScroll(opts.toT);
    }, opts.delay);
    return _this;
};

// 判断是否到底部
function isFooter () {
　　var scrollTop = $(this).scrollTop();
　　var scrollHeight = $(document).height();
　　var windowHeight = $(this).height();
　　if(scrollTop + windowHeight == scrollHeight){
        return true;
　　}
}

function callAppFunction(func, args, callback) {
    //alert(func + ', 1');
    var argsString = JSON.stringify(args);
    var result = eval("comicool." + func + "('" + argsString + "');");
    
    if (callback) {
        callback(result);
    }

    return true;
}

function escPressEvent (obj) {
    if (obj && obj.length > 0) {
        window.escPressFunc = function() {
            window.location.href = obj;
        }
        callAppFunction('setJSCallback', {'back_press_event' : 'escPressFunc'});
    } else {
        callAppFunction('setJSCallback', {'back_press_event' : ''});
    }
}

//生成header
function generatHeader(currStr){
    var version = getQueryString('ch') || getCookie('ch');
    var html = ''; 
    var currIndex = 0;

    if (version == 'tv_pp_pre' || version == 'tv_letv') {
        html += '<span class="header-item" data-http="http://www.comicool.cn/tv/comi-category.html">漫画分类</span>'
             +'  <span class="header-item" data-http="http://www.comicool.cn/tv/comi-rank.html">漫画排行</span>'
             +'  <span class="header-item" data-http="http://www.comicool.cn/tv/about.html">关于</span>';
        if (currStr == 'category') {
            currIndex = 0;
        } else if (currStr == 'rank') {
            currIndex = 1;
        } else if (currStr == 'about') {
            currIndex = 2;
        }
    } else {
        html +='<span class="header-item" data-http="http://www.comicool.cn/tv/comi-video/list.html">视频专区</span>'
             +' <span class="header-item" data-http="http://www.comicool.cn/tv/comi-category.html">漫画分类</span>'
             +' <span class="header-item" data-http="http://www.comicool.cn/tv/comi-rank.html">漫画排行</span>'
             +' <span class="header-item" data-http="http://www.comicool.cn/tv/about.html">关于</span>';
        if (currStr == 'video'){
            currIndex = 0;
        }else if (currStr == 'category') {
            currIndex = 1;
        } else if (currStr == 'rank') {
            currIndex = 2;
        } else if (currStr == 'about') {
            currIndex = 3;
        }
    }
    var $html = $('<div>' + html + '</div>');
    $html.find('.header-item').eq(currIndex).addClass('curr');
    $('.header-list').html($html[0].innerHTML);
}
