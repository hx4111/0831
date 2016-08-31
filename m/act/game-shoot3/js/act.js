$(function() {
	//FastClick.attach(document.body);			//fastClick使用

	var init = {
		startShootTabFn : function(){

			//设置模拟数据
			var data = {
				chooseNum : 1	//选择射箭机会的次数
			}
			//初始化箭的个数
			var pushchooseNumObj = $('.startbox span').find('b').text(data.chooseNum),
				$startBtn = $('.startbox a');

			//点击前按钮状态
			if( data.chooseNum > 0 ){
				$startBtn.removeClass('curr').attr('href','process.html');	//按钮亮起时设置属性值
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
				_diffVal = data.chooseNum - _index;	/*数值比较差值*/
				if( _diffVal >= 0 ){
					$startBtn.removeClass('curr').attr('href','process.html');	//按钮亮起时设置属性值
				}else{
					$startBtn.addClass('curr').attr('href','javascript:;');	//按钮为灰时--默认
				}
			});	//点击选项卡 end

		},	//startShootTabFn  end
		shootingBalloonFn : function(){
			//设置模拟数据
			var data = {
				useNum : 2,	//使用箭的次数
				getStatus : 1,	//进入页面时判断有未得到礼物，0表示没有获得，1表示获得
				gift : [{id:1,name:'礼物1'},{id:2,name:'礼物2'},{id:3,name:'礼物3'},{id:4,name:'礼物4'}],
				getGift : {id:3,name:'礼物3'}
			}

			//初始化底部箭背景显示及状态（次数）
			var $arrowArea = $('.arrow-area'),
				$arrowObj = $('.arrow-area span'),
				shootImgWidth = $('.shootbg-img').innerWidth(),
				shootImgHeight = $('.shootbg-img').innerHeight(),
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

				//计算旋转角度
				function angle(start,end){
				    var diff_x = end.x - start.x,
				        diff_y = end.y - start.y;
				    //返回角度，不是弧度
				    return 360*Math.atan(diff_y/diff_x)/(2*Math.PI);
				}

				console.log(angle(balloonPosObj,shootImgPosObj));
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
					$('.shoot-img').animate({
						left : balloonCenterLeft + 'px',
						top : balloonCenterTop + 'px',
						opacity : 'toggle'
					},2200,function(){
						$('.shoot-animate').hide();
					});
					/*setTimeout(function(){
						$('.shoot-animate').hide();
					},2200);*/

					ArrowDisplay(useNum);

					/*判断失败与成功的情况:射箭的次数背景显示、失败提示、成功提示*/
					if( useNum || data.getStatus == 0){
						console.log('没中');
						setTimeout(function(){
							$this.addClass('touch');
							$('.lose-con').show();
							if( useNum == 0){
								$('.result-bot, .pro-topbar').show();
								showOther();
							}
						},2200);
					}else if( data.getStatus == 1){
						console.log('中');			
						//最后一次射中礼物文字提示
						setTimeout(function(){
							$this.addClass('success');
							$('.succ-con, .result-bot, .pro-topbar').show();
							showOther();
						},2200);
					}
					
				}	//else if(useNum > 0) end
				
			});	//气球点击事件 end

			/**
			 * [showOther 弓箭全部射完，显示最后结果]
			 * @return {[type]}     [description]
			 */
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
							$this.addClass('here');
						}else{
							$this.addClass('lose');
						}

					}
				});
			}	//showOther end  弓箭全部射完，显示其它结果

		}	//shootingBalloonFn  end
	};
	init.startShootTabFn();
	init.shootingBalloonFn();

	function loadingShow(){
		$('.loading').show();
	}
	function loadingHide(){
		$('.loading').hide();
	}
	function errorShow(txt){
		$('.errorbox').show();
		$('.error-con p').html('啊！~~加载中出现错误啦！'+txt);
	}
	
});