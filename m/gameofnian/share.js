var shares=null;
var Intent=null,File=null,Uri=null,main=null;

/**
 * 更新分享服务
 */
function updateSerivces(){
	plus.share.getServices( function(s){
		shares={};
		for(var i in s){
			var t=s[i];
			shares[t.id]=t;
		}
		shareInit();
		
	}, function(e){
		console.log( "获取分享服务列表失败："+e.message );
	} );
}


/**
   * 发送分享消息
   * @param {plus.share.ShareService} 
   */
  
function shareMessage(s,ex){
	var msg={content:"分享的内容",extra:{scene:ex}};
	msg.href='分享的链接';//推荐链接
	msg.title='标题';//分享的链接标题
	msg.content='描述';//分享的链接描述
	msg.thumbs=["images/homain-logo.png"];
	msg.pictures=["images/homain-logo.png"];
//	console.log(JSON.stringify(msg));
	s.send( msg, function(){
		
		//分享成功后关闭页面
		var ws  = plus.webview.getWebviewById("news.con.share.html");
		 plus.webview.close( ws);

		plus.nativeUI.toast('分享成功，感谢您的分享！');
		console.log( "分享到\""+s.description+"\"成功！ " );
	}, function(e){
		console.log( "分享到\""+s.description+"\"失败: "+e.code+" - "+e.message );
	} );
}


// 打开分享
function shareInit(){
	bhref=false;
	var ids=[{id:"weixin",ex:"WXSceneSession"},{id:"weixin",ex:"WXSceneTimeline"},{id:"sinaweibo",ex:"xinlangshare"},{id:"tencentweibo",ex:"tengxunshare"}];
	var bts=[{title:"发送给微信好友"},{title:"分享到微信朋友圈"},{title:"分享到新浪微博"},{title:"分享到腾讯微博"}];
	if(plus.os.name=="iOS"){
		ids.push({id:"qq",ex:"qqshare"});
		bts.push({title:"分享到QQ"});
	
	}
	
	
//	console.log(ids);
	var html="";
	for(var i in ids){
		
		html+='<li><a class="mui-share" href="javascript:;" data-id="'+ids[i].id+'" data-ex="'+ids[i].ex+'"><div><img src="../images/'+ids[i].ex+'.jpg"></div><h1>'+bts[i].title+'</h1></a></li>';
	}
//	console.log(html);
	//alert(html);
	$(".open-share ul").append(html);
}

/**
   * 分享操作
   * @param {String} id
   */
function shareAction(id,ex) {
	var s=null;
	if(!id||!(s=shares[id])){
		console.log("无效的分享服务！");
		return;
	}
	if ( s.authenticated ) {
		console.log("---已授权---");
		shareMessage(s,ex);
	} else {
		console.log("---未授权---");
		s.authorize( function(){
				shareMessage(s,ex);
			},function(e){
			console.log( "认证授权失败："+e.code+" - "+e.message );
		});
	}
}