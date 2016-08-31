var React = require('react');

var HistoryComp = React.createClass({

	render: function() {
		var allHistoryCnt = this.props.total_p;
		var nowCnt = this.props.current_p;
		var nodeList = null;
		if (nowCnt == 1) {
			// nodeList = 1;
		}	

		return (
			<div className="history-container">
				<div className="history-content">
					<ul className="slide-main">

					</ul>
				</div>
			</div>
		);
	}
})