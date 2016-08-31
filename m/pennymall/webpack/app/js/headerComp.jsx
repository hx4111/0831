var React = require('react');
var CONFIG = require('./config.js').CONFIG;
var callAppFunction = require('./config.js').callAppFunction;

var HeaderComp = React.createClass({
	getInitialState: function() {
		this.setMallTimmer();
		// console.info(this.props);
		return {mallTimmer: this.props.end_time ? this.props.end_time : '00:00:00'};
	},

	goLogin: function() {
		console.info('call login app function ');
		callAppFunction('openLoginPage', {});
	},

	setMallTimmer: function() {
		// console.info(this.props.end_time);
		var endTime = this.props.end_time? this.props.end_time : (new Date().getTime())/1000;
		// console.info(endTime);
		var timerStart = Number(endTime) - (new Date().getTime())/1000;
		var timmerArray = timeTrans(timerStart);
		var _self = this;
		setInterval(function() {
			timmerArray[2] -- ;
			if (timmerArray[0] == 0 && timmerArray[1] == 0 && timmerArray[2] == 0) {
				return ;
			} else {
				if (timmerArray[2] < 0) {
					timmerArray[2] = 59;
					timmerArray[1] --;
					if (timmerArray[1] < 0) {
						timmerArray[1] = 59; 
						timmerArray[0] --;
					}
				}
			}
			_self.setState({mallTimmer: timmerArray[0] + ':' + timmerArray[1] + ':' + timmerArray[2]});
		}, 1000);
	},

	render: function() {
		var timmerPannel = (<div className="timmer-pannel">
			所有宝藏消失时间<span className="timer-time">{this.state.mallTimmer}</span>
		</div>);

		if(this.props.isLogin) { //登录
			return (
				<div className="header-img">
					<img src="images/header.jpg" alt="可米酱的百宝囊" />
					<div className="user-container">
						<div className="userinfo-container">
							昵称: <span className="nickname">{this.props.userinfo.nickname}</span>
							酷币余额: <span className="nickname">{this.props.userMoney}</span>
						</div>
					</div>
					{timmerPannel}
				</div>
			);
		} else {  // 未登录
			return (
				<div className="header-img">
					<img src="images/header.jpg" alt="可米酱的百宝囊" />
					<div className="user-container">
						<div className="login-pannel" onClick={this.goLogin}>请您登录</div>
					</div>
					{timmerPannel}
				</div>
			);
		}
	}
})

function timeTrans(timeData) {
	var hoursAgo = parseInt(timeData / (60 * 60));
	var minutesAgo = parseInt(parseInt(timeData / 60) % 60);
	var secondsAgo = parseInt(timeData % (60*60));
	return [hoursAgo, minutesAgo, secondsAgo];
}

module.exports.HeaderComp = HeaderComp;
