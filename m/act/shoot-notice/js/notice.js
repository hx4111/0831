
var retry = true;

window.onload = function(){
	var MOBComico = {},
		ua = navigator.userAgent.toLowerCase();
    //设置的app苹果安卓ua信息
    MOBComico.app = (/icomico/i.test(ua)) ? true : false ;

	//设置所需的接口数据对象，并转化JSON字符串，以使用app里的接口
	var setJSCallbackObj = {
		'account_event': 'initShowData'
	},
		setJSCallbackStr = JSON.stringify(setJSCallbackObj);

	//执行调用接口，返回接口数据
    if( MOBComico.app ){
    	var ret = comicool.setJSCallback(setJSCallbackStr);
        currLoginHandle();
    } 
}	//onload函数执行接收

//初始化调用接口数据--setJSCallback
function initShowData(appDataStr){
	var appCcid = null,
		appUsertype = null,
		appCctoken = null;
	if (appDataStr) {
		//alert(appDataStr);
		appDataObj = JSON.parse(appDataStr);
		if (appDataObj && appDataObj.hasOwnProperty('ccid') && appDataObj.hasOwnProperty('usertype') && appDataObj.hasOwnProperty('cctoken')) {
			appCcid = appDataObj.ccid;
			appUsertype = appDataObj.usertype;
			appCctoken = appDataObj.cctoken;
		}
	}
	//如果对象有数据，不为空的时候，请求ajax，如果对象木有数据，内容为空，打开登录框
	if (appCcid) {
		//alert(appCcid);
		var appDeviceID = comicool.getDeviceID('{}');
		//alert(appDeviceID);
		var requestUrl = 'http://proxy.icomico.com/activityindex';   //http://121.201.7.97/
	    var aj = $.ajax({    
	        url : requestUrl,// 跳转到 action
	        data : {
	            'ccid' : appCcid,
	            'usertype' : appUsertype,
	            'cctoken' : appCctoken,
	            'deviceid' : appDeviceID,
	            'activityid' : 10,
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
				//头部状态条--立即领取显示隐藏,有奖品且未领奖则显示，并传参数到FORM页面
				//topBarHandle(response.rewardinfo);
				var giftid = response.rewardinfo.id,
					giftName = response.rewardinfo.name;

				if (response.rewardinfo && giftid >= 0 && giftName.length > 0 && giftid <= 9) {
					$('.tip').show();
					$('.tip span').html('恭喜您，已射中气球，获得奖品。');
					$('.tip a').html('&gt;&gt;立即查看');
					var formUrl = encodeURI('form2.html?display=1&ccid=' + appCcid +'&usertype=' + appUsertype + '&cctoken=' + appCctoken + '&t='+(new Date()).valueOf());
					$('.tip a').attr('href',formUrl);
				}else{
					$('.tip span').html('不好意思，您未获奖。关注可米酷，更多活动即将推出。');
					$('.tip a').html('');
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
	}else{
		//这里代表用户木有登录，则不对选项卡进行操作，按钮亮起，点击后弹出登录框，登录框按了确定后
		$('.tip').show();
		$('.tip span').html('登录App，查看您的中奖记录。');
		$('.tip a').html('&gt;&gt;立即登录').on('click',function(){
			comicool.openLoginPage('{}');
		});
	}
}//initShowData   初始化接收返回数据 结束

//获取当前登录帐号信息及处理
function currLoginHandle(){
	var appDataStr = comicool.getAccountInfo('{}');
	initShowData(appDataStr);
}//currLoginHandle   获取当前登录帐号信息及处理 结束


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
