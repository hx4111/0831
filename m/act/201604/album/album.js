/*
                   _ooOoo_
                  o8888888o
                  88" . "88
                  (| -_- |)
                  O\  =  /O
               ____/`---'\____
             .'  \\|     |//  `.
            /  \\|||  :  |||//  \
           /  _||||| -:- |||||-  \
           |   | \\\  -  /// |   |
           | \_|  ''\---/''  |   |
           \  .-\__  `-`  ___/-. /
         ___`. .'  /--.--\  `. . __
      ."" '<  `.___\_<|>_/___.'  >'"".
     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
     \  \ `-.   \_ __\ /__ _/   .-` /  /
======`-.____`-.___\_____/___.-`____.-'======
                   `=---='
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
       佛祖保佑       永无BUG  By:Chace
*/
var reader = {
	hideToast: function() {
		var alert = document.getElementById("toast");
		alert.style.opacity = 0;
		clearInterval(intervalCounter);
	},
	drawToast: function(message) {
		var alert = document.getElementById("toast");
		if (alert == null) {
			var toastHTML = '<div id="toast">' + message + '</div>';
			document.body.insertAdjacentHTML('beforeEnd', toastHTML);
		} else {
			alert.remove();
			reader.drawToast(message);
		}
		intervalCounter = setInterval("reader.hideToast()", 2000);
	},
	dateGo: function(today, page) {
		var myDate = new Date();
		if (myDate.getDate() >= today) {
			window.location.href = "http://m.comicool.cn/act/201604/album/" + page + "/index.html"
		} else {
			reader.drawToast("4月" + today + "日正式开启!");
		};
	},
	readerGo: function(ccid) {
		if (isApp) {
			callAppFunction('openEpisodeReaderPage', {
				comic_id: ccid,
				ep_id: 1
			});
		} else {
			window.location.href = 'http://m.comicool.cn/content/reader.html?comic_id=' + ccid + '&ep_id=1';
		}
	}
}

function initBaiduSharePanel() {
	var _ = function(selector, parent) {
			return (parent || document).querySelector(selector);
		},
		header = _('.header'),
		trigger = _('.icon-share', header),
		mask = _('#ShareBg'),
		panel = _('.bdsharebuttonbox'),
		cancelBtn = _('.share-clo', panel),
		panelTitle = _('#ShareCon h2'),
		panelImageCont = _('#ShareCon em'),
		panelImage = new Image(),
		hidePanel = function() {
			mask.style.display = panel.style.display = 'none';
		};
	header.style.display = 'block';
	panelTitle.innerHTML = this.title;
	panelImage.src = this.imageUrl;
	panelImageCont.appendChild(panelImage);
	trigger.addEventListener('click', function() {
		mask.style.display = panel.style.display = 'block';
	});
	mask.addEventListener('click', hidePanel);
	cancelBtn.addEventListener('click', hidePanel);
	if (isApp || isWeixin || isQQ || isWeibo) {
		header.style.display = 'none';
	}
}
$(function() {
	var oVideo = $("#video");
	var flag = true;
	oVideo.on("click", function() {
		if (flag) {
			oVideo.get(0).play();
			flag = false;
		} else {
			oVideo.get(0).pause();
			flag = true;
		}
	})
})

//取得cookie    
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';'); //把cookie分割成组    
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i]; //取得字符串    
		while (c.charAt(0) == ' ') { //判断一下字符串有没有前导空格    
			c = c.substring(1, c.length); //有的话，从第二位开始取    
		}
		if (c.indexOf(nameEQ) == 0) { //如果含有我们要的name    
			return unescape(c.substring(nameEQ.length, c.length)); //解码并截取我们要值    
		}
	}
	return false;
}
//清除cookie    
function clearCookie(name) {
	setCookie(name, "", -1);
}
//设置cookie    
function setCookie(name, value, seconds) {
	seconds = seconds || 0; //seconds有值就直接赋值，没有为0，这个根php不一样。    
	var expires = "";
	if (seconds != 0) { //设置cookie生存时间    
		var date = new Date();
		date.setTime(date.getTime() + (seconds * 1000 * 360 * 24 * 365));
		expires = "; expires=" + date.toGMTString();
	}
	document.cookie = name + "=" + escape(value) + expires + "; path=/"; //转码并赋值    
}