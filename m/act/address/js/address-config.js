"use strict";
var ajaxBase = 'http://shop.ismanhua.com:8000/'; //'http://shop.comicool.cn/';

//获取页面URL参数名
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURI(r[2]);
	return null;
}

/*  
 * @弹出提示层 ( 加载动画(load), 提示动画(tip), 成功(success), 错误(error), )  
 * @method  tipBox  
 * @description 默认配置参数   
 * @time    2014-12-19   
 * @param {Number} width -宽度  
 * @param {Number} height -高度         
 * @param {String} str -默认文字  
 * @param {Object} windowDom -载入窗口 默认当前窗口  
 * @param {Number} setTime -定时消失(毫秒) 默认为0 不消失  
 * @param {Boolean} hasMask -是否显示遮罩  
 * @param {Boolean} hasMaskWhite -显示白色遮罩   
 * @param {Boolean} clickDomCancel -点击空白取消  
 * @param {Function} callBack -回调函数 (只在开启定时消失时才生效)  
 * @param {String} type -动画类型 (加载,成功,失败,提示)  
 * @example   
 * new TipBox();   
 * new TipBox({type:'load',setTime:1000,callBack:function(){ alert(..) }});   
*/
function TipBox(cfg){
    this.config = {
        width          : 180,
        height         : 150,
        title          : '',
        str            : '正在处理',
        btnText        : ['确定'],
        btnCallback    : function() {},
        windowDom      : window,
        setTime        : 0,
        hasMask        : true,
        hasMaskWhite   : false,
        clickDomCancel : false,
        callBack       : null,
        type           : 'confirmBox'
    };
    $.extend(this.config,cfg);
    if(TipBox.prototype.boundingBox) {
        if(this.config.type == 'toastBox') {
            clearInterval(this.toastTimeOut);
            this.destroy();
        } else {
            return; //存在就retrun
        }
    }

    //初始化
    this.render(this.config.type);
    return this;
}

//外层box
TipBox.prototype.boundingBox = null;

//渲染
TipBox.prototype.render = function(tipType,container){
    this.renderUI(tipType);

    if(this.config.type != 'toastBox') {
        //绑定事件
        this.bindUI();
    }
    $(container || this.config.windowDom.document.body).append(TipBox.prototype.boundingBox);
};

//渲染UI
TipBox.prototype.renderUI = function(tipType){
    if(tipType == 'toastBox') {
        TipBox.prototype.boundingBox = $("<div id='toast'></div>");
    } else {
        TipBox.prototype.boundingBox = $("<div id='TipBox'></div>");
    }
    tipType == 'confirmBox'    && this.confirmRenderUI();
    tipType == 'toastBox'     && this.toastRenderUI();
    TipBox.prototype.boundingBox.appendTo(this.config.windowDom.document.body);
    var _this = this;

    //是否显示遮罩(非吐司模式)
    if(tipType != 'toastBox') {
        if(this.config.hasMask){
            this.config.hasMaskWhite ? this._mask = $("<div class='mask_white'></div>") : this._mask = $("<div class='mask'></div>");
            this._mask.appendTo(this.config.windowDom.document.body);
        }
        //btn元素
        if(this.config.btnText && this.config.btnCallback) {
            this.btn = TipBox.prototype.boundingBox.find('.btn-text');
        }
        //定时消失
        !this.config.setTime && typeof this.config.callBack === "function" && (this.config.setTime = 1);
        this.config.setTime && setTimeout( function(){ _this.close(); }, _this.config.setTime );
    } else {
        !this.config.setTime && (this.config.setTime = 1000); // 吐司模式未设置时间的话默认为1s
        this.config.setTime && setTimeout( function(){ _this.close(); }, _this.config.setTime );
    }
};

TipBox.prototype.bindUI = function(){
    var _this = this;

    //点击空白立即取消
    this.config.clickDomCancel && this._mask && this._mask.click(function(){_this.close();});

    //btn事件绑定
    if(this.config.btnText && this.config.btnText.length > 0) {
        for (var i=0,len=this.config.btnText.length; i<len; i++) {
            this.btn[i].addEventListener('click', function() {
                if(_this.config.btnCallback) {
                    _this.config.btnCallback.call(this);
                }
                _this.close();
            });
        }
    }
};

//提示效果UI
TipBox.prototype.confirmRenderUI = function(){
    var tip = "<div class='tip'>";
    if(this.config.title) {
        tip +="     <div class='tip-title'>"+this.config.title+"</div>";
    }
    tip +="     <div class='dec_txt'>"+this.config.str+"</div>";
    tip += "<div class='tip-btns'>";
    for (var i=0, len=this.config.btnText.length; i<len; i++) {
        tip +="<div class='btn-text'>"+this.config.btnText[i]+"</div>";
    }
    tip += "</div></div>";
    TipBox.prototype.boundingBox.append(tip);
};

//吐司效果UI
TipBox.prototype.toastRenderUI = function(){
    TipBox.prototype.boundingBox.html(this.config.str);
};

//关闭
TipBox.prototype.close = function(){
    TipBox.prototype.destroy();
    this.destroy();
    this.config.setTime && typeof this.config.callBack === "function" && this.config.callBack();
};

//销毁  
TipBox.prototype.destroy = function(){
    this._mask && this._mask.remove();
    TipBox.prototype.boundingBox && TipBox.prototype.boundingBox.remove();
    TipBox.prototype.boundingBox = null;
};  
