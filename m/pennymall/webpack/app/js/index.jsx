var React = require('react');
var ReactDOM = require('react-dom');
var HeaderComp = require('./headerComp.jsx').HeaderComp;
var FirstGoods = require('./firstGoodsContainer.jsx').FirstGoods;
var GoodsListComp = require('./goodsListComp.jsx').GoodsListComp;
var CONFIG = require('./config.js').CONFIG;
var jsonp = require('./config.js').jsonp;
var setByUserLoginStatus = require('./config.js').setByUserLoginStatus;
var $ = require('commonjs-zepto').$;

var Index = React.createClass({
	
	getInitialState: function() {
		var _self = this;
		this.getLoginStatu();

		this.getPeriodInfo().then(function(periodData) {
			_self.setState({periodInfo: periodData});
			if (CONFIG.isLogin) {
				_self.getUserMoney().then(function(moneyData) {
					_self.setState({userMoney: moneyData.kubi ? moneyData.kubi : 0});
				});
				return {p_userinfo: CONFIG.p_userinfo, isLogin: true};
			} else {
				return {isLogin: false};
			}
		});
	},

	componentDidMount: function() {
		if (this.isMounted()){
			this.getGoodsList(function(data) {
				_self.setState({goodsList: data});
			});
		}
	},

	//获取用户登录信息
	getLoginStatu: function() {
		var _self = this;
		if (CONFIG.isApp) {
			//登录态
			setByUserLoginStatus({
				isLogin: function(userinfo){
					// 设置全局用户信息
					CONFIG.isLogin = true;
					CONFIG.p_userinfo = userinfo;
				}, 
				unLogin: function(){
					CONFIG.isLogin = false;
				}
			});
		} else {
			CONFIG.isLogin = false;
		}

	},

	//获取当前期次信息
	getPeriodInfo: function() {
		var defer = $.Deferred();
		var _self = this;
		jsonp({
			url: 'yungou/act/' + CONFIG.ygActId + '/periodicl/current',
			success: function(res) {
				console.info('ygInfo ' + JSON.stringify(res.data));
				CONFIG.periodInfo = res.data;
				defer.resolve(res.data);
			}
		});
		return defer.promise();
	},

	//获取用户酷币余额
	getUserMoney: function() {
		var defer = $.Deferred();
		var _self = this;
		jsonp({
			url: 'user/kubi',
			success: function(data) {
				// console.info('data : ' + JSON.stringify(data));
				defer.resolve(data.data);
			}
		});
		return defer.promise();
	},

	//获取当前期次的商品列表
	getGoodsList: function() {
		var _self = this;
		var defer = $.Deferred();

		jsonp({
			url: 'yungou/act/' + CONFIG.ygActId + '/record/periodicl/' + CONFIG.ygInfo.current_p,

			success: function(data) {
				console.info('data : ' + data.data);
				defer.resolve(data.data);
			}
		})
		return defer.promise();
	},

	render: function() {
		return (
			<div>
				<HeaderComp userinfo={this.state.p_userinfo} isLogin={this.state.isLogin} userMoney={this.state.money} ygInfo={this.state.ygInfo} />
				<FirstGoods {...this.state.firstGoods}/>
				
			</div>
		)
	}
})

module.exports.Index = Index;