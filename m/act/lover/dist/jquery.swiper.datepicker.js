/*!
 * Includes jQuery.js
 * http://jquery.com/
 *
 * Includes Swiper.js
 * http://www.idangero.us/sliders/swiper/
 * 
 * author: 戏子
 * Date: 2015-02-06
 */
(function($) {				
	var Common = {
		str2Date : function(str,format){
			format = format || 'Y-m-d';
			format = format.replace('Y', 'YYYY').replace('y', 'YY').replace('m', 'mm').replace('d', 'dd');
			if(!str || str.length != format.length) return '';
			var i = 0, 
				l = format.length, 
				o = {Y: '', m:'', d:''}, 
				k = '';
			for(i=0; i<l; i++){
				k = format.charAt(i);
				if(typeof o[k] != 'undefined') o[k] += str.charAt(i);
			}
			var y = new Date().getFullYear().toString();
			if(!o.Y){
				o.Y = y;
			}else if(o.Y.length == 2){
				o.Y = y.substr(0,2) + o.Y;
			}
			if(o.m) o.m -= 1;
			return new Date(o.Y, o.m, o.d, 0,0,0);					
		},
		date2Str :function(str, date){
			if(typeof date == 'undefined' || !date){//默认使用当前时间
				date = new Date();
			}else if(typeof date != 'object'){//当时间戳处理
				date = new Date(parseInt(date)*1000);
			}			
			date = Common.dateObject(date);
			return (str||'Y-m-d').replace(new RegExp('Y|y|m|d','g'), function(key){
				var i = date[key];
				return new RegExp('m|d').test(key) && i < 10 ? '0'+ i : i;
			});
		},
		dateObject : function(date){
			date = date || (new Date());
			return {
				Y : date.getFullYear(),
				y : date.getFullYear().toString().substr(2,2),
				m : date.getMonth()+1,
				d : date.getDate()
			};
		}
	};
	
	var $obj = $({}),
        Fun = {
            add : function () {  // 这里的回调第一个参数是jQuery 的 Event
                $obj.on.apply($obj, arguments);
            },
            exec : function () {            	
                $obj.trigger.apply($obj, arguments);
            },
            del : function () {
                $obj.off.apply($obj, arguments);
            }            
        };
	
	$.fn.datepicker = function(options){
		options = $.extend({
			selector:{
				wrapper : '.dp-wrapper'
			},
			height : 40,
			beginDate : '1970-01-01',
			endDate : '2015-12-31',
			defDate : '2015-02-14',
			onLoaded : $.noop,
			onDateChange : $.noop
		}, options);
        return this.each(function() {
        	if( !$(this).data('datepicker') ){ 
            	$(this).data('datepicker',new DatePicker($(this),options));
        	}		            
        });
	};
	
	function DatePicker($root, options){
		this.$root = $root;
		this.options = options;		
		this.selected = {};			
		this.init();
		return this;
	};
	
	DatePicker.prototype.init = function(){
		var self = this,
			bdate = Common.str2Date(this.options.beginDate),
			bdObj = Common.dateObject(bdate),
			edate = Common.str2Date(this.options.endDate),
			edObj = Common.dateObject(edate),
			oDate = {
				year : [-1],
				month : [-1],
				date : [-1]
			},
			tags = [];
		var i = 0, 
			start = bdObj.Y, 
			end = edObj.Y,
			len = end - start + 1;		
		tags.push('<div class="dp-year dp-swiper-ct"><div class="dp-swiper-wrapper">');
		//tags.push('<div class="dp-slide" data-val="0">某</div>');			
		for(i;i < len;i++){
			var text = start + i;
			oDate.year.push(text);	
			tags.push('<div class="dp-slide" data-val="' + text + '">' + text + '</div>');							
		}
		tags.push('</div></div>');	

		tags.push('<div class="dp-month dp-swiper-ct"><div class="dp-swiper-wrapper">');
		//tags.push('<div class="dp-slide" data-val="0">某</div>');
		(i = 0),(len = 12);					
		for(i;i < len;i++){
			var text = i + 1;
			oDate.month.push(text);
			tags.push('<div class="dp-slide" data-val="' + text + '">' + text + '</div>');	
		}						
		tags.push('</div></div>');
		
		tags.push('<div class="dp-date dp-swiper-ct"><div class="dp-swiper-wrapper">');
		tags.push('<div class="dp-slide" data-val="0">某日</div>');
		(i = 0),(len = 31);					
		for(i;i < len;i++){
			var text = i + 1;
			oDate.date.push(text);
			tags.push('<div class="dp-slide" data-val="' + text + '">' + (text) + '</div>');	
		}						
		tags.push('</div></div>');
		
		this.$root.find(self.options.selector.wrapper).html(tags.join(''));					
		this._initSwiper();
		this.setDate( this.options.defDate );
		this._addListeners(bdate,bdObj,edate,edObj,oDate);					
		$.isFunction( this.options.onLoaded ) && this.options.onLoaded.call(this);
		return this;
	};
	
	DatePicker.prototype._addListeners = function(bdate,bdObj,edate,edObj,oDate){
		var self = this;
		
		Fun.del('dateChange');					
		Fun.add('dateChange',function(){			
			self.$root.find('.dp-date .dp-slide,.dp-month .dp-slide,.dp-year .dp-slide').removeClass('selected');
			self.$root.find('.dp-date .dp-slide[data-val=' + self.selected.date + ']').addClass('selected');
			self.$root.find('.dp-month .dp-slide[data-val=' + self.selected.month + ']').addClass('selected');
			self.$root.find('.dp-year .dp-slide[data-val=' + self.selected.year + ']').addClass('selected');
			$.isFunction( self.options.onDateChange ) && self.options.onDateChange.call(self,self.selected);
		});	
		
		Fun.del('changeDate');	
		Fun.add('changeDate',function(evt,max,min,trigger){
			var selectedMonth = parseInt(self.selected.month,10),
				selectedDate = parseInt(self.selected.date,10);		
			for(var i= 1,len = 31;i <= len; i++){								
				var $item = self.$root.find('.dp-date .dp-slide[data-val=' + i + ']');
				if( i < min || i > max ){
					$item.addClass('hidden');
				}else{
					$item.removeClass('hidden');
				}								
			}
			if( selectedMonth === 0 ){
				self.swipers.date.swipeTo(0);
			} else if( selectedDate > max ){
				self.swipers.date.swipeTo(max);					
			}else{
				trigger && Fun.exec('dateChange',self.selected);
			}
		});		
		
		Fun.del('changeMonth');	
		Fun.add('changeMonth',function(evt,max,min){						
			for(var i=1,len = 12;i <= len; i++){								
				var $item = self.$root.find('.dp-month .dp-slide[data-val=' + i + ']');
				if( i > max || i < min ){
					$item.addClass('hidden');
				}else{
					$item.removeClass('hidden');
				}							
			}
			if(parseInt(self.selected.month) > max){
				self.swipers.month.swipeTo(max - 1);
			} else if( parseInt(self.selected.month) < min ){
				self.swipers.month.swipeTo(min - 1);
			} 
			
			var maxYear = parseInt(edObj.Y),
				minYear = parseInt(bdObj.Y),
				selectedYear = parseInt(self.selected.year,10),
				maxMonth = parseInt(edObj.m),
				minMonth = parseInt(bdObj.m),
				selectedMonth = parseInt(self.selected.month),
				dMax = (new Date(selectedYear,selectedMonth,0)).getDate(),
				dMin = 1;
			if( maxYear === selectedYear && maxMonth === selectedMonth){
				dMax = edObj.d;
			}else if( minYear === selectedYear && minMonth === selectedMonth){
				dMin = bdObj.d;
			}
			Fun.exec('changeDate',[dMax,dMin,true]);		
		});	
		
		Fun.del('changeYear');	
		Fun.add('changeYear',function(evt,year){	
			var maxYear = parseInt(edObj.Y),
				minYear = parseInt(bdObj.Y),
				year = parseInt(year,10),
				max = 12,
				min = 1;							
			(maxYear === year) && (max = edObj.m);
			(minYear === year) && (min = bdObj.m);
			Fun.exec('changeMonth',[max,min]);			
		});	
		return this;					
	};
	DatePicker.prototype._initSwiper = function(odate){
		var self = this;
		this.swipers = {};
		this.swipers.date = $('.dp-date',this.$root).swiper({
			mode : 'vertical',
			width: 300,
			height: self.options.height,
		    wrapperClass : 'dp-swiper-wrapper',
		    slideClass : 'dp-slide',
		    onTouchEnd : function(swiper){
		    	var $this = $(swiper.getSlide(swiper.activeIndex)),
		    		index = swiper.activeIndex,
		    		$first = $this.parent().find('.dp-slide:not(.hidden)').first(),
		    		firstIndex = $first.index(),
		    		$last = $this.parent().find('.dp-slide:not(.hidden)').last(),
		    		lastIndex = $last.index();
		    	if( lastIndex < index ){	
		    		swiper.swipeTo(lastIndex);
		    	} else if( firstIndex > index ){
		    		swiper.swipeTo(firstIndex);
		    	}	    	
		    },
		    onSlideChangeEnd : function(swiper){
		    	var $this = $(swiper.getSlide(swiper.activeIndex));
		    	self.selected.date = $this.data('val');
		    	Fun.exec('dateChange',self.selected);
		    },
		    onSlideReset : function(swiper){
		    	var $this = $(swiper.getSlide(swiper.activeIndex));
		    	self.selected.date = $this.data('val');
		    	Fun.exec('dateChange',self.selected);
		    }
		});
		this.swipers.month = $('.dp-month',this.$root).swiper({
			mode : 'vertical',
			width: 300,
			height: self.options.height,
		    wrapperClass : 'dp-swiper-wrapper',
		    slideClass : 'dp-slide',
		    onTouchEnd : function(swiper){    	
		    },
		    onSlideChangeEnd : function(swiper){
		    	var $this = $(swiper.getSlide(swiper.activeIndex));
		    	self.selected.month = $this.data('val');
		    	Fun.exec('changeYear',self.selected.year);
		    },
		    onSlideReset : function(swiper){
		    	var $this = $(swiper.getSlide(swiper.activeIndex));
		    	self.selected.month = $this.data('val');
		    	Fun.exec('changeYear',self.selected.year);
		    }
		});
		this.swipers.year = $('.dp-year',this.$root).swiper({
			mode : 'vertical',
			width: 300,
			height: self.options.height,
		    wrapperClass : 'dp-swiper-wrapper',
		    slideClass : 'dp-slide',
		    onTouchEnd : function(swiper){},
		    onSlideChangeEnd : function(swiper){
		    	var $this = $(swiper.getSlide(swiper.activeIndex));
		    	self.selected.year = $this.data('val');
		    	Fun.exec('changeYear',self.selected.year);
		    },
		    onSlideReset : function(swiper){
		    	var $this = $(swiper.getSlide(swiper.activeIndex));
		    	self.selected.year = $this.data('val');
		    	Fun.exec('changeYear',self.selected.year);
		    }
		});
		return this;
	};				
	DatePicker.prototype.setDate = function(dateStr){
		var self = this,
			dateArr = (dateStr + '').split('-'),
			dateObject = {
				Y : dateArr[0],
				m : dateArr[1],
				d : dateArr[2]
			};

		isNaN(parseInt( dateObject.Y )) && (dateObject.Y = 0);
		isNaN(parseInt( dateObject.m )) && (dateObject.m = 0);
		isNaN(parseInt( dateObject.d )) && (dateObject.d = 0);
		var yIndex = this.$root.find('.dp-year .dp-slide[data-val=' + dateObject.Y + ']').index(),
			mIndex = this.$root.find('.dp-month .dp-slide[data-val=' + dateObject.m + ']').index(),
			dIndex = this.$root.find('.dp-date .dp-slide[data-val=' + dateObject.d + ']').index();						
//console.log(dateStr,dateObject,yIndex,mIndex,dIndex);			
		this.swipers.year.swipeTo(yIndex);
		this.swipers.month.swipeTo(mIndex);
		this.swipers.date.swipeTo(dIndex);
		this.selected = {
			year : dateObject.Y,
			month : dateObject.m,
			date : dateObject.d
		};	
		Fun.exec('changeYear');
		return this;	
	};
	DatePicker.prototype.getDate = function(){	
		var self = this;
		this.selected = {
			year : $(self.swipers.year.getSlide(self.swipers.year.activeIndex)).data('val'),
			month : $(self.swipers.month.getSlide(self.swipers.month.activeIndex)).data('val'),
			date : $(self.swipers.date.getSlide(self.swipers.date.activeIndex)).data('val')
		};
		return this.selected;	
	};
})(jQuery);