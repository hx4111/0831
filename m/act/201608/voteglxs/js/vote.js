
var PraiseFun = {
	getPraiseId: function() {
		return 'voteglxs'; 
	},

	getSign: function(obj) {
		var sign = '';
		for (key in obj) {
			sign += key + ':' + obj[key] + '|';
		}

		return hex_md5(sign.slice(0, -1));
	},

	getPraiseCnt: function(callback) {
		$.ajax({
			url: 'http://www.comicool.cn/api/vote.php',
			dataType: 'jsonp',
			data: {
				api: 'getVote',
				sign: this.getSign({id: this.getPraiseId()}),
				id: this.getPraiseId(),
			},
			jsonpCallback: 'jsonp_getPraiseCnt',
			success: function(data) {
				if (data && data.results) {
					callback && callback(data.results);
				}
			}
		})
	},

	doPraise: function(pid) {
		var dataObj = {};
		dataObj.api = 'handleVote';
		dataObj.id = this.getPraiseId();
		if (pid != null) {
			dataObj.pid = pid;
			dataObj.sign = this.getSign({id: this.getPraiseId(), pid: pid});
		} else {
			dataObj.sign = this.getSign({id: this.getPraiseId()});
		}

		var defer = $.Deferred();
		$.ajax({
			url: 'http://www.comicool.cn/api/vote.php',
			dataType: 'jsonp',
			data: dataObj,
			jsonpCallback: 'jsonp_doPraise',
			success: function(data) {
				defer.resolve(data.results);
			}
		})

		return defer.promise();
	},

	getAct: function() {
		var defer = $.Deferred();

		$.ajax({
			url: 'http://www.comicool.cn/api/vote.php',
			dataType: 'jsonp',
			data: {
				api: 'getAct',
				sign: this.getSign({id: this.getPraiseId()}),
				id: this.getPraiseId(),
			},
			jsonpCallback: 'jsonp_getAct',
			success: function(data) {
				console.info(data);
				if (data.results.ret == 0) {
					defer.resolve(data.results);
				}
			}
		})
		return defer.promise();
	}
}

/**
* Vote
* 参数 obj {arrLength(投票个数)} , render 渲染函数
**/
function Vote(obj, render) {
	this.arrLength = obj.arrLength;
	var voteArr = new Array(this.arrLength);
	var votePercent = new Array(this.arrLength);

	for (var i = 0; i < this.arrLength; i++) {
		voteArr[i] = 0;
		votePercent[i] = 0;
	}

	this.voteArr = voteArr;
	this.votePercent = votePercent;
	this.renderFun = render;
	this.init(render);
	return this;
}

Vote.prototype.init = function() {
	var _self = this;
	PraiseFun.getAct().then(function(data) {
		if (data.data && data.data.length > 0) {
			for (var i = 0; i < data.data.length; i++) {
				var item = data.data[i];
				_self.voteArr[Number(item.pid)] = Number(item.up);
			}
		}
		_self.getVotePercent();
		_self.renderFun && _self.renderFun(_self.voteArr, _self.votePercent);
	})
}

Vote.prototype.getAllVoteCnt = function() {
	var voteAllCnt = 0;
	for (var i = 0; i < this.voteArr.length; i ++) {
		voteAllCnt += this.voteArr[i];
	}
	return voteAllCnt;
}

Vote.prototype.getVotePercent = function() {
	var voteAllCnt = this.getAllVoteCnt();

	if (voteAllCnt) {
		for (var i = 0; i < this.arrLength; i++) {
			this.votePercent[i] = (this.voteArr[i] / voteAllCnt * 100).toFixed(2);
		}
	}
}
