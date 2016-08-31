<?php
/**
* 自动点赞
* @author: colin<colinlets@gmail.com>
* @date: 2016-07-13 19:09:48
*/

require_once './pdo.class.php';

$auto = new auto();

$auto->run();

class auto
{
	protected $task;
	protected $db;
	protected $table;

	public function __construct()
	{
		$this->task=[83];
		$config = [
    		'dsn' => 'mysql:host=rtr-nlcxcydz.gd1.qingcloud.com;dbname=user_online;port=3341',
    		'name' => 'common_user',
    		'password' => 'head@5566',
    	];
		$this->db = new mysql($config);
		$this->table = 't_simple_vote';
	}
	public function run()
	{
		foreach ($this->task as $value) {
			$sql = "SELECT up FROM {$this->table} WHERE vote_id=$value";
			$find = $this->db->query($sql);
			$up = intval($find[0]['up']);
			if($up < 1000){
				$up += 2;
				$sql = "UPDATE {$this->table} SET up=$up WHERE vote_id=$value";
				$this->db->exec($sql);
			}
		}
	}
}