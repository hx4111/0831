var React = require('react');
var CONFIG = require('./config.js').CONFIG;
var callAppFunction = require('./config.js').callAppFunction;

var FirstGoods = React.createClass({

	getInitialState: function() {
		return {soldCnt: 0, surplusCnt: 100, myBuyCnt: 0};
	},

	render: function() {
		return (
			<div className="first-container">
				<div className="first-goods">
					<img src="images/1.jpg" alt="大额精美商品,只需100酷币就有机会抢得" />
				</div>
				<div className="first-goods-pannel">
					<div className="first-pannel">
						<div className="sell-cnt"></div>
					</div>
					<div className="first-pannel-text">
						<div className="text-left">
							<p className="sold-cnt">{this.state.soldCnt}</p>
							<p>已售份数</p>
						</div>
						<div className="text-right">
							<p className="all-cnt">{this.state.surplusCnt}</p>
							<p>剩余份数</p>
						</div>
					</div>
				</div>
				<div className="first-buy-btn">
					<img src="images/first-buy-btn.png" alt="点击抢购" />
				</div>
				<div className="first-buy-cnt">您已夺取 {this.state.myBuyCnt} 份</div>
			</div>
		);
	}
})

module.exports.FirstGoods = FirstGoods;
