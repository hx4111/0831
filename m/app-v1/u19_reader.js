(function() {
	try {
		var list = document.getElementById("list");
		var ListLi = list.getElementsByTagName("li");
		for (var i = 0; i < ListLi.length; i++) {
			if (ListLi[i].id.indexOf("ad_li") !== -1) {
				ListLi[i].style.display = "none"
			}
		}

		var effect = document.getElementById("effect");
		var ctrl_help = document.getElementById("ctrl_help");
		var the_start = document.getElementById("the_start");
		var inner = document.getElementsByClassName("inner")[0];
		var click_effect_event = document.getElementById("click_effect_event");
		effect.removeAttribute("id");
		ctrl_help.removeAttribute("id");
		the_start.removeAttribute("id");
		click_effect_event.removeAttribute("ontouchstart");
		click_effect_event.removeAttribute("id");
		list.removeAttribute("id");
		$(window).unbind('scroll');
		var oHead = document.getElementsByTagName("head")[0];
		var oScript = oHead.getElementsByTagName("script");
		for (var i = 0, len = oScript.length; i < len; i++) {
			if (oScript[i].src.indexOf("dropload") !== -1) {
				oScript[i].src = "";
			}
		}
		inner.style.overflowY = "inherit";
		$(window).unbind('scroll');
		$(window).scroll(function() {
			var argobj = {
				"content_height": document.body.scrollHeight,
				"scrolly": document.body.scrollTop
			};
			var argsString = JSON.stringify(argobj);
			comicool.onWebPageScroll(argsString);
		});
	} catch (e) {}
})();