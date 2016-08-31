
var ua=navigator.userAgent.toLowerCase(),
	isMobile = ua.indexOf('mobile')>0,
	isWeixin = (/micromessenger/.test(ua)) ? true : false,
	isQQ = (/qq\//.test(ua)) ? true : false,
	isIOS = ua.indexOf('(ip')>0 && isMobile,
	isWeibo = (/Weibo/i.test(ua)) ? true : false ,
	isApp = (/icomico/i.test(ua)) ? true : false ,
	isAppIOS = (/icomico_ios./i.test(ua)) ? true : false ,
	isAppAndr = (/icomico_adr./i.test(ua)) ? true : false ;

var shareJsonObj = {
    'title' : '2016年前人类最后的流行病毒',
    'describe' : '总有一种病，适合你呦~ ╮(╯▽╰)╭',
    'imageurl' : 'http://cdn.icomicool.cn/m/act/ill-page/images/share-img.jpg'
};
var shareJsonStr = JSON.stringify(shareJsonObj);
/*if( isApp ){
	try {
        comicool.showShareBtn(shareJsonStr);
    } catch (e) {
        window.location.href= 'http://comicool/showShareBtn?title=' + shareJsonObj.title + '&describe=' + shareJsonObj.describe + '&imageurl=' + shareJsonObj.imageurl;
    }
}*/

var musicStop = 0;
window.onresize = function(){
	screenStatus();
}
window.onload = function(){
	FastClick.attach(document.body);			//fastClick使用
	screenStatus();
}

function onPagePause(){
	var total = document.getElementById("total-autio");
    total.pause();
    musicStop = 1;
}
		
function onPageDestroy(){
	var total = document.getElementById("total-autio");
    total.pause();
    musicStop = 1;
}

function onPageResume(){
	var total = document.getElementById("total-autio");
    musicStop = 0;
    total.play();
}

if(isAppAndr){
	var setJSCallbackObj = {
				'page_pause_event': 'onPagePause',
				'page_destroy_event': 'onPageDestroy',
				'page_resume_event':'onPageResume'
			};
	var setJsonStr = JSON.stringify(setJSCallbackObj);
	comicool.setJSCallback(setJsonStr);
}

// 横竖屏状态
function screenStatus(){
	var _winWidth = $(window).width(),
		_winHeight = $(window).height();
	if ( _winWidth > _winHeight) {
		//console.log('横屏');
		$('.error').show();
	} else {
		//console.log('竖屏');
		$('.error').hide();
	}
}

$(function() {

	var mKeyboard = document.getElementById("keyboard"),
		mEvil = document.getElementById("evil"),
		mMonster = document.getElementById("monster"),
		mHelp = document.getElementById("help"),
		mLoveshow = document.getElementById("loveshow"),
		mGirlsmile = document.getElementById("girlsmile"),
		mGun = document.getElementById("gun");

	function isMusicOpen(music){
		if(musicStop){
			return;
		}
        if (music.paused || music.ended) { //判读是否播放
            music.play(); //没有就播放
			setTimeout( function(){
				if(musicStop){
					return;
				}
            	var total = document.getElementById("total-autio");
            	total.pause();
		        if (total.paused || total.ended) { //判读是否播放
        	    	total.play();
        	    }
			}, music.duration * 1000 + 500);
        }
        /*music.autoplay=true;
        music.load();*/
	}

	function loading(){
		$('.loading').hide();
		$('body').addClass('play');

		//全局音乐 点击播放音乐或者停止音乐，安卓可以即时播放，苹果需点击操作
		$('#music-btn').show().on('click',function(){
			var music = document.getElementById("total-autio");//获取ID
			$(this).removeClass('defalut');
		    if (music.paused || music.ended) { //判读是否播放
	            music.play(); //没有就播放
	            $(this).removeClass('curr').addClass('defalut');
	    } else {
	    		music.pause();
	    		$(this).removeClass('defalut').addClass('curr');
		    }
		});

		// 首页音效
		if($('body').hasClass('play')){
			//遮罩层隐藏
			$('.coverbox').show();
			setTimeout( function(){
				$('.coverbox').hide();
			},5200);
			if(mKeyboard){
				setTimeout( function(){
					isMusicOpen(mKeyboard);
				},1800);
			}
			if(mEvil){
				setTimeout( function(){
					isMusicOpen(mEvil);
				},4500);
			}

		}
		
	}
	setTimeout(loading,3000);

	function initPageHome(){

		$('.index-btn a').on('click',function(){
			$('.page-index').hide();
			$('body').removeClass('play').addClass('play1');
			$('.page-first').show();

			// 内容第一页音效
			if(mMonster && $('body').hasClass('play1')){
				setTimeout( function(){
					isMusicOpen(mMonster);
				},2000);
			}

			if($('body').hasClass('play1')){
				//遮罩层隐藏
				$('.coverbox').show();
				setTimeout( function(){
					$('.coverbox').hide();
				},7000);
			}
		});
	}
	initPageHome();

	//声明初始化变量
	var answerFirst,
		answerSecond,
		ill_id,
		pic_id,
		manhua_name;
	var illDesc = [
			'骚年，你已毒气入体，<br>唯有我米酷族人能医此毒~~~',
			'经诊断，你已为中二病晚期，<br>此方也许能救你一命！',
			'你已病入膏肓，<br>请依照此秘籍刮骨疗毒~~~！'
		];
	var get_illNum = Math.floor((Math.random() * illDesc.length));
	//题目选择3种情况，获取随机数
	var random_num = Math.floor((Math.random() * 3));

	function initPageFirst(){
		$('.first-list li').on('click',function(){
			var _index = $(this).index();
				answerFirst = _index;
			//alert(answerFirst);

			$('.page-first').hide();
			$('body').removeClass('play1').addClass('play2');
			$('.page-second').show();

			// 内容第一页音效
			if(mHelp && $('body').hasClass('play2')){
				setTimeout( function(){
					isMusicOpen(mHelp);
				},1800);
			}

			if($('body').hasClass('play2')){
				//遮罩层隐藏
				$('.coverbox').show();
				setTimeout( function(){
					$('.coverbox').hide();
				},4500);
			}
		});
	}
	function initPageSecond(){
		$('.second-list li').on('click',function(){
			var _index = $(this).index();
			answerSecond = _index;
			//alert(answerSecond);
			
			$('.page-second').hide();
			$('body').removeClass('play2').addClass('play3');
			$('.page-third').show();

			// 内容第一页音效
			if(mLoveshow && $('body').hasClass('play3')){
				setTimeout( function(){
					isMusicOpen(mLoveshow);
				},2500);
			}

			if($('body').hasClass('play3')){
				//遮罩层隐藏
				$('.coverbox').show();
				setTimeout( function(){
					$('.coverbox').hide();
				},6500);
			}
		});
	}
	initPageFirst();
	initPageSecond();
	
	//选题条件
	function resultFn(){
		if (answerFirst==0 && answerSecond==0) {
			ill_id = 0;	//邪气眼中二病
			switch (random_num) {
				case 0:
					pic_id = 76;
					manhua_name = '玻璃花';
					break;
				case 1:
					pic_id = 675;
					manhua_name = '西游之迷失国度';
					break;
				case 2:
					pic_id = 676;
					manhua_name = '化神';
					break;
			}
		}else if (answerFirst==0 && answerSecond==1) {
			ill_id = 1;	//DQN中二病
			switch (random_num) {
				case 0:
					pic_id = 77;
					manhua_name = '神兽退散';
					break;
				case 1:
					pic_id = 678;
					manhua_name = '朋友圈';
					break;
				case 2:
					pic_id = 25;
					manhua_name = '奇怪怪奇';
					break;
			}
		}else if (answerFirst==0 && answerSecond==2) {
			ill_id = 2;	//亚文化中二病
			switch (random_num) {
				case 0:
					pic_id = 70;
					manhua_name = '诡来了';
					break;
				case 1:
					pic_id = 690;
					manhua_name = '回到明朝当王爷';
					break;
				case 2:
					pic_id = 93;
					manhua_name = '高陵先生';
					break;
			}
		}else if (answerFirst==1 && answerSecond==0) {
			ill_id = 3;	//邪气眼+DQN+亚文化高二病
			switch (random_num) {
				case 0:
					pic_id = 676;
					manhua_name = '化神';
					break;
				case 1:
					pic_id = 678;
					manhua_name = '朋友圈';
					break;
				case 2:
					pic_id = 690;
					manhua_name = '回到明朝当王爷';
					break;
			}
		}else if (answerFirst==1 && answerSecond==1) {
			ill_id = 4;	//是2B，不是中二病
			switch (random_num) {
				case 0:
					pic_id = 170;
					manhua_name = '不笑的喜剧班';
					break;
				case 1:
					pic_id = 183;
					manhua_name = '血型小将';
					break;
				case 2:
					pic_id = 161;
					manhua_name = '神之塔';
					break;
			}
		}else if (answerFirst==1 && answerSecond==2) {
			ill_id = 5;	//邪气眼+DQN中二病
			switch (random_num) {
				case 0:
					pic_id = 675;
					manhua_name = '西游之迷失国度';
					break;
				case 1:
					pic_id = 676;
					manhua_name = '化神';
					break;
				case 2:
					pic_id = 93;
					manhua_name = '高陵先生';
					break;
			}
		}else if (answerFirst==2 && answerSecond==0) {
			ill_id = 6;	//邪气眼+亚文化中二病
			switch (random_num) {
				case 0:
					pic_id = 76;
					manhua_name = '玻璃花';
					break;
				case 1:
					pic_id = 70;
					manhua_name = '诡来了';
					break;
				case 2:
					pic_id = 678;
					manhua_name = '朋友圈';
					break;
			}
		}else if (answerFirst==2 && answerSecond==1) {
			ill_id = 7;	//DQN+亚文化中二病
			switch (random_num) {
				case 0:
					pic_id = 678;
					manhua_name = '朋友圈';
					break;
				case 1:
					pic_id = 25;
					manhua_name = '奇怪怪奇';
					break;
				case 2:
					pic_id = 93;
					manhua_name = '高陵先生';
					break;
			}
		}else if (answerFirst==2 && answerSecond==2) {
			ill_id = 8;	//邪气眼+DQN+亚文化中二病
			switch (random_num) {
				case 0:
					pic_id = 676;
					manhua_name = '化神';
					break;
				case 1:
					pic_id = 678;
					manhua_name = '朋友圈';
					break;
				case 2:
					pic_id = 690;
					manhua_name = '回到明朝当王爷';
					break;
			}
		};
	}

	var Slot={
		init: function(){
			this.beginPlay();
		},
		beginPlay:function(){
			var $scroll = $(".scroll-list>li"),flag = true;
			var h = $scroll.height();

			//resultFn();		//选题函数执行，得出结果

			resultFn();
			//alert(ill_id);
			//n的数据值为对应的奖品序号
			var n = ill_id;
			$scroll.css("background-position","0 0").animate({
				"background-position-y": ((h*18) - (h*ill_id))
			},{
				duration: 3000,
				easing: "swing",
				complete : function(){
					//alert(answerFirst + ' , ' + answerSecond + ' , ' + pic_id + ' , ' + manhua_name);
					$('.result-con h3').html( illDesc[get_illNum] );
					$('.result-con span').text(manhua_name);
					$('.result-img img').attr('src','images/page6/result-' + pic_id + '.png');
					
					var actJsonObj = {
						'comic_id': pic_id
					};
		            var actJsonStr = JSON.stringify(actJsonObj);
					//$('.sixth-main a.result-a').attr('href','http://m.comicool.cn/content/detail.html?comic_id=' + pic_id);
					$('.result-lnk a, .sixth-main a.result-a').on('click',function(){
						if (isApp) {
							try {
			                    comicool.openComicDetailsPage(actJsonStr);
			                } catch (e) {
			                    window.location.href="http://comicool/openComicDetailsPage?comic_id=" + actJsonObj.comic_id;
			                }
						}else{
							$('.result-lnk a, .sixth-main a.result-a').attr('href','http://m.comicool.cn/content/detail.html?comic_id=' + pic_id);
						}
					});
					
				}	//complete  end
			});
		}
	};/*slot end*/

	function initPageThird(){
		var listLen = $('.third-list li').length;
		for (var i = 0; i < listLen; i++) {
			$('.third-list li').eq(i).on('click',function(){
				$('.page-third').hide();
				$('body').removeClass('play3').addClass('play4');
				$('.page-fourth').show();

				// 内容第一页音效
				if(mGirlsmile && $('body').hasClass('play4')){
					setTimeout( function(){
						isMusicOpen(mGirlsmile);
					},3000);
				}

				if($('body').hasClass('play4')){
					//遮罩层隐藏
					$('.coverbox').show();
					setTimeout( function(){
						$('.coverbox').hide();
					},7500);
				}
			});
		};
	}
	initPageThird();

	function initPageFourth(){
		var listLen = $('.fourth-list li').length;
		for (var i = 0; i < listLen; i++) {
			$('.fourth-list li').eq(i).on('click',function(){
				$('.page-fourth').hide();
				$('body').removeClass('play4').addClass('play5');
				$('.page-fifth').show();

				// 内容第一页音效
				if(mGun && $('body').hasClass('play5')){
					setTimeout( function(){
						isMusicOpen(mGun);
					},3800);
				}

				if($('body').hasClass('play5')){
					//遮罩层隐藏
					$('.coverbox').show();
					setTimeout( function(){
						$('.coverbox').hide();
					},5500);
				}
			});
		};
	}
	initPageFourth();

	function initPageFifth(){
		var listLen = $('.fifth-list li').length;
		for (var i = 0; i < listLen; i++) {
			$('.fifth-list li').eq(i).on('click',function(){
				$('.page-fifth').hide();
				$('body').removeClass('play5').addClass('play6');
				$('.page-sixth').show();
				
				$('.sixth-ill-list li').hide();
				//上下翻动效果
				if($('body').hasClass('play6')){
					//Slot.init();
					setTimeout(function(){
						$('.sixth-ill-list li').show();
						Slot.init();
					},1800);
				}
			});
		};
	}
	initPageFifth();

	function initPageSixth(){

		//微信分享等处理
		if ( isWeixin || isWeibo || isQQ ) {
			$('.sixth-btn a.btn-share').on('click',function(){
				$('.share-tip').show();
				$('.share-tip').on('click',function(){
					$(this).hide();
				});
			});
			if(isWeibo){
				document.title = '#中二病症状测试#没想到我已经是中二病晚期，真是有种dandan的忧桑啊~@可米酷漫画，说好了安慰我的电影票呢，你们就肆介样对待一个晚期患者么~~~小伙伴儿们，你们快去领光他们家的电影票，顺便看看自己都有什么病：';
			}

		}else if( isApp ){
			//alert('app 是也')
		    $('.sixth-btn a.btn-share').on('click',function(){
			    try {
	                comicool.popupSharePanel(shareJsonStr);
	            } catch (e) {
	                window.location.href= 'http://comicool/popupSharePanel?title=' + shareJsonObj.title + '&describe=' + shareJsonObj.describe + '&imageurl=' + shareJsonObj.imageurl;
	            }
			});
			$('.sixth-btn a.btn-download').hide();
		}else{
			// 提示另一表现形式
			$('.sixth-btn a.btn-share').on('click',function(){
				$('.share-tip img').attr('src','images/share-tip2.png');
				$('.share-tip').show();
				$('.share-tip').on('click',function(){
					$(this).hide();
				});
			});
		}

		//下载处理
		$('.sixth-btn a.btn-download').on('click',function(){
			window.location.href = 'http://m.app.comicool.cn/smart_open/main.php'
        	//window.location.href = combinUrl("m.app.", "/smart_open/main.php");
		});

		//打开规则层
		$('.sixth-btn a.btn-rule').on('click',function(){
			$('.rule').show();
			$('.rule a.rule-clo, .rule-inner').on('click',function(){
				$('.rule').hide();
			});
		});
	}
	initPageSixth();
});


	
