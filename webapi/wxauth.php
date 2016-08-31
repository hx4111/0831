<?php

    use Home\Controller\PublicController;
	
    global $appid;
    global $secret;
	$appid = 'wx2b279e6b8296219e';
	$secret = '5c36210fd94e296ee74935abbd5a7d27';
	// 注意 URL 一定要动态获取，不能 hardcode.
	$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
	$url = "$protocol$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
	$url = $_GET['url'];
	$jsapiTicket = get_jsapi_ticket();//获取ticket
	$timestamp = time();//获取时间
	$nonceStr = make_noncestr();//获取随机字符
	// 这里参数的顺序要按照 key 值 ASCII 码升序排序
	$string = "jsapi_ticket=$jsapiTicket&noncestr=$nonceStr&timestamp=$timestamp&url=$url";	
	$signature = sha1($string);
	$signPackage = array(
			"appId"     => 'wx2b279e6b8296219e',
			"nonceStr"  => $nonceStr,
			"timestamp" => $timestamp,
			"url"       => $url,
			"signature" => $signature,
			"rawString" => $string
	);
    echo "jsonp_wxapi(".json_encode($signPackage).")";
	//return $signPackage;
	
	//获取jsapi_ticket
	 function get_jsapi_ticket(){	
		//活动access_token
		$data = json_decode(file_get_contents("../_private/access_token.json"));
		if ($data->token_time < time()) {
			$url1 = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx2b279e6b8296219e&secret=5c36210fd94e296ee74935abbd5a7d27";
            $ret = json_decode(httpGet($url1));
			$access_token = $ret->access_token;
			//缓存到文件
			if ($access_token) {
				$data->token_time = time() + 7000;
				$data->access_token = $access_token;
				$fp = fopen("../_private/access_token.json", "w");
				fwrite($fp, json_encode($data));
				fclose($fp);
			}
		}else{
			$access_token = $data->access_token;
		}
		//获取ticket
		$data2 = json_decode(file_get_contents("../_private/jsapi_ticket.json"));
		if ($data2->ticket_time < time()) {
			$url2="https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=$access_token&type=jsapi";
			$ret2 = json_decode(httpGet($url2));
			$ticket = $ret2->ticket;
			//缓存到文件
			if ($ticket) {
				$data->ticket_time = time() + 7000;
				$data->jsapi_ticket = $ticket;
				$fp = fopen("../_private/jsapi_ticket.json", "w");
				fwrite($fp, json_encode($data));
				fclose($fp);
			}
		}else{
			$ticket = $data2->jsapi_ticket;
		}
		return $ticket;
	}
	
	//生成随机字符串	
	function make_noncestr( $length =16  ){
		// 密码字符集，可任意添加你需要的字符
		$chars = array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
				'i', 'j', 'k', 'l','m', 'n', 'o', 'p', 'q', 'r', 's',
				't', 'u', 'v', 'w', 'x', 'y','z', 'A', 'B', 'C', 'D',
				'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L','M', 'N', 'O',
				'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y','Z',
				'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!',
				'@','#', '$', '%', '^', '&', '*', '(', ')', '-', '_',
				'[', ']', '{', '}', '<', '>', '~', '`', '+', '=', ',',
				'.', ';', ':', '/', '?', '|');
		// 在 $chars 中随机取 $length 个数组元素键名
		$keys = array_rand($chars,$length);
		$noncestr = '';
		for($i = 0; $i < $length; $i++){
			// 将 $length 个数组元素连接成字符串
			$noncestr .= $chars[$keys[$i]];
		}
		return $noncestr;
	}
	
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