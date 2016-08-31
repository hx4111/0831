//点击响应时间加快,注意：页面模拟时点不了，手机里可以
FastClick.attach(document.body);
var retry = true;

function callAppFunction(func, args, callback) {
	//alert(func + ', 1');
	var argsString = JSON.stringify(args);
	var ua = navigator.userAgent.toLowerCase(),
    	isIOSApp = (/icomico_ios/i.test(ua)) ? true : false ,
    	isAndroidApp = (/icomico_adr/i.test(ua)) ? true : false ;
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
	/*var MOBComico = {},
		ua = navigator.userAgent.toLowerCase();
    //设置的app苹果安卓ua信息
    MOBComico.app = (/icomico/i.test(ua)) ? true : false ;*/

	//设置所需的接口数据对象，并转化JSON字符串，以使用app里的接口
	var setJSCallbackObj = {
			'account_event': 'initShowData'
		};
		//setJSCallbackStr = JSON.stringify(setJSCallbackObj);
/*
	//执行调用接口，返回接口数据
    if( MOBComico.app ){
    	var ret = comicool.setJSCallback(setJSCallbackStr);
        currLoginHandle();
    } */
    //alert('333');

	if (callAppFunction("setJSCallback", setJSCallbackObj)) {
		//alert("qqq");
	    currLoginHandle();
	}
}	//onload函数执行接收

//获取当前登录帐号信息及处理
function currLoginHandle(){
	//var appDataStr = comicool.getAccountInfo('{}');
    callAppFunction("getAccountInfo", "{}", function (result) {
    	/*var result = "{'ccid':'35345', 'typew':343}";*/
    	var appDataStr = JSON.stringify(result);	//安卓为字符串，苹果是对象
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
		appDataObj = JSON.parse(appDataStr);
		if (appDataObj && appDataObj.hasOwnProperty('ccid') && appDataObj.hasOwnProperty('usertype') && appDataObj.hasOwnProperty('cctoken')) {
			appCcid = appDataObj.ccid;
			appUsertype = appDataObj.usertype;
			appCctoken = appDataObj.cctoken;
		}
	}
	//如果对象有数据，不为空的时候，请求ajax，如果对象木有数据，内容为空，打开登录框
	if (appCcid) {
		//var appDeviceID = comicool.getDeviceID('{}');
	    callAppFunction("getDeviceID", "{}", function (result) {
	    	var appDeviceID = result;	//安卓，苹果都是字符串
			var requestUrl = 'http://proxy.icomico.com/activityindex';   //http://121.201.7.97  
			//var requestUrl = 'http://121.201.7.97/activityindex';
		    var aj = $.ajax({    
		        url : requestUrl,// 跳转到 action
		        data : {
		            'ccid' : appCcid,
		            'usertype' : appUsertype,
		            'cctoken' : appCctoken,
		            'deviceid' : appDeviceID,
		            'activityid' : 11,
		            'form' : 'index',
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
		        	$('.startbox a').text('开始射箭');

					//头部状态条--立即领取显示隐藏,有奖品且未领奖则显示，并传参数到FORM页面
					//topBarHandle(response.rewardinfo);
					var giftid = response.rewardinfo.id,
						giftName = response.rewardinfo.name;

					if (response.rewardinfo && giftid >= 0 && giftName.length > 0 && giftid <= 8) {
						$('.tip').show();
						$('.tip span').html('恭喜您，已射中气球，获得奖品。');
						var formUrl = encodeURI('form2.html?ccid=' + appCcid +'&usertype=' + appUsertype + '&cctoken=' + appCctoken + '&t='+(new Date()).valueOf());
						$('.tip a').attr('href',formUrl);
						/*var randNumber = Math.floor(Math.random() * 1000);
						var encodedGiftid = giftid + 1234 + randNumber;
						var encodedGiftName = giftName + '_' + (randNumber + 5678).toString() + '_' + (randNumber + 1111).toString();
						var formUrl = encodeURI('form.html?ccid=' + appCcid + '&giftid=' + encodedGiftid + '&giftName='+ encodedGiftName);*/
					}else{
						$('.tip').hide();
						$('.tip span').html('');
					}

					//底部列表数据
					bottomListHandle(response.event_list);
					//alert(response.rewardinfo);

					//射箭机会显示
					arrowNumHandle(response.remainchance);
					startShootTabFn(response.remainchance,appCcid,appUsertype,appCctoken);

					if (response.remainchance >= 3) {
						$('.h-nav-list li').eq(2).click();
					} else if (response.remainchance == 2) {
						$('.h-nav-list li').eq(1).click();
					} else {
						$('.h-nav-list li').eq(0).click();
					}
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
		    });	    	
	    });
	}else{
		//这里代表用户木有登录，则不对选项卡进行操作，按钮亮起，点击后弹出登录框，登录框按了确定后
		$('.startbox a').text('立即登录').on('click',function(){
			//comicool.openLoginPage('{}');
			callAppFunction("openLoginPage", "{}");
		});

		//点击选项卡
		$('.h-nav-list li').on('click',function(){
			var _index = $(this).index(),	/*当前索引*/
				$this = $(this);
			$this.addClass('curr').siblings('li').removeClass('curr');
			$(".h-tabcon p").eq(_index).show().siblings('p').hide();
		});	//点击选项卡 end

		//射箭次数区域隐藏
		arrowNumHandle();

		callAppFunction("getDeviceID", "{}", function (result) {
	    	var appDeviceID = JSON.stringify(result);	//安卓为字符串，苹果是对象
	    	var requestUrl = 'http://proxy.icomico.com/activityindex';   //http://121.201.7.97/
	    	//var requestUrl = 'http://121.201.7.97/activityindex';
		    var aj = $.ajax({    
		        url : requestUrl,// 跳转到 action
		        data : {
		            'ccid' : '',
		            'usertype' : '',
		            'cctoken' : '',
		            'deviceid' : appDeviceID,
		            'activityid' : 11,
		            'from' : 'index',
	                't' : (new Date()).valueOf()
		        },    
		        type : 'get',
		        timeout : '10000',  
		        cache : false,    
		        dataType : "jsonp",
		        jsonp: "callback",      //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
		        jsonpCallback:"jsonp_activityindex",      //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
		        success : function(response , status , xhr) {
					//底部列表数据未登陆时展示出来
					//alert(response.event_list);
					if(response.ret == -1){
						bottomListHandle(response.event_list);
					}
		        },
		        complete: function(XMLHttpRequest, textStatus){
	            },
		        error : function(XMLHttpRequest, textStatus, errorThrown){
		        	$('.reward-list').html('').append('<li>奖品暂时还木有小伙伴拿到哟~</li>');
		        }
		    });
	    });
	}
}//initShowData   初始化接收返回数据 结束


//选择箭的个数及按钮
function startShootTabFn(data,ccid,usertype,cctoken){
	//设置模拟数据
	var totalNum = data	//总共射箭机会的次数

	//初始化箭的个数
	var $startBtn = $('.startbox a');
	$startBtn.off('click');

	//点击前按钮状态
	if( totalNum >= 0 ){
		$startBtn.removeClass('curr').attr('href','process.html?ccid=' + ccid +'&usertype=' + usertype + '&cctoken=' + cctoken + '&useNum=1');	//按钮亮起时设置属性值
		if(totalNum == 0){
			$startBtn.addClass('curr').attr('href','javascript:;');
		}
	}else{
		$startBtn.addClass('curr').attr('href','javascript:;');	//按钮为灰时--默认
	}

	//点击选项卡及相应变化（按钮状态、箭的个数）
	$('.h-nav-list li').on('click',function(){
		var _index = $(this).index(),	/*当前索引*/
			$this = $(this);
		$this.addClass('curr').siblings('li').removeClass('curr');
		$(".h-tabcon p").eq(_index).show().siblings('p').hide();
		_index=_index+1;	/*当前索引+1,因为js以0开始代表第一个，数值少1，所以需加上1以对应个数*/

		//点击后按钮状态
		_diffVal = totalNum - _index;	/*数值比较差值*/
		if( _diffVal >= 0 ){
			$startBtn.removeClass('curr').attr('href','process.html?ccid=' + ccid +'&usertype=' + usertype + '&cctoken=' + cctoken + '&useNum=' + _index);	//按钮亮起时设置属性值
		}else{
			$startBtn.addClass('curr').attr('href','javascript:;');	//按钮为灰时--默认
		}

		//alert($startBtn.attr('href'));

		//设置cookie
		document.cookie = 'shoot_allowed=true'; 
		//alert(window.location.href);

	});	//点击选项卡 end
}
//startShootTabFn(1);

function loadingShow(){
	$('.loading').show();
}
function loadingHide(){
	$('.loading').hide();
}
function errorShow(txt){
	$('.errorbox').show();
	$('.error-con p').html('啊！~~加载中出现错误啦！'+txt);

	$('.error-btn a').attr('href',window.location.href);
}

function bottomListHandle(data){
	//底部列表数据
	var searchFH = data.indexOf(';'),
		searchADD = data.indexOf('&');
	if( searchFH >= 0 ){
		//存在;和&
		var list = (data + '').split(';'),
			temp = [], item = [];
		for (var i = 0,len=list.length;i<len; i++) {
			item = (list[i] + '').split('&');
			if(item.length===3) {
				temp.push('<li><em>' + item[2] + '</em><i>' + item[0] +'</i><span>' + item[1] + '</span></li>')
			};
		};
		//console.log(temp);
		var tempStr = temp.join('');
		$('.reward-list').html('').append(tempStr);

		$(".reward-list li").each(function(){
			//变星号
			var $name = $(this).find('i');
				nameStr = $name.text(),
				nameLen = nameStr.length;

			if(nameLen >= 1 && nameLen <= 3){
				startStr = nameStr.charAt(0);
				lastStr = startStr + '**';
				$name.text(lastStr);
			}else if(nameLen > 3){
				startStr = nameStr.charAt(0);
				lastStr = nameStr.charAt(nameLen - 1);
				$name.text(startStr + '**' + lastStr);
			}
	    });
	}else{
		if(searchADD >= 0){
			//只要一条数据，有&无;
			var list = (data + '').split('&');
			$('.reward-list').html('').append('<li><em>'+list[2]+'</em><i>'+list[1]+'</i><span>'+list[0]+'</span></li>');

			//变星号
			var $name = $('.reward-list li').find('i');
				nameStr = $name.text(),
				nameLen = nameStr.length;

			if(nameLen >= 1 && nameLen <= 3){
				startStr = nameStr.charAt(0);
				lastStr = startStr + '**';
				$name.text(lastStr);
			}else if(nameLen > 3){
				startStr = nameStr.charAt(0);
				lastStr = nameStr.charAt(nameLen - 1);
				$name.text(startStr + '**' + lastStr);
			}

			//手机星号处理
			/*$(".reward-list li").each(function(){
			    var phone = $(this).find('i').text();
				var mphone = phone.substr(3,5);
				var lphone = phone.replace(mphone,"*****");
				$(this).find('i').text(lphone);
		    });*/

		}else{
			//木有数据
			$('.reward-list').html('').append('<li>奖品暂时还木有小伙伴拿到哟，亲们赶紧加油吧~((^.^))~</li>');
		}
	}
}

function arrowNumHandle(data){
	//射箭机会及显示隐藏
	if(data >=0){
		$('.startbox span').show().html('(<b>'+ data +'</b>支)');
	}else{
		$('.startbox span').hide().html('');
	}
}
