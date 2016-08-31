//点击响应时间加快,注意：页面模拟时点不了，手机里可以
FastClick.attach(document.body);

$(function(){
	function getCookie(name){ 
		var strCookie=document.cookie; 
		var arrCookie=strCookie.split("; "); 
		for(var i=0;i<arrCookie.length;i++){ 
			var arr=arrCookie[i].split("="); 
			if(arr[0]==name) {
				return arr[1]; 
			}
		} 
		return ""; 
	} 

	//删除cookie
	function deleteCookie(name){ 
		var date=new Date(); 
		date.setTime(date.getTime()-10000); 
		document.cookie=name+"=v; expires="+date.toGMTString(); 
	} 

	if (getCookie('shoot_allowed') != 'true') {
		errorShow('操作有误，请返回首页>(^ ^)<');
		throw('操作有误，请返回首页>(^ ^)<');
	}

	$('.pro-topbar a').attr('href','index.html?refresh=' + (new Date()).valueOf());

	//获取页面URL参数名
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    };

    //读取首页链接传过来的值
    var appCcid = getQueryString('ccid'),
		appUsertype = getQueryString('usertype'),
		appCctoken = getQueryString('cctoken'),
		appDeviceID = comicool.getDeviceID('{}'),	//json对象字符串，怎样获取对象里面字符串内容？
		selectnum = getQueryString('useNum'),
		requestUrl = 'http://proxy.icomico.com/activityrandom';
		//useNum = getQueryString('useNum');

	var aj = $.ajax({    
        url : requestUrl,		// 跳转到 action
        data : {
            'ccid' : appCcid,
            'usertype' : appUsertype,
            'cctoken' : appCctoken,
            'deviceid' : appDeviceID,
            'activityid' : 10,
            'selectnum'	: selectnum,
            't' : (new Date()).valueOf()
        },    
        type : 'get',
        timeout : '10000',  
        cache : false,    
        dataType : "jsonp",
        jsonp: "callback",      //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        jsonpCallback:"jsonp_activityrandom",      //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
        beforeSend : function(XMLHttpRequest){
           //ShowLoading();
           loadingShow();
       	},
        success : function(response , status , xhr) {
			if (response.ret != 0) {
        		// 提示错误
        		//alert('error1');
        		errorShow('(' + response.msg + ')');
        		return false;
        	}

        	//获取数据
			var data = {
				useNum : parseInt(getQueryString('useNum')),	//使用箭的次数
				gift : [{id:0,name:'小米电视'},{id:1,name:'小米手机'},{id:2,name:'小米平板'},{id:3,name:'红米note'},{id:4,name:'小米路由'},{id:5,name:'运动相机'},{id:6,name:'小米手环'},{id:7,name:'小米电源'},{id:8,name:'小米LED灯'},{id:9,name:'10元话费'}],
				getGift : response.rewardinfo		//response.rewardinfo  {id:1,name:'小米电视'}
			}

			//删除cookie
			deleteCookie('shoot_allowed');

			//初始化底部箭背景显示及状态（次数）
			var $arrowArea = $('.arrow-area'),
				$arrowObj = $('.arrow-area span'),
				shootImgWidth = $('.shootbg-img').width(),
				shootImgHeight = $('.shootbg-img').width(),
				useNum = data.useNum;

			/*初始化箭头对象的位置--右下角 
			因事先父级元素隐藏无法获取真实图片宽高，
			故采用特殊方法，另一张同样大小的图片显示在视口区域外面*/
			$('.shoot-img').css({'margin-left': -shootImgWidth/2 + 'px','margin-top': -shootImgHeight/2 + 'px'});

			function ArrowDisplay(useNum){
				switch(useNum){
					case 1: 
					case 2: 
					case 3: 
						$arrowArea.show();
						$arrowObj.addClass('arrow' + useNum);
						break;
					default:
						$arrowArea.hide();
						$arrowObj.removeClass('arrow' + useNum);
				}
				$('.pro-tip').html('射爆<i>' + useNum + '</i>只气球赢取奖品~~');
				if(useNum == 0){
					$('.pro-tip').html('亲，射箭机会用完了哟');
				}
			}
			ArrowDisplay(useNum);

			$('.balloon-list span').on('click',function(){
				var $this = $(this),
					idx = $this.index(),
					$parent = $this.parents('li'),
					pidx = $parent.index();

				//获取旋转前点击对象和箭头对象的位置
				var balloonWidth = $('.balloon-list .libg').width(),
					balloonHeight = $('.balloon-list .libg').height(),
					balloonCenterTop = $this.offset().top + balloonHeight/2,
					balloonCenterLeft = $this.offset().left + balloonWidth/2,
					shootImgLeft = $(window).width(),
					shootImgTop = $(window).height(),
					shootImgPosObj = {
						x : shootImgLeft,
						y : shootImgTop
					},
					balloonPosObj = {
						x : balloonCenterLeft,
						y : balloonCenterTop
					};
					
				//设置箭头对象在右下角位置，并旋转它的角度
				$('.shoot-img img').rotate(angle(balloonPosObj,shootImgPosObj));

				if($this.hasClass('shooted')) return;
				$this.addClass('shooted');

				if(useNum == 0){
					return false;
				}else if(useNum > 0){
					$arrowObj.removeClass('arrow' + useNum);	//清除点击前已有的class类名
					$('.lose-con').hide();		//清除点击前已有的class类名
					useNum = useNum -1;

					/*每次点击出现的动画*/
					$('.shoot-animate').show();
					$('.shoot-img').addClass('curr');
					var arrowPos = $('.shoot-img').offset();
					arrowPos.left += shootImgWidth/2;
					arrowPos.top += shootImgHeight/2;
					$('.shoot-img').animate({
							left : balloonCenterLeft + 'px',
							top : balloonCenterTop + 'px'
							//opacity : 'toggle'
						},1000,function(){
							$('.shoot-img')[0].style.left = arrowPos.left + 'px';
							$('.shoot-img')[0].style.top = arrowPos.top + 'px';
						$('.shoot-img').removeClass('curr');
							$('.shoot-animate').hide();
					});
					/*setTimeout(function(){
						$('.shoot-animate').hide();
					},2200);*/
					ArrowDisplay(useNum);

					
					/*判断失败与成功的情况:射箭的次数背景显示、失败提示、成功提示*/
					if( useNum || data.getGift.id < 0){		//data.getGift.id < 0)
						//console.log('没中');
						setTimeout(function(){
							$this.addClass('touch');
							$('.lose-con').show();
							if( useNum == 0){
								$('.result-bot, .pro-topbar').show();
								showOther();
								$('.pro-tip').hide();
							}
						},1000);

						//未中奖的各种延续操作
						//$('.btn-share-lose').attr('href','share.html?giftid=' + data.getGift.id + '&giftName='+ data.getGift.name);

					}else if(data && data.getGift.id >= 0 && data.getGift.name.length > 0){		//data.getGift.id >= 1
						//console.log('中');			
						//最后一次射中礼物文字提示
						setTimeout(function(){
							$this.addClass('success').text(data.getGift.name);
							$('.succ-con, .result-bot, .pro-topbar').show();
							showOther();
							$('.pro-tip').hide();
						},1000);

						//中奖的各种延续操作
						$('.succ-con .succ-img img').attr('src','http://cdn.icomicool.cn/m/act/game-shoot/images/gift' + data.getGift.id + '.png');
						$('.succ-con .succ-txt i').html(data.getGift.name);

						var randNumber = Math.floor(Math.random() * 1000);
						var encodedGiftid = data.getGift.id + 1234 + randNumber;
						var encodedGiftName = data.getGift.name + '_' + (randNumber + 5678).toString() + '_' + (randNumber + 1111).toString();
						var formUrl = encodeURI('form.html?ccid=' + appCcid + '&giftid=' + encodedGiftid + '&giftName='+ encodedGiftName);
						$('.btn-get').attr('href',formUrl);
						//$('.btn-share-succ').attr('href','share.html?giftid=' + data.getGift.id + '&giftName='+ data.getGift.name);
					}
					
				}	//else if(useNum > 0) end
				
			});	//气球点击事件 end
			
			/**[showOther 弓箭全部射完，显示最后结果]-----@return {[type]}     [description]*/
			function showOther(){
				/*
					比如 
						data.gift = {{id:1,name:'礼物1'},{id:2,name:'礼物2'},{id:3,name:'礼物3'},{id:4,name:'礼物4'}};
						data.getGift = {id:3,name:'礼物3'};
					结果就是 
						data.gift = ['礼物1','礼物2',礼物4'];
				*/
				var gifts = [];
				$.each(data.gift,function(idx,item){
					if(item.id != data.getGift.id){					
						gifts.push(item);
					}
				});
				gifts.sort(function(){return Math.random()-0.5;});
				gifts.splice(5);

				/*if(data.getStatus){
					data.gift.splice([$.inArray(data.getGift,data.gift)],1);
				}*/

				var len = $('.balloon-list span.success').length + $('.balloon-list span.touch').length,
					giftLen = gifts.length,
					temp = [];
				for(var i=0;i<16-len-giftLen;i++){
					temp.push(0);
				}
				temp = temp.concat(gifts);
				temp.sort(function(){return Math.random()-0.5;});
				$('.balloon-list span').each(function(idx){
					var $this = $(this);
					if( !$this.hasClass('shooted') ){
						var item = temp.pop();
						if( item ){
							$this.addClass('here').text(item.name);
						}else{
							$this.addClass('lose');
						}
					}
				});
			}	//showOther end  弓箭全部射完，显示其它结果


			// 弹出分享面板各项设置--放到里面去
			var MOBComico = {},
				ua = navigator.userAgent.toLowerCase();
		    //设置的app苹果安卓ua信息
		    MOBComico.app = (/icomico/i.test(ua)) ? true : false ;

			//设置所需的接口数据对象，并转化JSON字符串，以使用app里的接口
			var popupSharePanelObj = {
				'title': '小米奖品任你射',
				'describe' : '小米用户福利放送，免费射取小米奖品',
				'imageurl' : 'http://cdn.icomicool.cn/m/act/game-shoot/images/share-img4.jpg?imageMogr2/thumbnail/240x',
				'page_url' : encodeURI('http://m.comicool.cn/act/game-shoot/share.html?giftid=' + data.getGift.id + '&giftName='+ data.getGift.name)
			},
				popupSharePanelStr = JSON.stringify(popupSharePanelObj);

			//执行调用接口，弹出分享面板
			if( data.getGift.id < 0){
				$('.btn-share-lose').on('click',function(){
					comicool.popupSharePanel(popupSharePanelStr);
				});
			}else if( data.getGift.id >= 0){
				$('.btn-share-succ').on('click',function(){
					comicool.popupSharePanel(popupSharePanelStr);
				});
			}
        },		//successAJAX end
        complete: function(XMLHttpRequest, textStatus){
            //HideLoading();
            loadingHide();
        },   
        error : function(){
        	//alert('error2');
        	errorShow('(' + XMLHttpRequest.status + ',' + XMLHttpRequest.readyState + ')');
        }    
    });


	//计算旋转角度
	function angle(start,end){
	    var diff_x = end.x - start.x,
	        diff_y = end.y - start.y;
	    //返回角度，不是弧度
	    return 360*Math.atan(diff_y/diff_x)/(2*Math.PI);
	}

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

	//获取气球区域的行高
	setTimeout(function(){
		var ballHeight = $('.balloon-list .libg').height();
		$('.balloon-list .liball span').css('line-height',ballHeight + 'px');
	},1500);

});
