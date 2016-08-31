$(function() {
	FastClick.attach(document.body);			//fastClick使用
	function pageLoading(){
		$('.loading').hide();
		$('.fir-tit, .fir-txt').addClass('curr');
	}
	setTimeout(pageLoading,3000);

	window.swiper = null;

	var $doc = $('.g-doc'),   					//	屏幕容器 -- 用于屏幕宽高和判断横竖屏
		$main = $('.m-swiper'),					//	滑屏容器	
		template = '',							//	模板
		pageTemplate = $('.page3').html(),		//	第三页的模板
		isHorizontal = false,					//	是否横屏
		storage = window.localStorage || {}, 	// 本地存储	
		current = storage.current || 0; 		//	当时第n屏
	$('.page3').remove();
	var tpls = {								// 各个模块对应的图片  1牵手2约会3亲吻4拥抱5啪啪
		1 : ['tpl-1-1','tpl-1-2'],
		2 : ['tpl-2-1','tpl-2-2'],
		3 : ['tpl-3-1','tpl-3-2'],
		4 : ['tpl-4-1','tpl-4-2'],
		5 : ['tpl-5-1','tpl-5-2']
	};

	var selectedtpl = [] , tplwidth = 0, tplheight = 0, lastDateSelected = '';

	var App = {
		model : {
			upload_list : []
		},
		init : function(){ 				//	初始化
			var docWidth = $doc.width(),
				docHeight = $doc.height();
			isHorizontal = docWidth > docHeight ? true : false;
			$main.height(docHeight);
			template || (template = $main.html());
			$main.html(template);						
			swiper = new Swiper('.m-swiper', {
				resizeReInit : true,
				speed: 800,
				height : docHeight,
				mode : 'vertical',
				onSwiperCreated : function(instance){
					current = storage.current || 0;
					App.setBoyName(storage['model.boy_name'] || '');
					App.setGirlName(storage['model.girl_name'] || '');
					(current > 0) && instance.swipeTo(current);
				},
				onSlideChangeEnd : function(idx){
					current = swiper.activeIndex;
					storage.current = current;
					App.pageCallback(current,swiper);
				}
			});								
		},
		pageCallback: function(pidx){  		//	画屏之后回调
			
			var pidx = parseInt(pidx),
				pageIndex = pidx + 1;				
			$('.m-datepicker,.dialogbg').hide();
			var $this = $(swiper.getSlide(pidx)).off('click');
			switch( pidx ){
				case 0 : 	//	封面页
					$this.find('.fir-tit').removeClass('curr').addClass('curr');
				break;
				case 1 : 	//  填写名字
					$this.off('blur').on('blur','.ipt-boy',function(){ 	// 男生名字
						App.setBoyName(this.value);
					}).on('blur','.ipt-girl',function(){ 				// 女生名字
						App.setGirlName(this.value);
					}).on('click','.start-btn',function(){	// 开始记录
						if( App.model.boy_name && App.model.girl_name){	
							$('.loading').show();
							$(this).remove();
							App.addSlide(pidx);
						}else{
							// alert('还没填写名字哦！');
							$('.sec-tip-noname,.dialogbg').show();
							$('.sec-tip-noname a').on('click',function(){
								$('.sec-tip-noname,.dialogbg').hide();
							});
						}
					});
				break;
				case 2 : 	// 
				case 3 : 	//
				case 4 : 	//
				case 5 : 	//	
				case 6 : 	//
				case 7 : 	//
					$('.time-txt').css({'line-height':$('.time').height()*0.9 + 'px'});	 // 调整日期
					tplwidth = $this.find('.templet-bg').width();
					tplheight = $this.find('.templet-bg').height();
					$('.add-btn,.finish-btn',$this).hide();
					if( $this.siblings('.swiper-slide').length === swiper.activeIndex ){
						if(swiper.activeIndex < 7){
							$this.data('idx') || App.getDate(instance.getDate());
							if( swiper.activeIndex < 6 ){
								$this.on('click','.lnk-more',function(){ // 新建活动页按钮 
									$('.loading').show();
									var $time = $this.find('.time-txt'),
										$ems = $time.find('em'),
										date = $ems.eq(0).text() + '.' + $ems.eq(1).text() + '.' + $ems.eq(2).text(),
										type_id = $this.find('.tpl-tab span.curr').index() + 1;
									selectedtpl.push( type_id );
									App.addSlide(pidx);
									swiper.swipeTo(pidx + 1);
								});
								$('.add-btn',$this).show();
							}
						}
						$this.on('click','.lnk-share',function(){ 				//	分享我的故事 
							App.submit();
						});
						$('.finish-btn',$this).show();
					}

					if( App.model.boy_name && App.model.girl_name){	 // 已经填写了名字
						if( $this.data('idx') ){ // 已经来过
							App.resetPage()
						}else{ 					//	第一次来
							$this.data('idx',pidx - 1);
							App.initPage();
						}						
					}else{												//	未填写名字，跳转到第二屏
						swiper.swipeTo(1);
					}
				break;
				
			}
		},
		initPage : function(){ 					//	新建的活动页
			var pidx = swiper.activeIndex, 		//	当前页面的索引值 ， 对应 page[n - 1]
				$this = $(swiper.getSlide(pidx));  // 当前页面的jQuery对象
			$.each(tpls, function(key, val) {   // 	初始化图片选择的tab
				var idx = parseInt(key,10);
				if($.inArray(idx,selectedtpl) === -1){
					$this.find('.tpl-tab span').eq(idx-1).show();
				}else{
					$this.find('.tpl-tab span').eq(idx-1).hide();
				}
			});

			var cSwiper = null, ctheight = 0;
			$this.on('click','.time',function(){ 					//	日期选择器
				// App.setDate();
				$('.m-datepicker,.dialogbg').show();
			}).on('click','.tpl-tab span',function(){ 				//	图片选择的tab事件
				var index = $(this).addClass('curr').index(),
					$ct = $this.data('tid',index).find('.list-inner').html(''),  // 记录当前选择的 tab
					lists = tpls[index + 1] || [];
				$(this).siblings('span').removeClass('curr');

				var tags = ['<ul class="items-swiper">'];
				$.each(lists,function(idx,item){
					tags.push('<li class="item-swiper">');
					tags.push('<img style="width:' + tplwidth + 'px;height:' + tplheight+ 'px" src="images/' + item + '.png" />');
					tags.push('</li>');
				});
				tags.push('</ul>');				
				$ct.html(tags.join(''));
				$ct.find('.items-swiper').width(lists.length * tplwidth).height(tplheight);
				if( cSwiper ) {
					cSwiper.swipeTo(0); 
					cSwiper.destroy();
				}
				cSwiper = $('.list-inner',$this).swiper({
					wrapperClass : 'items-swiper',
   					slideClass : 'item-swiper',
   					slideElement : 'li'
				});

				$('.prev-point',$this).on('click', function(e){
				    e.preventDefault()
				    cSwiper.swipePrev()
				});
				$('.next-point',$this).on('click', function(e){
				    e.preventDefault()
				    cSwiper.swipeNext()
				});
				$('.loading').hide();
			});
			$this.find('.tpl-tab span:visible').eq( 0 ).trigger('click');	
		},
		resetPage : function(){
			var pidx = swiper.activeIndex, 		//	当前页面的索引值 ， 对应 page[n - 1]
				$this = $(swiper.getSlide(pidx));  // 当前页面的jQuery对象

			var cSwiper = null, ctheight = 0;
			$this.on('click','.time',function(){ 					//	日期选择器
				App.setDate();
				$('.m-datepicker,.dialogbg').show();
			}).on('click','.tpl-tab span',function(){ 				//	图片选择的tab事件
				var index = $(this).addClass('curr').index(),
					$ct = $this.data('tid',index).find('.list-inner').html(''),
					lists = tpls[index + 1] || [];
				$(this).siblings('span').removeClass('curr');
				App.checkPage(index,function(remove){
					if( remove ){
						App.pageCallback(pidx);
					}else{
						var tags = ['<ul class="items-swiper">'];
						$.each(lists,function(idx,item){
							tags.push('<li class="item-swiper">');
							tags.push('<img style="width:' + tplwidth + 'px;height:' + tplheight+ 'px" src="images/' + item + '.png" />');
							tags.push('</li>');
						});
						tags.push('</ul>');				
						$ct.html(tags.join(''));
						$ct.find('.items-swiper').width(lists.length * tplwidth).height(tplheight);
						if( cSwiper ) {
							cSwiper.swipeTo(0); 
							cSwiper.destroy();
						}
						cSwiper = $('.list-inner',$this).swiper({
							wrapperClass : 'items-swiper',
								slideClass : 'item-swiper',
								slideElement : 'li'
						});

						$('.prev-point',$this).on('click', function(e){
						    e.preventDefault()
						    cSwiper.swipePrev()
						});
						$('.next-point',$this).on('click', function(e){
						    e.preventDefault()
						    cSwiper.swipeNext()
						});
					}
				});
				$('.loading').hide();
			});
			$this.find('.tpl-tab span').eq( $this.data('tid') || 0 ).trigger('click');	
		},
		checkPage : function(selectedIndex,callback){
			var curr = swiper.activeIndex,
				$this = $(swiper.getSlide(curr)),
				idx = $this.data('idx');
			if( !idx ) return;

			var removeId = 0;
			selectedtpl = [];
			$main.find('.swiper-slide').each(function(){
				if( $(this).data('idx') && $(this).data('idx') > idx ){
					selectedIndex == $(this).find('.tpl-tab span.curr').index() && (removeId = $(this).index());
				}
				if( removeId ){
					selectedtpl.push(selectedIndex + 1);
					swiper.removeSlide($(this).index());
				} else{
					selectedtpl.push( $(this).find('.tpl-tab span.curr').index() + 1);
				}
			});
			$.isFunction(callback) && callback(removeId);
		},
		getDate : function( def ){
			var $this = $(swiper.getSlide(swiper.activeIndex)),
				$time = $this.find('.time-txt'),
				date = def || instance.getDate();
			date.year = parseInt(date.year) === 0 ? '某' : date.year;
			date.month = parseInt(date.month) === 0 ? '某' : date.month;
			date.date = parseInt(date.date) === 0 ? '某' : date.date;
			$time.data('date',date.year + '.' + date.month + '.' + date.date).html('<em>' + date.year + '</em><em>' + date.month + '</em><em>' + date.date + '</em>');
		},
		setDate : function(){
			var $this = $(swiper.getSlide(swiper.activeIndex)),
				$time = $this.find('.time-txt'),
				$ems = $time.find('em'),
				date = {
					year : $ems.eq(0).text(),
					month : $ems.eq(1).text(),
					date : $ems.eq(2).text()
				};
			// date.month = (date.month + '').length == 1 ? '0' + date.momth : date.month;
			//console.log( date);
			instance.setDate(date.year + '-' + date.month + '-' + date.date);
		},
		setBoyName : function(name){
			name = name || (App.model && App.model.boy_name) || '';
			name = name.replace('*','').replace(';','');
			App.model.boy_name = $.trim(name);
			$('.unit-boy',$main).text(App.model.boy_name);
			$('.ipt-boy',$main).val(App.model.boy_name);
			storage['model.boy_name'] = App.model.boy_name;
		},
		setGirlName : function(name){
			name = name || (App.model && App.model.girl_name) || '';
			name = name.replace('*','').replace(';','');
			App.model.girl_name = $.trim(name);
			$('.unit-girl',$main).text(App.model.girl_name);
			$('.ipt-girl',$main).val(App.model.girl_name);
			storage['model.girl_name'] = App.model.girl_name;
		},	
		addSlide : function(pidx){
			if( $main.find('.page' + (pidx + 2)).length ) return;			
			var newSlide = swiper.createSlide(pageTemplate,'swiper-slide page' + (pidx + 2));
			newSlide.insertAfter(pidx);
			swiper.swipeTo(pidx+1);
		},
		removeSlide: function(idx){
			swiper.removeSlide(idx);
		},
		submit : function(){

			// $('.loading').show();
			var list = [];
			$main.find('.swiper-slide').each(function(){
				if( $(this).data('idx') ){
					var $ems = $(this).find('.time-txt em') ,
						date = {
							year : $ems.eq(0).text(),
							month : $ems.eq(1).text(),
							date : $ems.eq(2).text()
						};
					list.push({
						page_id : $(this).find('.tpl-tab span.curr').index() + 1,
						text : $(this).find('.tpl-tab span.curr').text(),
						module_id : $(this).find('.items-swiper .swiper-slide-active').index() + 1,
						module_img : $(this).find('.items-swiper .swiper-slide-active img').attr('src'),
						date : date.year + '.' + date.month + '.' + date.date
					});
				}				
			});
			App.model.upload_list = list;
			App.ajax( JSON.stringify(App.model),function(ret){
				// $('.loading').hide();
				if( ret && ret.msg == 'success'){
					window.location.href = 'index.php?id=' + ret.id;
				}else{
					$('.error').find('a.error-lnk').attr('href', window.location.href);
					$('.error').find('.txt-error').html('三次元的网络不行呀<br />点我继续分享回忆喔').end().show();
					losePreload('error');
				}
			});
			
		},
		ajax : function( uploadJsonStr ,callback){
			$.ajax({
                url : 'http://121.201.7.97:8090/uploadInfo?data=' + uploadJsonStr,// 跳转到 action
                // data : '',    
                type : 'get',
                timeout : '10000',  
                cache : false,    
                dataType : "jsonp",
                jsonp: "callback",      //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                jsonpCallback:"jsonp_upload",      //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
                success : function(response , status , xhr) {
                    $.isFunction(callback) && callback(response);
                }
            });  
		}
	};
				
	App.init();	
	
	var top = ($doc.height() - 240) / 2;
	instance = $('#datepicker').css({top:top}).datepicker({
		beginDate : '1900-01-01',
		endDate : '2049-12-31',
		defDate : '2014-01-01',
		onLoaded : function(){					
		},
		onDateChange: function(date){
			//console.log(date);
		}
	}).data('datepicker');
	
	$('.lnk-dpcancel').on('click',function(){
		$('.m-datepicker').hide();
	});
	$('.lnk-dpok').on('click',function(){
		App.getDate();
		$('.m-datepicker').hide();
	});
});

var instance;