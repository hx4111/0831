/*
Template Name: Optimal
Author: <a href="http://www.os-templates.com/">OS Templates</a>
Author URI: http://www.os-templates.com/
Licence: Free to use under our free template licence terms
Licence URI: http://www.os-templates.com/template-terms
File: Back to Top JS
*/

jQuery("#backtotop").click(function() {
	jQuery("body,html").animate({
		scrollTop: 0
	}, 600);
});
jQuery(window).scroll(function() {
	if (jQuery(window).scrollTop() > 150) {
		jQuery("#backtotop").addClass("visible");
	} else {
		jQuery("#backtotop").removeClass("visible");
	}
});


//获取漫画详情
function goChapter(comic_id,title) {
	$.ajax({
		type: "post",
		data: {
			'comic_id': comic_id
		},
		url: "http://proxy.icomico.com/comicdetail4h5",
		jsonpCallback: "jsonp_comicdetail",
		dataType: 'jsonp',
		success: function(data) {
			var num = data.ep_list.length-1;
			for (var i = num;i>=0; i--) {
				$("#chapter ul").append("<a href='http://comicool.cn/content/reader.html?comic_id="+comic_id+"&ep_id=" + data.ep_list[i].ep_id + "' target='_blank'>" + data.ep_list[i].ep_title + "</a>")
			}
			$("#chapter h2").html("<a href='http://comicool.cn/content/reader.html?comic_id="+comic_id+"&ep_id=" + data.ep_list[num].ep_id + "' target='_blank'>" +title+"最新话" + data.ep_list[num].ep_title+ "</a>")
		}
	});
}