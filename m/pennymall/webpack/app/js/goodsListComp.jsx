var React = require('react');

var GoodsListComp = React.createClass({

	render: function() {
		var goodsList = null;
		if (this.props.normalGoodsList) {
			goodsList = this.props.normalGoodsList.map(function(detail, i) {
				return (
					<li className="goods-detail">
						<div className="goods-left">
							<img src="images/1.jpg" alt="商品图片" />
							<div className="goods-pannel">
								<div className="sell-cnt"></div>
							</div>
							<div className="goods-pannel-text">
								<div className="text-left">
									<p className="sold-cnt">{detail.soldCnt}</p>
									<p>已售份数</p>
								</div>
								<div className="text-right">
									<p className="all-cnt">{detail.surplusCnt}</p>
									<p>剩余份数</p>
								</div>
							</div>
						</div>
						<div className="goods-right">
							<p className="goods-name">手办商品</p>
							<p className="goods-value">价值: ￥{detail.money}元</p>
							<div className="go-btn">
								<img src="images/go-btn.png" alt="立即购买" />
							</div>
						</div>
					</li>
				);
			})
		}

		return (
			<div className="nav-container" id="nav-tabs">
				<nav className="nav-list hd">
					<ul className="list-unstyled nav-inner">
						<li>探宝商品</li>
						<li>获奖信息</li>
						<li>活动规则</li>
					</ul>
				</nav>
				<div className="nav-content bd" id="nav-content-bd">
					<div>
						<ul className="goods-list">
							{goodsList ? goodsList : (<div>敬请期待</div>)}
						</ul>
					</div>
					<div>
						<div className="prize-container">
							<div className="prize-top-pannel">
								<span className="border-span">我的出价记录</span>
								<span className="border-span">上期云购结果</span>
							</div>
							<div className="bold-container">
								<p>第一期</p>
								<table className="recode-table">
									<tr>
										<th>出价时间</th>
										<th>云购份数</th>
										<th>云购结果</th>
									</tr>
									<tr>
										<td>2016-05-05 16:00</td>
										<td>15</td>
										<td>未开奖</td>
									</tr>
								</table>
							</div>
						</div>
					</div>
					<div>
						<div className="rules-container">
							<p>详细规则:</p>
							<p>1.每件商品参考酷币对应实际货币价值,每购买一次需要100酷币。</p>
							<p>2.同一件商品可以一次购买多份或多次购买。</p>
							<p>3.当一件商品所有"份额"全部售出后系统自动选出本次商品获奖者,每件商品售出后会有2小时冷却刷新时间。</p>
							<p>4.活动仅支持酷币,建议您完成每日任务获得更多的酷币。</p>
							<p>5.出价只能为100的整数倍,出价记录可点击"我的出价记录"查询。</p>
							<p>6.出价时,需要支付相应数量的酷币且不会返还。</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
})

module.exports.GoodsListComp = GoodsListComp;