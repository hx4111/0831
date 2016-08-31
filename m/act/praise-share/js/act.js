//点击响应时间加快,注意：页面模拟时点不了，手机里可以
FastClick.attach(document.body);
var retry = true;

var ua=navigator.userAgent.toLowerCase(),
	isMobile = ua.indexOf('mobile')>0,
	isWeixin = (/micromessenger/.test(ua)) ? true : false,
	isQQ = (/qq\//.test(ua)) ? true : false,
	isIOS = ua.indexOf('(ip')>0 && isMobile,
	isWeibo = (/Weibo/i.test(ua)) ? true : false ,
	isApp = (/icomico/i.test(ua)) ? true : false ,
	isIOSApp = (/icomico_ios./i.test(ua)) ? true : false ,
	isAndroidApp = (/icomico_adr./i.test(ua)) ? true : false ;

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

window.onload = function(){
	//alert('444');
	//设置所需的接口数据对象，并转化JSON字符串，以使用app里的接口
	var setJSCallbackObj = {
		'account_event': 'initShowData'
	};
    if (callAppFunction("setJSCallback", setJSCallbackObj)) {
	    currLoginHandle();
	}

	var shareJsonObj = {
        'title' : '【请猛戳】点赞分享抢影票，520约女神看电影！',
        'describe' : '枕头们and乡亲们，观众们and作者们！！！可米酷漫画老板请你们看电影了！点赞分享就能约，女神陪你看电影！',
        'imageurl' : 'http://m.comicool.cn/act/praise-share/images/share-img.jpg',
        'page_url' : 'http://m.comicool.cn/act/praise-share/index.html'
    };
    var shareJsonStr = JSON.stringify(shareJsonObj);
        
    if( isApp ){
        try {
            comicool.showShareBtn(shareJsonStr);
        } catch (e) {
            window.location.href= 'http://comicool/showShareBtn?title=' + shareJsonObj.title + '&describe=' + shareJsonObj.describe + '&imageurl=' + shareJsonObj.imageurl + '&page_url=' + shareJsonObj.page_url;
        }
    }else{
    	//微信,qq,浏览器,微博阅读页面时
    	$('.tip').html('').hide();
    	rewardlistAjax();
    	document.title = '点赞分享抢影票--可米酷漫画';

    	//点击下载或打开app
    	$('.foot-btn').show();
	    $('.btn-open').on('click',function(){
	        window.location.href = 'http://m.app.comicool.cn/smart_open/main.php';
	    });

	    /*window.onresize = function(){
			screenStatus();
		}*/
		$(window).resize(screenStatus);
		$(window).load(screenStatus);
    }

    if (isIOS) {
		$('footer h4').show();
	}
}

//获取当前登录帐号信息及处理
function currLoginHandle(){
	callAppFunction("getAccountInfo", "{}", function (result) {
    	var appDataStr = result;	//安卓为字符串，苹果是对象
    	if(isIOSApp){
    		appDataStr = JSON.stringify(result);
    	}
    	//alert(appDataStr);
    	initShowData(appDataStr);
    });
}//currLoginHandle   获取当前登录帐号信息及处理 结束

//初始化调用接口数据--setJSCallback
function initShowData(appDataStr){
	var appCcid = null,
		appUsertype = null,
		appCctoken = null;
	if (appDataStr) {
		//alert(appDataStr);
		appDataObj = JSON.parse(appDataStr);
		if (appDataObj && appDataObj.hasOwnProperty('ccid') && appDataObj.hasOwnProperty('usertype') && appDataObj.hasOwnProperty('cctoken')) {
			appCcid = appDataObj.ccid;	//appDataObj.ccid
			appUsertype = appDataObj.usertype;
			appCctoken = appDataObj.cctoken;
		}
	}
	//如果对象有数据，不为空的时候，请求ajax，如果对象木有数据，内容为空，打开登录框
	if (appCcid) {
		//alert(appCcid);
		//var appDeviceID = comicool.getDeviceID('{}');
		callAppFunction("getDeviceID", "{}", function (result) {
			var appDeviceID = result;
			var requestUrl = 'http://proxy.icomico.com/activityindex';   //http://121.201.7.97/
		    var aj = $.ajax({    
		        url : requestUrl,// 跳转到 action
		        data : {
		            'ccid' : appCcid,
		            'usertype' : appUsertype,
		            'cctoken' : appCctoken,
		            'deviceid' : appDeviceID,
		            'activityid' : 12,
	                't' : (new Date()).valueOf()
		        },    
		        type : 'get',
		        timeout : '10000',  
		        cache : false,    
		        dataType : "jsonp",
		        jsonp: "callback",      //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
		        jsonpCallback:"jsonp_activityindex",      //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
		        beforeSend : function(XMLHttpRequest){
	                   //ShowLoading();
	                   loadingShow();
	           	},
		        success : function(response , status , xhr) {
		        	if (response.ret != 0) {
		        		// 提示错误
		        		errorShow('(' + response.msg + ')');
		        		return false;
		        	}
					//alert('success + 1');

					//var result = 1;	//是否有电影票
					var giftid = response.rewardinfo.id,
						giftName = response.rewardinfo.name;
					if (response.rewardinfo && giftid >= 0 && giftName.length >0) {
						$('.tip').show();
						$('.tip a').off('click');
						$('.tip span').html('恭喜您，获得电影票。');
						$('.tip a').html('立即查看&gt;&gt;').on('click',function(){
							$(this).parent().hide();
							$('.form-pop').addClass('play').show();
						});

						$('.form-pop a.fp-clo').on('click',function(){
							$(this).parents('.form-pop').hide();
							$('.tip').show();
						});

						document.getElementById('form-input').onsubmit = function(e){
							e.preventDefault();
							validate();
						}
						function validate(){
							var mobile = $('.input-tel').val(),
								userName = 'name',
								address = 'address',
								error = false;
							
							//!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(mobile)
							if(!/^(1[3-9])\d{9}$/i.test(mobile)){
								$('.fp-error-txt').css({visibility:'visible'});
								error = true;
							} else if(mobile == ''){
								$('.fp-error-txt').css({visibility:'visible'});
								error = true;
							} else{
								$('.fp-error-txt').css({visibility:'hidden'});
							}
							if( error ){
								//alert(error);
							}else{
								//alert('请求AJAX');
								ajaxRequest(appCcid,userName,mobile,address);
							}
						}

					}else if(response.rewardinfo && giftid < 0 && giftName.length > 0){
						$('.tip').html('').hide();
					}else if(response.rewardinfo && giftid < 0 && giftName.length == 0){
						//木有电影票的时候
						$('.tip span').html('不好意思，您未获得电影票。关注可米酷，更多活动即将推出。');
						$('.tip a').remove();
					}

					//底部列表数据
					bottomListHandle(response.event_list);
					
		        },
		        complete: function(XMLHttpRequest, textStatus){
	                   //HideLoading();
	                   loadingHide();
	            },
		        error : function(XMLHttpRequest, textStatus, errorThrown){
		        	if (XMLHttpRequest.status > 400){
		        		if( retry == true ){
		        			currLoginHandle();
		        			retry = false;
		        		}else{
		        			errorShow('(' + XMLHttpRequest.status + ',' + XMLHttpRequest.readyState + ')');
		        		}
		        		return false;
		        	}
		        	errorShow('(' + XMLHttpRequest.status + ',' + XMLHttpRequest.readyState + ')');
		        }
		    });//AJAX结束
		});
	}else{
		//这里代表用户木有登录，则不对选项卡进行操作，按钮亮起，点击后弹出登录框，登录框按了确定后
		//alert('no id');
		$('.tip').show();
		$('.tip a').off('click');
		$('.tip span').html('登录App，查看您的中奖记录。');
		$('.tip a').html('立即登录&gt;&gt;').on('click',function(){
			//comicool.openLoginPage('{}');
			callAppFunction("openLoginPage", "{}");
		});

		//var appDeviceID = comicool.getDeviceID('{}');
		rewardlistAjax();
	}
}//initShowData   初始化接收返回数据 结束

function bottomListHandle(data){
	var html = '';

	if(!data) {
		html = '<li>电影票暂时还木有小伙伴拿到哟，亲们赶紧加油吧~((^.^))~</li>';
	} else {
		var dataArr = data.split(';');
		var dataObj = {};

		for(var i = 0, len = dataArr.length; i < len; i++) {
			dataArr[i] = dataArr[i].split('&');
			if(!dataObj[dataArr[i][1]]) {
				dataObj[dataArr[i][1]] = [];
			}
			dataObj[dataArr[i][1]].push(dataArr[i][0]);
		}
		
		for(var j in dataObj) {
			html += '<li class="curr">'
				 + '<h3>' + j + '</h3>'
				 + '<p>';
			for(var n = 0, len = dataObj[j].length; n < len; n++) {
				html += ''
					 + '<span>' + dataObj[j][n] + '</span>';
			}

			html += ''
				 + '</p>'
				 + '</li>';
		}
	}

	$(".award-list").html(html)
}


function rewardlistAjax(){
	var requestUrl = 'http://proxy.icomico.com/activityindex';   //http://121.201.7.97/
    var aj = $.ajax({    
        url : requestUrl,// 跳转到 action
        data : {
            'ccid' : '',
            'usertype' : '',
            'cctoken' : '',
            'deviceid' : '',
            'activityid' : 12,
            't' : (new Date()).valueOf()
        },    
        type : 'get',
        timeout : '10000',  
        cache : false,    
        dataType : "jsonp",
        jsonp: "callback",      //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        jsonpCallback:"jsonp_activityindex",      //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
        beforeSend : function(XMLHttpRequest){
               //ShowLoading();
               loadingShow();
       	},
        success : function(response , status , xhr) {
			//底部列表数据未登陆时展示出来
			//alert(response.event_list);
			if(response.ret == -1){
				//alert(response.event_list);
				bottomListHandle(response.event_list);
			}
        },
        complete: function(XMLHttpRequest, textStatus){
        		loadingHide();
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){
        	$('.award-list').html('').append('<li>电影票暂时还木有小伙伴拿到哟，亲们赶紧加油吧~((^.^))~</li>');
        	//alert('error');
        }
    });
}

//表单请求
function ajaxRequest(appCcid,userName,mobile,address){
	var formConHeight = $('.fp-normal .fp-c').height();
	var formConTopHeight = $('.fp-normal .fp-c-t').height();

	var url = encodeURI('http://proxy.icomico.com/activitycommit?ccid=' + appCcid + '&activityid=12&name='+userName+'&phone='+mobile+'&address='+address+'&from=form'+'&t='+(new Date()).valueOf());
	var aj = $.ajax({    
        url : url,// 跳转到 action
        type : 'get',
        timeout : '10000',  
        cache : false,    
        dataType : "jsonp",
        jsonp: "callback",      //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        jsonpCallback:"jsonp_activitycommit",      //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
        beforeSend : function(XMLHttpRequest){
           //ShowLoading();
           loadingShow();
       	},
        success : function(response , status , xhr) {
        	if (response.ret != 0) {
        		// 提示错误
        		errorShow('(' + response.ret + ',' + status + ')');
        		return false;
        	}
        	//alert('success + formAjax');

			$('.fp-succ').show();
			$('.fp-succ .fp-c').height( formConHeight + 'px' );
			$('.fp-normal').hide();
        },
        complete: function(XMLHttpRequest, textStatus){
           //HideLoading();
           loadingHide();
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){
        	/*$('.fp-error').show();
			$('.fp-error .fp-c-t').height( formConTopHeight + 'px' );
			$('.fp-normal').hide();*/
        	errorShow('(' + XMLHttpRequest.status + ',' + XMLHttpRequest.readyState + ')');
        }    
    });
}

$('.input-tel').bind('input propertychange', function() {
    //$('.form-name p').html($(this).val().length + ' characters');
    var mobile = $('.input-tel').val();
    if(!/^(1[3-9])\d{9}$/i.test(mobile)){
		$('.fp-error-txt').css({visibility:'visible'});
	} else if(mobile == ''){
		$('.fp-error-txt').css({visibility:'visible'});
	} else{
		$('.fp-error-txt').css({visibility:'hidden'});
	}
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
// 横竖屏状态
function screenStatus(){
	var _winWidth = $(window).width(),
		_winHeight = $(window).height();
	if ( _winWidth > _winHeight) {
		//console.log('横屏');
		$('.screen-pop').show();
	} else {
		//console.log('竖屏');
		$('.screen-pop').hide();
	}
}
