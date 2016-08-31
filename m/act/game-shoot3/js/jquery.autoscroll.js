(function($){
    function AutoScroll( $this , options ){
        var timer = null;
        $this.hover(function(){
            clearInterval(timer);
        },function() {
            timer = setInterval(function() {
                var $li = $this.find('li:first') , height = $li.height();
                $li.stop().animate({'margin-top' : - height + 'px'}, options.animate , function() {
                    $li.css('margin-top', 0).appendTo( $this );
                    if( options.scrollEnd && typeof options.scrollEnd === 'function'){
                        options.scrollEnd();
                    }
                })
            }, options.interval);
        });
        if( options.auto ){
        	setTimeout(function(){
        		$this.trigger('mouseleave');	
        	}, options.delay);        	
        }
    }
    $.fn.extend({
        autoScroll : function( opts ){
            var options = $.extend({
                interval : 2000 ,
                animate : 800 ,
                auto : true,
                delay : 3000,
                scrollEnd : $.noop
            },opts);

            $(this).each(function(){
	            if( !$(this).data('autoScroll') ){ 
	            	new AutoScroll($(this),options);
	            	$(this).data('autoScroll',true);
	        	}
            });
        }
    });
})(jQuery);