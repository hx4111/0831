
/**
 * post.js 帖子列表组件
 * 由Poster, PostContent,PostFooter 三部分组成PostBox,然后由PostBox 列表组成 PostList 
 */
var Poster = React.createClass({displayName: "Poster",

	getInitialState: function() {
		var posterIcon = this.props.icon;
		if (!posterIcon) {
			if (this.props.avatar) {
				posterIcon = CONFIG.imgBase + 'images/icon/' + this.props.avatar + '.jpg';
			} else {
				posterIcon = CONFIG.imgBase + 'm/act/act-common/images/default_avatar.png';
			}
		}
		var posterName = this.props.nickname ? this.props.nickname : '酷酱';
		return {posterName: posterName, posterIcon: posterIcon, isPraise: this.props.praise};
	},

	praiseClick: function() {
		var isPraised = this.state.isPraise;
		var praiseData = {
			"praise_type": "posts",
            "post_id": this.props.post_id,
            "praise": isPraised ? 2 : 1,
		};
		if (this.props.reply_id) {
            ajaxData.praise_type = 'reply';
            ajaxData.reply_id = this.props.reply_id;
        }
	},

	render: function() {
		var praiseClass = this.state.isPraise ? 'iconfont icon-praise icon-praised' : 'iconfont icon-praise';
		return (
			React.createElement("div", {className: "poster-container"}, 
				React.createElement("div", {className: "poster-icon"}, React.createElement("img", {src: this.state.posterIcon, alt: "用户头像"})), 
				React.createElement("div", {className: "poster-extra"}, 
					React.createElement("strong", null, this.state.posterName), 
					React.createElement("span", {className: "praise-span"}, 
						React.createElement("i", {className: praiseClass, onClick: this.praiseClick}), 
						React.createElement("span", {"data-praised": "2"}, this.props.praise_count)
					)
				)
			)
		);
	},
});

//帖子详情/
var PostContent = React.createClass({displayName: "PostContent",
	
	propTypes: {
		postTitle: React.PropTypes.string,
		contentText: React.PropTypes.string,
		contentImgs: React.PropTypes.array,
	},

	getInitialState: function() {
		var post_title,post_text,post_imgs=[];

		if(this.props.post_rich && this.props.post_rich.length > 0) {
			for (var i=0, len=this.props.post_rich.length; i<len; i++) {
				var post_item = this.props.post_rich[i];
				if (post_item.content_type == 'text') {
					post_text = post_item.text;
				} else if (post_item.content_type == 'img') {
					post_imgs.push(post_item);
				}
			}
			post_title = this.props.post_title;
		} else {
			post_title = '';
			post_text = this.props.post_title;
		}

		return {post_title: post_title, post_text: post_text, post_imgs: post_imgs};
	},

	render: function() {
		var postTitle, contentText, contentImgs;
		var postImgWidth = Math.floor( document.body.clientWidth * 0.85 / 3);
		var postImgStr = '?imageView2/1/w/' + postImgWidth + '/h/' + postImgWidth;

		if (this.state.post_title) {
			postTitle = (React.createElement("p", {className: "post-title"}, this.state.post_title));
		}
		if (this.state.post_text) {
			contentText = (React.createElement("p", {className: "content-text"}, this.state.post_text));
		}
		if (this.state.post_imgs && this.state.post_imgs.length > 0) {
			var tempImgs = this.state.post_imgs.map(function(imgItem, i) {
				return React.createElement("img", {src: CONFIG.postImgBase + imgItem.img_url + postImgStr})
			})
			contentImgs = (React.createElement("div", {className: "content-imgs"}, tempImgs));
		}

		return (
			React.createElement("div", {className: "post-content"}, 
				postTitle, 
				contentText, 
				contentImgs
			)
		);
	},

});

//帖子底部信息/
var PostFooter = React.createClass({displayName: "PostFooter",

	render: function() {
		return (
			React.createElement("div", {className: "post-footer"}, 
				React.createElement("span", {className: "footer-time fl"}, timeTransform(this.props.update_time), " 更新"), 
				React.createElement("i", {className: "iconfont icon-reply"}), this.props.reply_count
			)
		);
	}
});

//帖子组装 /
var PostBox = React.createClass({displayName: "PostBox",

	getPostDetail: function() {
		var postId = this.props.post.post_id;

		if(CONFIG.isApp) {
			if (CONFIG.isPPTV) {
				callAppFunction('openNewBrowser', {
					url: 'http://m.comicool.cn/content/post-detail.html?post_id=' + postId,
					title: '可米酷漫画'
				});
			} else {
				callAppFunction('openPostDetail', {
					post_id: postId
				});
			}
		} else {
			//非app客户端跳转网页
			window.location.href = 'http://m.comicool.cn/content/post-detail.html?post_id=' + postId;
		}
	},

	getInitialState: function() {
		var post = this.props.post;
		var poster = this.props.poster;
		$.extend(post, poster);

		return {
			post: post
		}
	},

	render: function() {
		return (
			React.createElement("li", {className: "post-item", onClick: this.getPostDetail, "data-p": this.props.post.post_id, "data-c": this.props.poster.ccid}, 
				React.createElement(Poster, React.__spread({},  this.state.post)), 
				React.createElement(PostContent, React.__spread({},  this.state.post)), 
				React.createElement(PostFooter, React.__spread({},  this.state.post))
			)
		);
	}
});	

// var postType = null;// 传入参数
var pullLock = false;
//帖子列表组装 /
var PostList = React.createClass({displayName: "PostList",

	getInitialState: function() {
		return {post_list: [], user_list: [], postCnt: 1, postCntMsg: '加载更多'};
	},

	componentDidMount: function() {
		var _self = this;
		if (this.isMounted()) {
			var  postData = {
				postType: this.props.postType,
				comic_id: this.props.comic_id ? this.props.comic_id : 0,
				postId: 0
			};
			getPostList(postData, 20, function(data) {
				if (data.post_count && data.post_count > 0) {
					_self.setState({post_list: data.post_list, user_list: data.user_list});
					if (data.post_count < 20) {
						_self.setState({postCnt: 0, postCntMsg: '没有更多了'});
					}
				} else {
					_self.setState({postCnt: 0, postCntMsg: '没有更多了'});
				}

				if (_self.state.postCnt) {
					document.addEventListener('scroll', _self.handleScroll);
				}
			});
			
			EventEmitter.subscribe('afterNewPost', _self.emitNewPost);
		}

	},

	emitNewPost: function(data) {
		if (data) {
			var postData = {};
			if (typeof(data) == 'object') {
				postData.post_info = data.post_list[0];
				postData.user_info = data.user_list[0];
			} 
			var newData = typeof(data) == 'object' ? postData : JSON.parse(data); 
			var postArr = this.state.post_list.slice(0);
			var userArr = this.state.user_list.slice(0);
			postArr.splice(0, 0, newData.post_info);
			userArr.splice(0, 0, newData.user_info);
			this.setState({post_list: postArr, user_list: userArr});
			console.info(this.state);
		}
	},

	componentWillUnmount: function() {
		document.removeEventListener('scroll', this.handleScroll);
		EventEmitter.unSubscribe('afterNewPost');
	},

	addNews: function(ajaxRes) {
		if (ajaxRes.post_list) {
			var concatPosts = this.state.post_list.concat(ajaxRes.post_list);
			var concatUsers = this.state.user_list.concat(ajaxRes.user_list);
			this.setState({post_list: concatPosts, user_list: concatUsers});
			if (ajaxRes.post_list.length == 20) {
				this.setState({postCnt: 1, postCntMsg: '加载更多'});
			} else {
				this.setState({postCnt: 0, postCntMsg: '没有更多了'});
			}
		} else {
			this.setState({postCnt: 0, postCntMsg: '没有更多了'});
		}
	},

	handleScroll: function() {
		var threshold = document.documentElement.scrollHeight - document.documentElement.clientHeight - 99;
		var curScrollTop = document.body.scrollTop;
		var _self= this;

		if (curScrollTop >= threshold) {
			var postData = {
				postType: this.props.postType,
				comic_id: this.props.comic_id ? this.props.comic_id : 0,
				postId: this.state.post_list[this.state.post_list.length-1].post_id
			};
			getPostList(postData, 20, _self.addNews);
		}
	},

	makePostList: function() {
		var listDom = null;

		if (this.state.post_list && this.state.post_list.length > 0) {
			listDom = this.state.post_list.map(function(post, i) {
				for (var j=0, len=this.state.user_list.length; j<len; j++) {
					var userItem = this.state.user_list[j];
					if (post.ccid == userItem.ccid) {
						var postBoxData = {poster: userItem,post: post};
						return React.createElement(PostBox, React.__spread({},  postBoxData));
					}
				}
			}.bind(this));
		}

		return listDom;
	},

	render: function() {

		return (
			React.createElement("ul", {className: "post-list"}, 
				this.makePostList(), 
				React.createElement("div", {className: "postlist-footer"}, this.state.postCntMsg)
			)
		);
	}
});



/**
 * 帖子列表请求
 * @param  {[请求参数]}
 * @param  {[请求数量]}
 * @param  {请求结束后的回调函数}
 */
function getPostList(postData, page_size, callback) {
	if (pullLock) {
		return;
	}
	pullLock = true;
	$.ajax({
		url: CONFIG.ajaxBase + 'getpostlist4h5',
		dataType: 'jsonp',
		jsonpCallback: 'jsonp_getpostlist',
		data: {
			comic_id: postData.comic_id,
			include: postData.postType,
			order_type: 'update_time',
			page_direction: 2,
			post_id: postData.postId,
			page_size: page_size
		},
		success: function(data){
			pullLock = false;
			if(data) {
				callback(data);
			}
		},
		error: function(err) {
			callback(err);
		}
	})
}

/**
 * 发帖控制组件
 * 由 ControlPost(发帖按钮组件) 与 ControlTop(回到顶部按钮组件) 组成ControlBox组件
 */
var ControlPost = React.createClass({displayName: "ControlPost",

	toPost: function() {
		if(CONFIG.isApp) {
			var postData = {
				"post_type": this.props.postType, 
				"comic_id": this.props.comic_id
			};
			if (this.props.post_type == 'bet') {
				postData.league_id = this.props.league_id;
			}
			callAppFunction('setJSCallback', {'post_send_event': 'afterPost'});
			window.afterPost = function(afterPostData) {
				EventEmitter.dispatch('afterNewPost', afterPostData);
			}
			callAppFunction('openPostSend', postData);
		} else {
			//非app客户端跳转网页
			// window.location.href = 'http://m.comicool.cn/login.html';
			new TipBox({
                str: '下载可米酷App才能继续玩耍哦，看更多精彩漫画还能领奖励！', 
                btnText: ['取消', '确认'], 
                btnCallback: function() {
                    if (this.innerText == '确认') {
                    	var actCh = getCookie('actCh');
                    	var url = 'http://m.app.comicool.cn/smart_open/main.php';
                    	if (actCh) {
                    		url += '?ch=' + actCh;
                    	}
                        window.location.href = url;
                    } else {
                        return;
                    }
                }
            })

            // EventEmitter.dispatch('makePostShow');
		}
	},

	render: function() {
		return (
			React.createElement("div", {className: "ctrl-comp ctrl-post smart-tip-inst", onClick: this.toPost}, 
				React.createElement("i", {className: "iconfont icon-post"})
			)
		)
	},
});

//回到顶部控制组件//
var ControlTop = React.createClass({displayName: "ControlTop",

	toTop: function() {
		document.documentElement.scrollTop = document.body.scrollTop = 0;
	},

	render: function() {
		return (
			React.createElement("div", {className: "ctrl-comp ctrl-top", onClick: this.toTop}, 
				React.createElement("i", {className: "iconfont icon-totop"})
			)
		)
	},
});

//控制组件 //
var ControlBox = React.createClass({displayName: "ControlBox",

	getInitialState: function() {
		return {ctrlClass: 'ctrl-container'};
	},

	componentDidMount: function() {
		var _self = this;
		var postTop = document.getElementById('post-and-Ctrl').offsetTop;
		var toTopHeight = postTop - $(window).height() - 100;

		if ($(window).height() >= postTop) {
			_self.setState({ctrlClass: 'ctrl-container ctrl-show'});
		} else {
			$(window).scroll(function () {
				if ($(window).scrollTop() > toTopHeight) {
					_self.setState({ctrlClass: 'ctrl-container ctrl-show'});
				}
				if ($(window).scrollTop() < toTopHeight) {
					_self.setState({ctrlClass: 'ctrl-container'});
				}
			})
		}
	},

	render: function() {
		return (
			React.createElement("div", {className: this.state.ctrlClass}, 
        		React.createElement(ControlTop, null), 
				React.createElement(ControlPost, {postType: this.props.postType, comic_id: this.props.comic_id ? this.props.comic_id : 0})
			)
		)
	}
});

var MakePost = React.createClass({displayName: "MakePost",
	getInitialState: function() {
		return {
			showContainer: false
		};
	},

	componentDidMount: function() {
		var _self = this;
		if (!CONFIG.isApp) {
			EventEmitter.subscribe('makePostShow', function() {
				var comiUser = Comi.User.getComiUser();
				if (comiUser) {
					_self.showContainer();
				} else {
					window.location.href = 'http://m.comicool.cn/login.html'; //'http://localhost:3002/login.html';
				}
			})
		}
	},

	componentWillUnmount: function() {
		EventEmitter.unSubscribe('makePostShow');
	},

	showContainer: function() {
		CONFIG.isLogin = true;

		//弹出发帖框的时候才加载上传组件js
		if (typeof(uploadIndex) == 'undefined') {
			var pluploadJs = document.createElement('script');
			pluploadJs.src = 'http://cdn.icomicool.cn/js/plupload.full.min.js';
			document.body.appendChild(pluploadJs);

			var qiniuJs = document.createElement('script');
			qiniuJs.src = 'http://cdn.icomicool.cn/js/qiniu.min.js';
			document.body.appendChild(qiniuJs);

			var actUploadImgJs = document.createElement('script');
			actUploadImgJs.src = 'http://cdn.icomicool.cn/m/tpl/js/act-upload-img.js';
			document.body.appendChild(actUploadImgJs);
		}
		
		this.setState({showContainer: true});
	},

	hideContainer: function() {
		this.setState({
			showContainer: false
		})
	},

	postSubmit: function() {
		var _self = this;
		if (!CONFIG.isLogin) {
			window.location.href = CONFIG.rootUrl + '/login.html';
		}
		var user = Comi.User.getComiUser();
		var $btn = $('.btn-red');
		var commitTitle = $('#make-post-title').val();
		var content = $('#post-content').val();
		var postRich = [{
			"content_type": "text",
			"text": content,
		}, ];
		for (var prop in uploadImgMap) {
			if (!uploadImgMap[prop].useless) {
				postRich.push(uploadImgMap[prop]);
			}
		}
		var ajaxData = {
			"operate_type": 1,
			"post_id": 0,
			"post_type": this.props.postType,
			"ccid": user.ccid,
			"token": user.cctoken,
			"user_type": user.usertype,
			"post_title": commitTitle,
			"post_rich": JSON.stringify(postRich)
		};
		if (this.props.comic_id) {
			ajaxData.comic_id = this.props.comic_id;
		}
		var btnWord;
		jsonp({
			url: 'postcommit4h5',
			data: ajaxData,
			jsonpCallback: 'jsonp_postcommit',
			beforeSend: function() {
				console.info('beforeSend', ajaxData);
				$btn.html(function(i, v) {
					btnWord = v;
					return v + '中..';
				});
			},
			success: function(data) {
				console.info('success', data);
				if (data) {
					EventEmitter.dispatch('afterNewPost', data);
				}
			},
			error: function() {
				alert('发表失败！');
			},
			complete: function() {
				$btn.html(btnWord);
				_self.hideContainer();
			}
		});
	},

	render: function() {
		return(
			React.createElement("div", {className: "make-post-container", style: {display: this.state.showContainer ? 'block' : 'none'}}, 
				React.createElement("div", {className: "make-container"}, 
					React.createElement("div", {className: "make-header"}, 
						"发帖"
					), 
					React.createElement("div", {className: "make-main"}, 
						React.createElement("div", {className: "make-title"}, 
							React.createElement("input", {id: "make-post-title", type: "text", placeholder: "来个标题党呗(最多20字哦)"})
						), 
						React.createElement("textarea", {id: "post-content", rows: "5", placeholder: "我来说一句"}), 
						React.createElement("div", {id: "upload-container"}, 
							React.createElement("div", {className: "upload-pic", id: "upload-pic"}, 
								React.createElement("i", {className: "iconfont icon-tupian"}), 
								React.createElement("span", null, "图片")
							)
						), 
						React.createElement("div", {className: "add-img-btn", id: "fsUploadProgress"})
					), 
					React.createElement("div", {className: "make-post-submit"}, 
						React.createElement("a", {className: "btn-red", id: "make-post-send", onClick: this.postSubmit}, "发布"), 
						React.createElement("span", {className: "text-counter"}, "0/1500")
					)
				), 
				React.createElement("div", {className: "make-bg", onClick: this.hideContainer})
			)
		)
	}
})

var PostAndCtrl = React.createClass({displayName: "PostAndCtrl",

	render: function() {
		return(
			React.createElement("div", {className: "PostAndCtrl"}, 
				React.createElement("div", {id: "make-post"}, 
					React.createElement(MakePost, React.__spread({},  this.props))
				), 
				React.createElement("div", {id: "post-container"}, 
					React.createElement(PostList, React.__spread({},  this.props))
				), 
				React.createElement("div", {id: "control-btn"}, 
					React.createElement(ControlBox, React.__spread({},  this.props))
				)
			)
		)
	}
});


