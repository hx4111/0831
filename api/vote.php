<?php
/**
* 活动投票API
* @author: colin<colin@comicool.cn>
* @date: 2016-06-02 19:31:17
*/

header('Access-Control-Allow-Origin:*');

require_once './common.php';
require_once './pdo.class.php';

$api = new api();
$route = isset($_GET['api']) ? $_GET['api'] : '';
$api->run($route);

class api
{
	static $db;
	static $table;
	static $params;

	public function __construct()
	{
		$host = env('USER_ONLINE_HOST', '127.0.0.1');
		$db = env('USER_ONLINE_DB', 'user_online');
		$port = env('USER_ONLINE_PORT', 3306);
		$config = [
    		'dsn' => "mysql:host={$host};dbname={$db};port={$port}",
    		'name' => env('USER_ONLINE_NAME', 'root'),
    		'password' => env('USER_ONLINE_PASSWORD', 'head@5566'),
    	];
		$this->db = new mysql($config);
		$this->table = 't_simple_vote';
		$this->params = $_GET;
	}

	public function run($route)
	{
		$this->sign();
		if (empty($route)){
			$this->jsonp(1, 'error');
		}
		if (method_exists(__CLASS__, $route)) {
			$this->$route();
		}else{
			$this->jsonp(1, 'error');
		}
	}

	private function params($key, $type=false)
	{
		if ($type && !isset($_GET[$key]) && empty($_GET[$key])) {
			$this->jsonp(1, '缺少' . $key . '参数');
		}
		return isset($_GET[$key]) ? $_GET[$key] : '';
	}

	private function jsonp($code, $msg, $data='')
	{
		$callback = isset($this->params['callback']) ? $this->params['callback'] : 'jsonp_match';
		$json['ret'] = $code;
		$json['msg'] = $msg;
		$data!='' ? $json['data'] = $data : '';
		echo "{$callback}({\"results\":";
		echo json_encode($json);
		exit('})');
	}

	private function sign()
	{
		$sign = $this->params('sign', true);
		$str = '';
		unset($_GET['sign']);
		unset($_GET['api']);
		if(isset($_GET['_'])) unset($_GET['_']);
		if(isset($_GET['callback'])) unset($_GET['callback']);
		foreach ($_GET as $key => $value) {
			$str .= $key . ':' . $value . '|';
		}
		if ($sign !== md5(rtrim($str, '|'))) {
			$this->jsonp(1, '非法请求');
		}
	}

	/*-----------------GET方式提供接口-----------------*/

	/**
	* 获取活动单期
	* @param sign string 认证(必须)
	* @param topic string 主题(非必须)
	* @param id string 期数(必须)
	* @param pid int 期数 默认1(非必须)
	*/
	private function getVote()
	{
		$pid = $this->params('pid')!='' && intval($this->params('pid'))>=0 ? intval($this->params('pid')) : 1;
		$sql = "SELECT * FROM {$this->table} WHERE vote_id='{$this->params('id', true)}' AND pid={$pid}";
		$find = $this->db->query($sql);
		if (!$find) {
			$find = [
				'vote_id' => $this->params('id', true),
				'up' => 0,
				'down' => 0,
				'topic' => $this->params('topic'),
				'start_time' => 0,
				'end_time' => 0,
				'pid' => $pid,
			];
			$this->db->insert($find, $this->table);
			$find = $this->db->query($sql);
		}
		$find = $find[0];
		$data = [
			'id' => $find['vote_id'],
			'pid' => intval($find['pid']),
			'topic' => $find['topic'],
			'start_time' => intval($find['start_time']),
			'end_time' => intval($find['end_time']),
			'up' => intval($find['up']),
			'down' => intval($find['down']),
		];
		$this->jsonp(0, 'success', $data);
	}

	/**
	* 操作单期
	* @param sign string 认证(必须)
	* @param id string 活动(必须)
	* @param pid int 期数 默认1(非必须)
	* @param type int 1顶(默认)/2踩(非必须)
	* @param number int 投票数目 默认1，+/-5(非必须)
	*/
	private function handleVote()
	{
		$pid = $this->params('pid')!='' && intval($this->params('pid'))>=0 ? intval($this->params('pid')) : 1;
		$sql = "SELECT * FROM {$this->table} WHERE vote_id='{$this->params('id', true)}' AND pid={$pid}";
		$find = $this->db->query($sql);
		if(!$find) {
			$find = [
				'vote_id' => $this->params('id', true),
				'up' => 0,
				'down' => 0,
				'topic' => $this->params('topic'),
				'start_time' => 0,
				'end_time' => 0,
				'pid' => $pid,
			];
			$this->db->insert($find, $this->table);
			$find = $this->db->query($sql);
		}
		$find = $find[0];
		$type = !empty($this->params('type')) ? $this->params('type') : 1;
		if (!in_array(intval($type), [1, 2])) $this->jsonp(1, 'type参数错误');
		$action = !empty($this->params('action')) ? $this->params('action') : 1;
		if (!in_array(intval($action), [1, 2])) $this->jsonp(1, 'action参数错误');
		$number = $this->params('number');
		if (intval($number) > 5 || intval($number) < -5) {
			$this->jsonp(1, 'number参数错误');
		}else{
			if (intval($number) == 0) $number = 1;
		}
		$sql = "UPDATE {$this->table} SET ";
		if ($type==1) {
			$up_number = $find['up'] + $number;
			$type_sql = 'up=' . $up_number;
		}else{
			$down_number = $find['down'] + $number;
			$type_sql = 'down=' . $down_number;
		}
		$sql = "{$sql}{$type_sql} WHERE vote_id='{$this->params('id')}' AND pid={$pid}";
		if ($this->db->exec($sql)) {
			$this->jsonp(0, 'success');
		}else{
			$this->jsonp(0, 'update error');
		}
	}

	/**
	* 获取活动组
	* @param sign string 认证(必须)
	* @param id string 活动ID(必须)
	*/
	public function getAct()
	{
		$sql = "SELECT * FROM {$this->table} WHERE vote_id='{$this->params('id', true)}'";
		$query = $this->db->query($sql);
		$data = [];
		foreach ($query as $key => $value) {
			$data[] = [
				'id' => $value['vote_id'],
				'pid' => intval($value['pid']),
				'topic' => $value['topic'],
				'start_time' => intval($value['start_time']),
				'end_time' => intval($value['end_time']),
				'up' => intval($value['up']),
				'down' => intval($value['down']),
			];
		}
		$this->jsonp(0, 'success', $data);
	}

	/**
	* 获取过往期数记录
	* @param sign string 认证(必须)
	* @param limit int 显示条数默认10条(非必须)
	*/
	private function getList()
	{
		$limit = $this->params('limit');
		$sql = "SELECT * FROM {$this->table} ORDER BY id DESC";
		if (intval($limit) < 1) {
			$sql .= " LIMIT 0, 10";
		}else{
			$sql .= " LIMIT 0,$limit";
		}
		$select = $this->db->query($sql);
		$data = [];
		foreach ($select as $value) {
			$data[] = [
				'id' => $value['vote_id'],
				'pid' => intval($value['pid']),
				'topic' => $value['topic'],
				'up' => intval($value['up']),
				'down' => intval($value['down']),
				'start_time' => intval($value['start_time']),
				'end_time' => intval($value['end_time']),
			];
		}
		$this->jsonp(0, 'success', $data);
	}
}