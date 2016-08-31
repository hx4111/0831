<?php
	date_default_timezone_set('PRC');
    use Home\Controller\PublicController;
	error_reporting(0);

    global $appid;
    global $secret;
	$appid = 'wxe54f078ee26f6aa5';
	$secret = '94178e0724255c506f5bf211769545d3';
	// 注意 URL 一定要动态获取，不能 hardcode.
	$code = $_GET['code'];
	//获取ticket
	//$data = json_decode(file_get_contents("access_token_open.json"));
	//if ($data->token_time < time()) {
		//通过code获取access_token
		$url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxe54f078ee26f6aa5&secret=94178e0724255c506f5bf211769545d3&code=$code&grant_type=authorization_code";
		$ret = json_decode(httpGet($url));
		$access_token = $ret->access_token;
		$refresh_token = $ret->refresh_token;
		//缓存到文件
		if ($access_token) {
			$open_id = $ret->openid;
			//$data->token_time = time() + 86400*30;
			//$data->access_token = $access_token;
			//$data->refresh_token = $ret->refresh_token;
			//$fp = fopen("access_token_open.json", "w");
			//fwrite($fp, json_encode($data));
			//fclose($fp);
		}
	//}else{	
	//	$refresh_token = $data->refresh_token;
	//	$url2 = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=$appid&grant_type=refresh_token&refresh_token=$refresh_token";
	//	$ret2 = json_decode(httpGet($url2));
	//	$access_token = $ret2->access_token;
	//	$open_id = $ret2->openid;
	//}
	
	
	
	$is_success = json_decode(httpGet("https://api.weixin.qq.com/sns/auth?access_token=$access_token&openid=$open_id"));
	if($is_success->errmsg == 'ok'){
		$user_info = json_decode(httpGet("https://api.weixin.qq.com/sns/userinfo?access_token=$access_token&openid=$open_id"));
		//echo '<pre>';
		//print_r($user_info);
		//die();
	}else{
		echo '验证失败！';
		die();
	}
	$user_info->refresh_token = $refresh_token;
	$user_info->access_token = $access_token;
	// $user_info = array_merge($access_token, $user_info);
	// 
//	echo "jsonp_wxuser(".json_encode($user_info).")";
	$user_info = object_array($user_info);

	echo '
		<script>
			window.name = \''. str_replace(array("'"), array("\'"), json_encode($user_info)) .'\'
		</script>
	';

	if($_GET['jump_url']) {
		$url = $_GET['jump_url'];
	} else {
		switch($_GET['state']) {
			case 1:
				$url = 'http://www.comicool.cn';
				break;

			case 3:
				$url = 'http://post.comicool.cn/index.php?g=Admin&m=public&a=login';
				break;

			case 5:
				$url = 'http://promote.comicool.cn/app/index.php';
				$url = $url.'?'.arrayToQueryString($user_info);
				break;
		}
	}

	echo '<script>location.href="'.$url.'"</script>';

	//封装链接获取数据方法
	function httpGet($url) {
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_TIMEOUT, 500);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
		curl_setopt($curl, CURLOPT_URL, $url);
	
		$res = curl_exec($curl);
		curl_close($curl);
	
		return $res;
	}


	function arrayToQueryString($arr) {
		if(!$arr)
			return '';
		if(!is_array($arr))
			return $arr;

		$tmp = '';
		foreach($arr as $k => $v) {
			$tmp .= $k.'='.$v.'&';
		}
		$tmp = rtrim($tmp, '&');
		return $tmp;
	}

	function object_array($array) {  
	    if(is_object($array)) {  
	        $array = (array)$array;  
	     } if(is_array($array)) {  
	         foreach($array as $key=>$value) {  
	             $array[$key] = object_array($value);  
	             }  
	     }  
	     return $array;  
	}
