<?php
/**
* 活动投票API
* @author: colin<colin@comicool.cn>
* @date: 2016-06-02 19:31:17
*/

require_once './api/pdo.class.php';

$api = new api();

if (isset($_GET['vote_init'])) {
	//$api->vote_init();
}

if (isset($_GET['sel'])) {
	$sel_id = intval($_GET['sel']);
	if ($sel_id < 0 || $sel_id > 1000) {
		exit('invalid sel.');
	}
	$api->sel($sel_id);
}

$api->sel_list();

class api
{
	protected $db;
	protected $table;

	public function __construct(){ 
		$config = [
    		'dsn' => 'mysql:host=rtr-nlcxcydz.gd1.qingcloud.com;dbname=user_online;port=3341',
    		'name' => 'common_user',
    		'password' => 'head@5566',
    	];
		$this->db = new mysql($config);
		$this->table = 't_simple_vote';
	}

	public function vote_init(){
		$file_url = $_SERVER['DOCUMENT_ROOT'] . '/_private/simple_vote_result';
		$file_str = file_get_contents($file_url);
		$content = unserialize($file_str);
		$data = [];
		foreach ($content as $key => $value) {
			$data[] = ['vote_id' => $key, 'up' => $value];
		}
		$this->db->exec('DELETE FROM ' . $this->table. ' WHERE id>0');
		$result = $this->db->insert($data, $this->table);
	}

	public function sel_list(){
		$sql = 'SELECT * FROM ' . $this->table . ' ORDER BY vote_id LIMIT 0,100';
		$result = $this->db->query($sql);
		$data = [];
		foreach ($result as $key => $value) {
			$data[$value['vote_id']] = intval($value['up']);
		}
		echo "jsonp_match({\"results\":";
		echo json_encode($data);
		exit('})');
	}

	public function sel($id){
		$sql = 'SELECT * FROM ' . $this->table . ' WHERE vote_id='.$id;
		$find = $this->db->query($sql);
		if (!$find) {
			$init_data = ['vote_id'=>$id, 'up'=>0];
			$this->db->insert($init_data, $this->table);
		}else{
			$up = $find[0]['up']+1;
			$sql = 'UPDATE ' . $this->table . ' SET up='.$up . ' WHERE vote_id='.$id;
			$this->db->exec($sql);
		}
		self::sel_list();
	}
}





