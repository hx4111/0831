<?php
/**
* mysql class
* @author: colin<colin@comicool.cn>
* @date: 2016-06-02 19:28:45
*/
  
class mysql
{
    protected $pdo;
    protected $res;

    public function __construct($config){
        $this->Config = $config;
        $this->connect();
    }

    public function connect()
    {
        try {
            $this->pdo = new PDO($this->Config['dsn'], $this->Config['name'], $this->Config['password'], array(PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING));
        } catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
            exit;
        }
        $this->pdo->query('SET NAMES utf8;');
    }

    public function query($sql)
    {
        $res = $this->pdo->query($sql);
        if ($res) {
        	return $res->fetchAll();
        }
    }

    public function exec($sql)
    {
    	return $this->pdo->exec($sql);
    }

    public function insert($data, $table)
    {
    	$fields = '';
        $values = '';
    	foreach($data as $key => $val){
            if (is_array($val)) {
            	$fields_tmp = '';
            	$values_tpm = '(';
            	foreach ($val as $k => $v) {
            		$fields_tmp .= '`' . $k .'`,';
            		$values_tpm .= "'" . $v . "',";
            	}
            	$values .= rtrim($values_tpm, ',').'),';
            	$fields = $fields_tmp;
            }else{
            	$fields .= '`' . $key . '`,';
            	$values .= "'" . $val . "',";
            }
        }
        $values = ltrim($values, '(');
        $values = rtrim($values, '),');
        $sql = 'INSERT INTO '.$table . ' (' . rtrim($fields, ',') . ') values (' . rtrim($values, ',') .')';
        return $this->pdo->exec($sql);
    }
}