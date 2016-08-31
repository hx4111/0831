
$(function(){
    $('body').addClass('animate-countdown');
    var step1 = $('body').hasClass('animate-countdown');
    if(step1) {
        setTimeout(function() {
            $('.countdown').hide();
        },4000)
    }
    
    //点击按钮后的一系列动画播放,也可以用css3控制各块动画的延迟时间，连接起来
    $('.red-btn-inner').on('click',function(){
        $(this).hide();
        $('body').removeClass('animate-countdown').addClass('animate-shake');
        var step2 = $('body').hasClass('animate-shake');
        if(step2) {
            setTimeout(function() {
                $('body').removeClass('animate-shake').addClass('animate-shoot');
                var step3 = $('body').hasClass('animate-shoot');
                if(step3) {
                    setTimeout(function() {
                        $('body').addClass('animate-drop');
                        var step4 = $('body').hasClass('animate-drop');
                        if(step4) {
                            setTimeout(function() {
                                $('body').addClass('animate-num');
                            },2500); //金币掉落时间
                        }
                    },2500); //单个红包飞出时间
                }
            },1500); //红包整体抖动时间
        };
    });

});

