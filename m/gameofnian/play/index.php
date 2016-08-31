<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>年兽来袭，勇者集结</title>
    <link rel="icon" type="image/GIF" href="res/favicon.ico"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="full-screen" content="yes"/>
    <meta name="screen-orientation" content="portrait"/>
    <meta name="x5-fullscreen" content="true"/>
    <meta name="360-fullscreen" content="true"/>
    <style>
    body {margin: 0;padding: 0;background: #000;}
        body, canvas, div {
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            -khtml-user-select: none;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        .bdshare-button-style0-32 a {text-indent:initial !important;background:#D40505 !important;text-decoration: none;width: 2rem !important;line-height: 2rem !important;height: 2rem !important;font-size:1.4rem;border-radius: 100%;text-align: center;color: #fff !important;}
       .bdsharebuttonbox{ 
  margin: auto;  
  position: absolute;  
  top:60%; left: 50%;  
  -webkit-transform: translate(-50%,-50%);  
      -ms-transform: translate(-50%,-50%);  
          transform: translate(-50%,-50%);}

@-webkit-keyframes rotate_pacman_half_down {
  0% {
    -webkit-transform: rotate(90deg);
            transform: rotate(90deg); }

  50% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg); }

  100% {
    -webkit-transform: rotate(90deg);
            transform: rotate(90deg); } }

@keyframes rotate_pacman_half_down {
  0% {
    -webkit-transform: rotate(90deg);
            transform: rotate(90deg); }

  50% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg); }

  100% {
    -webkit-transform: rotate(90deg);
            transform: rotate(90deg); } }

@-webkit-keyframes pacman-balls {
  75% {
    opacity: 0.7; }

  100% {
    -webkit-transform: translate(-100px, -6.25px);
            transform: translate(-100px, -6.25px); } }

@keyframes pacman-balls {
  75% {
    opacity: 0.7; }

  100% {
    -webkit-transform: translate(-100px, -6.25px);
            transform: translate(-100px, -6.25px); } }

.pacman {
  position: relative; 
        left:35%;
  }
  .pacman > div:nth-child(2) {
    -webkit-animation: pacman-balls 1s 0s infinite linear;
            animation: pacman-balls 1s 0s infinite linear; }
  .pacman > div:nth-child(3) {
    -webkit-animation: pacman-balls 1s 0.33s infinite linear;
            animation: pacman-balls 1s 0.33s infinite linear; }
  .pacman > div:nth-child(4) {
    -webkit-animation: pacman-balls 1s 0.66s infinite linear;
            animation: pacman-balls 1s 0.66s infinite linear; }
  .pacman > div:nth-child(5) {
    -webkit-animation: pacman-balls 1s 0.99s infinite linear;
            animation: pacman-balls 1s 0.99s infinite linear; }
  .pacman > div:first-of-type {
    width: 0px;
    height: 0px;
    border-right: 25px solid transparent;
    border-top: 25px solid #fff;
    border-left: 25px solid #fff;
    border-bottom: 25px solid #fff;
    border-radius: 25px;
    -webkit-animation: rotate_pacman_half_up 0.5s 0s infinite;
            animation: rotate_pacman_half_up 0.5s 0s infinite; }
  .pacman > div:nth-child(2) {
    width: 0px;
    height: 0px;
    border-right: 25px solid transparent;
    border-top: 25px solid #fff;
    border-left: 25px solid #fff;
    border-bottom: 25px solid #fff;
    border-radius: 25px;
    -webkit-animation: rotate_pacman_half_down 0.5s 0s infinite;
            animation: rotate_pacman_half_down 0.5s 0s infinite;
    margin-top: -50px; }
  .pacman > div:nth-child(3), .pacman > div:nth-child(4), .pacman > div:nth-child(5), .pacman > div:nth-child(6) {
    background-color: #fff;
    width: 15px;
    height: 15px;
    border-radius: 100%;
    margin: 2px;
    width: 10px;
    height: 10px;
    position: absolute;
    -webkit-transform: translate(0, -6.25px);
        -ms-transform: translate(0, -6.25px);
            transform: translate(0, -6.25px);
    top: 25px;
    left: 100px; }

@-webkit-keyframes cube-transition {
  25% {
    -webkit-transform: translateX(50px) scale(0.5) rotate(-90deg);
            transform: translateX(50px) scale(0.5) rotate(-90deg); }

  50% {
    -webkit-transform: translate(50px, 50px) rotate(-180deg);
            transform: translate(50px, 50px) rotate(-180deg); }

  75% {
    -webkit-transform: translateY(50px) scale(0.5) rotate(-270deg);
            transform: translateY(50px) scale(0.5) rotate(-270deg); }

  100% {
    -webkit-transform: rotate(-360deg);
            transform: rotate(-360deg); } }

@keyframes cube-transition {
  25% {
    -webkit-transform: translateX(50px) scale(0.5) rotate(-90deg);
            transform: translateX(50px) scale(0.5) rotate(-90deg); }

  50% {
    -webkit-transform: translate(50px, 50px) rotate(-180deg);
            transform: translate(50px, 50px) rotate(-180deg); }

  75% {
    -webkit-transform: translateY(50px) scale(0.5) rotate(-270deg);
            transform: translateY(50px) scale(0.5) rotate(-270deg); }

  100% {
    -webkit-transform: rotate(-360deg);
            transform: rotate(-360deg); } }
            
    #loadingDiv {position:absolute;top:45%;
        background:#000;
        line-height: 4rem;
        width: 100%;
        overflow: hidden;
        color: #fff;text-align: center;justify-content: center;align-items: center;font-size:.7rem;}        

    </style>
    <script src="http://m.comicool.cn/m-common/js/app.js"></script>
    <script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
    <script src="http://m.comicool.cn/gameofnian/js/script.js" type="text/javascript" charset="utf-8"></script>
    <script src="../js/script.js" type="text/javascript" charset="utf-8"></script>
    <link rel="stylesheet" type="text/css" href="//at.alicdn.com/t/font_1454406524_9916961.css"/>
</head>
<body>
		<!-- 一般化分享 -->
		<h1 class="thumbnails" style="display:none">
        年兽来袭，勇者集结
        <p>可米酷大陆惨遭年兽蹂躏，勇者集结，传说中的勇者就是我？</p>
        <img src="http://cdn.icomicool.cn/m/gameofnian/images/wxshare.jpg">
    </h1>
    <div id="loadingDiv">
    	    <div class="loader-inner pacman">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
    	抽打勇者起床中，稍事等待</div>
<script type="text/javascript" >
    <?php
    $q = $_REQUEST['q'];
    if(empty($q))
    {
        header("location:../");die();
    }
     ?>
     var shareKey=conkey+"&decoration="+deckey+"&equip="+equkey+"&skill="+skillkey,
		 randomItem="http://m.comicool.cn/gameofnian/adventure.html?content="+shareKey,
		 randomItem2="http://m.comicool.cn/gameofnian/convert.html?content="+shareKey,
		 randomItem3="http://m.comicool.cn/gameofnian/newBrave.html?content="+shareKey;
    var DynamicData = {
        danmu : [
            <?php  if($q == '1'){ ?>
            "卧槽这个年兽居然有替身？我情不自禁的摆出了JOJO立……"
            ,"等等，猴子是主角吧？难道勇者是反派？"
            ,"喂喂喂，勇者你个禽兽，年兽它只是个孩子啊！"
            ,"……我和猴子撞衫了!! (((ﾟДﾟ;)))"
            ,"看到棍子就觉得好污的我一定是哪里坏掉了( º﹃º )( º﹃º )( º﹃º )"
            <?php  }else if ($q== '2'){ ?>
            "好萌好萌~~两只都想抱回家！(✪ω✪)(✪ω✪)"
            ,"(╬ﾟдﾟ)居然对喵星人出手！放学憋走！小卖部来战！"
            ,"我觉得我需要2个大师球！ლ(╯⊙ε⊙ლ╰)"
            ,"这体位逆我的CP！(#`皿´)明明应该是小白X 小黑"
            ,"伸手党求某宝链接，我也要给自己家主子置办一套"
            <?php  }else if ($q== '3'){ ?>
            "_(°ω°｣ ∠)……这是年兽组团刷勇者吧！？对面绝壁是五人黑23333"
            ,"这一定是传说中的六神合体的雷霆王wwww，咦，暴露年龄了"
            ,"只有我一个人在思考哪个才是正体么……"
            ,"视线完全无法离开蜥蜴的蛋蛋了怎么办"
            ,"一口气来5只，伙食费惊人啊，这是要把人吃穷的节奏啊……"
            <?php  } ?>
        ],
        endDanmu:[
            "<?php
             $endDanmuList = array(
             "地球君又悲剧了吧。哈哈哈哈"
             ,"左线弹幕太薄！"
             ,"少年，好一发以炮会友！"
            ,"吃我一记大电磁炮！"
            ,"我有一种肯定帅不过三秒的预感。"
            ,"坐看官方打脸~"
            ,"哦哦哦！前方高能！紧急回避！"
            ,"回来画风都不一样了，这一定是我打开的方式不对！"
             );
             shuffle( $endDanmuList );
             $a = array_slice($endDanmuList,0,5);
             echo implode("\",\"",$a);
             ?>"
        ],
        nianshouType: "<?php if($q=='1'){ echo 'A'; }else if($q=='2'){ echo 'B';} else if ($q=='3'){echo 'C'; } ?>",
        shareTitle: "可米酷新春勇者传说",
        shareContent: "可米酷大陆惨遭年兽蹂躏，勇者集结，传说中的勇者就是我？",
        shareContentWeibo: "可米酷大陆惨遭年兽蹂躏，勇者集结，传说中的勇者就是我？",
        shareURL :randomItem,
        sharePic : "http://cdn.icomicool.cn/m/gameofnian/images/wxshare.jpg",
        endURL : randomItem2
        ,fashuHurt:[
            "“古娜拉黑暗之神-拉沙卡拉-变污术！”你对年兽使出了禁断的黑暗秘法，空间中，不断回荡着魔性的天之音嘿~嘿~嘿，嘿~嘿~嘿。年兽遭到了【随机值=伤害数字】的精神创伤。",
            "你打开了某宝，大喝一声“大投食术！”，一大波鸭脖橘子苹果牛肉干肉松饼巧克力薯片威化饼鱼豆腐疯狂的涌入年兽张开的大口中，你的钱包大破，年兽体重+20%，进入肥胖状态，生命值-【随机值=伤害数字】。",
            "“飞龙探云手”一声大喝，年兽的钱包落入了你手，面对如此阴险的招数，年兽陷入了无尽的绝望……年兽脆弱的小心脏受到了【随机值=伤害数字】的伤害。"
        ]
        ,zhandouHurt:[
            "你对准年兽用力劈出一剑，却被年兽轻松闪开，还好剑不小心碰到了隔壁王叔叔的花盆砸中了年兽的脚趾。造成了【随机值=伤害数字】的伤害。",
            "你奋力一跃，使出一道纵。几缕绒毛以秒速5cm从年兽的身上缓缓飘落，虽然仅造成了【随机值=伤害数字】的伤害，但年兽的颜值受到造成了2000点的暴击，进入了短暂的石化状态！干得漂亮！",
            "你使出了一招漂亮的回旋斩，风中你优美而的身姿，飘逸的步伐，迷离的眼神，征服了众人，更征服了年兽，年兽竟忘记了闪躲，年兽对你的好感度+20，收到了【随机值=伤害数字】伤害。"
        ]
        ,yongshiHurt:[
            "年兽对你发起了攻击，锐利的一爪，在你的上衣上留下了画上了I love 人类的座右铭。了不起的艺术天分！对你这种艺术白痴造成了【随机值=伤害数字】点伤害。",
            "年兽对你发起了攻击，你以敏捷的步伐躲开了愤怒的一击，却忽略了年兽悄悄放在地面上的香蕉皮，重重摔倒在地。远远传来年兽得意的笑声，我可是玩陷阱流的！你的自信心-10，生命值-【随机值=伤害数字】",
            "年兽对你发起了攻击，正中你的膝盖，对你造成了你【随机值=伤害数字】点伤害。年兽正想发动连击时。机智如你，从掏出了怀中珍藏已久的昆特牌，“来盘昆特牌吧！”，强制结束了这一回合。不愧是勇者，如此卑鄙智慧！"
        ]
    };
if (!isApp) {
	DynamicData.endURL=randomItem3;
}
</script>
<canvas id="gameCanvas" width="480" height="720"></canvas>
<script>
    (function () {
        var nav = window.navigator;
        var ua = nav.userAgent.toLowerCase();
        var uaResult = /android (\d+(?:\.\d+)+)/i.exec(ua) || /android (\d+(?:\.\d+)+)/i.exec(nav.platform);
        if (uaResult) {
            var osVersion = parseInt(uaResult[1]) || 0;
            var browserCheck = ua.match(/(qzone|micromessenger|qqbrowser)/i);
            if (browserCheck) {
                var gameCanvas = document.getElementById("gameCanvas");
                var ctx = gameCanvas.getContext('2d');
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, 1, 1);
            }
        }
    })();
</script>
<!--<script cocos src="game.min.js" id="gameJsLoading"></script>-->
<div id="overlay" style="display:none;">
    <div class="bdsharebuttonbox" data-tag="share_1">
        <a class="iconfont icon-qzone" data-cmd="qzone" href="#"></a>
        <a class="iconfont icon-xinlangweibo" data-cmd="tsina"></a>
        <!--<a class="iconfont icon-weixin" data-cmd="weixin"></a>-->
        <!--<a class="iconfont icon-qqkongjian" data-cmd="tqq"></a>-->
    </div>
</div>
<script>
loadCocosScript("game.min.js",function(){
	var loadingDiv=document.getElementById("loadingDiv");
	loadingDiv.style.display="none";
})
function loadCocosScript(url, callback){
    var script = document.createElement ("script")
    script.type = "text/javascript";
    script.cocos = true;
    if (script.readyState){ //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" || script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function(){
            callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

    function callWebShare()
    {
        document.getElementById("overlay").style.display = "block";
        window.onblur= function () {
            document.getElementById("overlay").style.display = "none";
            window.onblur=null;
        }
    }
    window._bd_share_config = {
        common: {
            bdText: DynamicData.shareTitle,
            bdDesc: DynamicData.shareContent,
            bdUrl: DynamicData.shareURL,
            bdPic: DynamicData.sharePic
        },
        share: [{
            "bdSize": 32
        }]
    };
    with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5)];
</script>
</body>
</html>
