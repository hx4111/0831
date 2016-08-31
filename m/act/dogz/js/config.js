/**
 * Created by 郝旭 on 2016/3/15.
 */

//测试：http://comicool.cn:8000/
//正式：http://api.comicool.cn/

var DogzConfig = {
    baseurl: "http://api.comicool.cn/",
    cycle_id: 0
}

//渠道号是test调用测试接口
if (isInternal()) {
    DogzConfig.baseurl = 'http://comicool.cn:8000';
}
//if (location.hostname.indexOf('192.168') != -1) {
//    DogzConfig.baseurl = 'http://comicool.cn:8000';
//}

function getByAjax(ajaxConfig) {
    $.ajax({
        url: ajaxConfig.url,
        dataType: 'jsonp',
        beforeSend: function() {
            $('.loading-spinner').show();
            if (ajaxConfig.beforeSend && ajaxConfig.beforeSend() === false) {//如果填写了beforSend且返回值为false
                return false;
            }
        },
        success: ajaxConfig.success,
        complete: function() {
            ajaxConfig.complete && ajaxConfig.complete();
            $('.loading-spinner').hide();
        },
    });
}