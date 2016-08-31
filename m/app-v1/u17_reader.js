(function() {
	var udown = document.querySelector("#down_app"),
		umtitle = document.querySelector("#m_r_title"),
		upanelbox = document.querySelector("#m_r_panelbox"),
		um_r_imgbox = document.querySelector("#m_r_imgbox"),
		inner = document.getElementsByClassName("inner")[0],
		unext = document.querySelector("#loadNextChapter"),
		uprev = document.querySelector("#loadPrevChapter"),
		ctrlHelp = document.querySelector("#ctrl_help"),
		drag_up = document.getElementsByClassName("drag_up")[0],
		upanelbox = document.querySelector("#effect_top"),
		click_effect_event = document.querySelector("#click_effect_event"),
		effect_name = document.querySelector("#effect_name");
	click_effect_event.removeAttribute("ontouchstart");
	upanelbox.removeAttribute("onclick");
	ctrlHelp.removeAttribute("id");
	drag_up.removeAttribute("onclick");
	upanelbox.style.display = effect_name.style.display = "none"
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
	var udownlink = um_r_imgbox.getElementsByTagName("div");
	var uload = um_r_imgbox.getElementsByClassName("noLoad");
	for (var i = 0; i < udownlink.length; i++) {
		var num = null;
		num = udownlink[i].getAttribute("style");
		if (num == "z-index:12000;position:relative;") {
			udownlink[i].style.display = "none";
		}

	}
	for (var i = 0; i < uload.length; i++) {
		uload[i].click();

	}
	udown.style.display = "none";
	umtitle.style.display = "none";
	upanelbox.style.display = "none";
	uprev.style.display = "none";
	unext.style.display = "none";
	unext.innerHTML = "";
})();