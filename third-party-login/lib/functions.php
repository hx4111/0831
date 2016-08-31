<?php
/**
 * Created by PhpStorm.
 * User: wuzhuo
 * Date: 15/10/4
 * Time: 下午11:49
 */

function isMobile()
{
    // 如果有HTTP_X_WAP_PROFILE则一定是移动设备
    if (isset ($_SERVER['HTTP_X_WAP_PROFILE']))
    {
        return true;
    }
    // 如果via信息含有wap则一定是移动设备,部分服务商会屏蔽该信息
    if (isset ($_SERVER['HTTP_VIA']))
    {
        // 找不到为flase,否则为true
        return stristr($_SERVER['HTTP_VIA'], "wap") ? true : false;
    }
    // 脑残法，判断手机发送的客户端标志,兼容性有待提高
    if (isset ($_SERVER['HTTP_USER_AGENT']))
    {
        $clientkeywords = array ('nokia',
            'sony',
            'ericsson',
            'mot',
            'samsung',
            'htc',
            'sgh',
            'lg',
            'sharp',
            'sie-',
            'philips',
            'panasonic',
            'alcatel',
            'lenovo',
            'iphone',
            'ipod',
            'blackberry',
            'meizu',
            'android',
            'netfront',
            'symbian',
            'ucweb',
            'windowsce',
            'palm',
            'operamini',
            'operamobi',
            'openwave',
            'nexusone',
            'cldc',
            'midp',
            'wap',
            'mobile'
        );
        // 从HTTP_USER_AGENT中查找手机浏览器的关键字
        if (preg_match("/(" . implode('|', $clientkeywords) . ")/i", strtolower($_SERVER['HTTP_USER_AGENT'])))
        {
            return true;
        }
    }
    // 协议法，因为有可能不准确，放到最后判断
    if (isset ($_SERVER['HTTP_ACCEPT']))
    {
        // 如果只支持wml并且不支持html那一定是移动设备
        // 如果支持wml和html但是wml在html之前则是移动设备
        if ((strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') !== false) && (strpos($_SERVER['HTTP_ACCEPT'], 'text/html') === false || (strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') < strpos($_SERVER['HTTP_ACCEPT'], 'text/html'))))
        {
            return true;
        }
    }
    return false;
}

/**
 * GET 请求
 * @param string $url
 */
function http_get($url){
    $oCurl = curl_init();
    if(stripos($url,"https://")!==FALSE){
        curl_setopt($oCurl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($oCurl, CURLOPT_SSL_VERIFYHOST, FALSE);
        curl_setopt($oCurl, CURLOPT_SSLVERSION, 1); //CURL_SSLVERSION_TLSv1
    }
    curl_setopt($oCurl, CURLOPT_URL, $url);
    curl_setopt($oCurl, CURLOPT_RETURNTRANSFER, 1 );
    $sContent = curl_exec($oCurl);
    $aStatus = curl_getinfo($oCurl);
    curl_close($oCurl);
    if(intval($aStatus["http_code"])==200){
        return $sContent;
    }else{
        return false;
    }
}
/**
 * POST 请求
 * @param string $url
 * @param array $param
 * @param boolean $post_file 是否文件上传
 * @return string content
 */
function http_post($url,$param,$post_file=false){
    $oCurl = curl_init();
    if(stripos($url,"https://")!==FALSE){
        curl_setopt($oCurl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($oCurl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($oCurl, CURLOPT_SSLVERSION, 1); //CURL_SSLVERSION_TLSv1
    }
    if (is_string($param) || $post_file) {
        $strPOST = $param;
    } else {
        $aPOST = array();
        if($param) {
            foreach ($param as $key => $val) {
                $aPOST[] = $key . "=" . urlencode($val);
            }
        }
        $strPOST =  join("&", $aPOST);
    }
    curl_setopt($oCurl, CURLOPT_URL, $url);
    curl_setopt($oCurl, CURLOPT_RETURNTRANSFER, 1 );
    curl_setopt($oCurl, CURLOPT_POST,true);
    curl_setopt($oCurl, CURLOPT_POSTFIELDS,$strPOST);
    $sContent = curl_exec($oCurl);
    $aStatus = curl_getinfo($oCurl);
    curl_close($oCurl);
    if(intval($aStatus["http_code"])==200){
        return $sContent;
    }else{
        return false;
    }
}

function build_order_no(){
    return date('Ymd').substr(implode(NULL, array_map('ord', str_split(substr(uniqid(), 7, 13), 1))), 0, 8);
}

function ajaxReturn($data,$type='') {
    if(empty($type)) $type  =  'JSON';
    switch (strtoupper($type)){
        case 'JSON' :
            // 返回JSON数据格式到客户端 包含状态信息
            header('Content-Type:application/json; charset=utf-8');
            exit(json_encode($data));
        case 'XML'  :
            // 返回xml格式数据
            header('Content-Type:text/xml; charset=utf-8');
            exit(xml_encode($data));
        case 'JSONP':
            // 返回JSON数据格式到客户端 包含状态信息
            header('Content-Type:application/json; charset=utf-8');
            $handler  =  'callback';
            exit($handler.'('.json_encode($data).');');
        case 'EVAL' :
            // 返回可执行的js脚本
            header('Content-Type:text/html; charset=utf-8');
            exit($data);
    }
}


/**
 * XML编码
 * @param mixed $data 数据
 * @param string $root 根节点名
 * @param string $item 数字索引的子节点名
 * @param string $attr 根节点属性
 * @param string $id   数字索引子节点key转换的属性名
 * @param string $encoding 数据编码
 * @return string
 */
function xml_encode($data, $root='think', $item='item', $attr='', $id='id', $encoding='utf-8') {
    if(is_array($attr)){
        $_attr = array();
        foreach ($attr as $key => $value) {
            $_attr[] = "{$key}=\"{$value}\"";
        }
        $attr = implode(' ', $_attr);
    }
    $attr   = trim($attr);
    $attr   = empty($attr) ? '' : " {$attr}";
    $xml    = "<?xml version=\"1.0\" encoding=\"{$encoding}\"?>";
    $xml   .= "<{$root}{$attr}>";
    $xml   .= data_to_xml($data, $item, $id);
    $xml   .= "</{$root}>";
    return $xml;
}

/**
 * 数据XML编码
 * @param mixed  $data 数据
 * @param string $item 数字索引时的节点名称
 * @param string $id   数字索引key转换为的属性名
 * @return string
 */
function data_to_xml($data, $item='item', $id='id') {
    $xml = $attr = '';
    foreach ($data as $key => $val) {
        if(is_numeric($key)){
            $id && $attr = " {$id}=\"{$key}\"";
            $key  = $item;
        }
        $xml    .=  "<{$key}{$attr}>";
        $xml    .=  (is_array($val) || is_object($val)) ? data_to_xml($val, $item, $id) : $val;
        $xml    .=  "</{$key}>";
    }
    return $xml;
}

function ajaxError($info, $url = '', $_data='') {
    $data['status'] = 0;
    $data['info'] = $info;
    if($url)
        $data['url'] = $url;

    if($data)
        $data['data'] = $_data;


    ajaxReturn($data);
}

function ajaxSuccess($info, $url = '', $_data='') {
    $data['status'] =1;
    $data['info'] = $info;
    if($url)
        $data['url'] = $url;

    if($data)
        $data['data'] = $_data;


    ajaxReturn($data);
}


/**
 * 获取模板路径
 * @param $name
 * @return string
 */
function tpl($name, $root_dir='') {
    if($root_dir)
        $tpl = $root_dir.'template/'.$name.'.html';
    else
        $tpl = ROOT_PATH.'template/'.$name.'.html';

    if(!file_exists($tpl))
        new \Exception('template is not found');

    return $tpl;
}

/**
 * 导入文件
 * @param $class
 * @param string $baseUrl
 * @param string $ext
 * @return mixed
 */
function import($class, $baseUrl = '', $ext='.php') {

    if (empty($baseUrl)) {
        $baseUrl = ROOT_PATH.'lib';
    }
    if (substr($baseUrl, -1) != '/')
        $baseUrl    .= '/';

    $classfile       = $baseUrl . $class . $ext;
    if(file_exists($classfile))
        return include $classfile;
}

/**
 * 获取Request参数
 * @param $name
 * @param string $default
 * @param null $filter
 * @param null $datas
 * @return array|mixed|null|string
 */
function I($name,$default='',$filter=null,$datas=null) {
    if(strpos($name,'.')) { // 指定参数来源
        list($method,$name) =   explode('.',$name,2);
    }else{ // 默认为自动判断
        $method =   'param';
    }
    switch(strtolower($method)) {
        case 'get'     :   $input =& $_GET;break;
        case 'post'    :   $input =& $_POST;break;
        case 'put'     :   parse_str(file_get_contents('php://input'), $input);break;
        case 'param'   :
            switch($_SERVER['REQUEST_METHOD']) {
                case 'POST':
                    $input  =  $_POST;
                    break;
                case 'PUT':
                    parse_str(file_get_contents('php://input'), $input);
                    break;
                default:
                    $input  =  $_GET;
            }
            break;
        case 'request' :   $input =& $_REQUEST;   break;
        case 'session' :   $input =& $_SESSION;   break;
        case 'cookie'  :   $input =& $_COOKIE;    break;
        case 'server'  :   $input =& $_SERVER;    break;
        case 'globals' :   $input =& $GLOBALS;    break;
        case 'data'    :   $input =& $datas;      break;
        default:
            return NULL;
    }
    if(empty($name)) { // 获取全部变量
        $data       =   $input;
        array_walk_recursive($data,'filter_exp');
        $filters    =   isset($filter)?$filter:C('DEFAULT_FILTER');
        if($filters) {
            $filters    =   explode(',',$filters);
            foreach($filters as $filter){
                $data   =   array_map_recursive($filter,$data); // 参数过滤
            }
        }
    }elseif(isset($input[$name])) { // 取值操作
        $data       =   $input[$name];
        is_array($data) && array_walk_recursive($data,'filter_exp');
        $filters    =   isset($filter)?$filter:'htmlspecialchars,addslashes';

        if($filters) {
            $filters    =   explode(',',$filters);
            foreach($filters as $filter){
                if(function_exists($filter)) {
                    $data   =   is_array($data)?array_map_recursive($filter,$data):$filter($data); // 参数过滤
                }else{
                    $data   =   filter_var($data,is_int($filter)?$filter:filter_id($filter));
                    if(false === $data) {
                        return   isset($default)?$default:NULL;
                    }
                }
            }
        }
    }else{ // 变量默认值
        $data       =    isset($default)?$default:NULL;
    }
    return $data;
}

/**
 * 友好的输出
 * @param $var
 * @param bool|true $echo
 * @param null $label
 * @param bool|true $strict
 * @return mixed|null|string
 */
function dump($var, $echo=true, $label=null, $strict=true) {
    $label = ($label === null) ? '' : rtrim($label) . ' ';
    if (!$strict) {
        if (ini_get('html_errors')) {
            $output = print_r($var, true);
            $output = "<pre>" . $label . htmlspecialchars($output, ENT_QUOTES) . "</pre>";
        } else {
            $output = $label . print_r($var, true);
        }
    } else {
        ob_start();
        var_dump($var);
        $output = ob_get_clean();
        if (!extension_loaded('xdebug')) {
            $output = preg_replace("/\]\=\>\n(\s+)/m", "] => ", $output);
            $output = '<pre>' . $label . htmlspecialchars($output, ENT_QUOTES) . '</pre>';
        }
    }
    if ($echo) {
        echo($output);
        return null;
    }else
        return $output;
}

/**
 * session处理
 * @param $name
 * @param null $val
 * @param int $exptime
 * @return null
 */
function session($name, $val= '', $exptime=0) {

    if($val === null) {
        $_SESSION[$name] = null;
        unset($_SESSION[$name]);
        if(isset($_SESSION[$name.'__exp']))
            unset($_SESSION[$name.'__exp']);
    }

    if($val) {
        if($exptime) {
            $tmp = array(
                'save_time' => time(),
                'exptime' => $exptime,
                'var' => $val
            );

            $_SESSION[$name] = serialize($tmp);
            $_SESSION[$name.'__exp'] = true;
        } else {
            $_SESSION[$name] = $val;
        }

    } else {
        if( isset( $_SESSION[$name.'__exp'])) {
            $tmp = unserialize($_SESSION[$name]);
            if(time() - $tmp['save_time'] > $tmp['exptime']) {
                $_SESSION[$name] = null;
                unset($_SESSION[$name]);
                unset($_SESSION[$name.'__exp']);
                return null;
            } else {
                return $tmp['var'];
            }
        } else {
            return $_SESSION[$name];
        }
    }
}

/**
 * 获取随机数字id
 * @return string
 */
function createId() {
    return date('Ymd').substr(implode(NULL, array_map('ord', str_split(substr(uniqid(), 7, 13), 1))), 0, 8);
}

/**
 * 返回json数据
 * @param array $var
 */
function ajax_return( $var = array() ) {
    header('Content-Type:text/text; charset=utf-8');
    echo json_encode($var);
    exit;
}

function jsonp_return( $var = array(), $callback="callback" ) {
    header('Content-Type:text/text; charset=utf-8');
    echo $callback."(".json_encode($var).")";
    exit;
}

function return_data($data) {
    if( IS_AJAX ) {
        ajax_return($data);
    }

    $waitSecond = 3;
    $jumpUrl = $data['url'] ? $data['url'] : $_SERVER['HTTP_REFERER'];

    if($data['status'])
        $message = $data['info'];
    else {
        $error = $data['info'];
    }
    exit;
}

function success($msg, $url = '', $time=3) {
    $array = array(
        'status' => true,
        'info' => $msg,
        'url' => $url
    );
    if(!$time) {
        if(!$url)
            $url = $url ? $url : $_SERVER['HTTP_REFERER'];

        header('location:'.$url);
    }
    return_data($array);
}

function error ($msg, $url = '') {
    $array = array(
        'status' => false,
        'info' => $msg
    );
    return_data($array);
}

function url($f, $c='', $m='',$args='') {
    if(!$f)
        return false;
    $url = SITE_PATH.'/'.$f.'.php';
    if($c || $m || $args)
        $url .= '?';
    if($c)
        $url .= 'c='.$c.'&';
    if($m)
        $url .= 'm='.$m.'&';
    if($args)
        $url .= arrayToQueryString($args);

    $url = rtrim($url, '&');
    return $url;
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

/**
 *  注册用户
 * @param $openid
 * @param $union_id
 * @param $name
 * @param $icon
 * @param int $type 1是微信，2是qq，3是微博
 * @param string $token
 * @param string $ext_token
 * @param int $ccid 推荐人的CCID
 * @param bool $test_api
 * @return mixed
 */
function regUser($openid,$name, $icon, $type=1, $token='', $union_id='', $ext_token='', $ccid=0, $test_api = false, $device_id="", $phone=0) {
    if($test_api)
        $api = 'http://121.201.7.97:8002/userreg4h5';
    else
        $api = 'http://proxy.icomico.com/userreg4h5';

    if($type == 1)
        $param['wx_union_id'] = $union_id;

    //推荐人CCID
    if($phone)
        $param['phone_num'] = $phone;

    if($ccid)
        $param['tg_ccid'] = $ccid;

    if(!$device_id)
        $device_id = $_COOKIE['device_id'];

    $param['usertype'] = $type;
    $param['userid'] = str_replace(["\r\n", "\r", "\n"], "", $openid);

    $param['token'] = urlencode(str_replace(["\r\n", "\r", "\n"], "", $token));
    $param['ext_token'] = urlencode(str_replace(["\r\n", "\r", "\n"], "", $ext_token));
    $param['nickname'] = urlencode($name) ;
    $param['icon'] = urlencode($icon);
    $param['device_id'] = $device_id;

    $api .= '?'.arrayToQueryString($param);

    file_put_contents('api.log', $api."\r\n\r\n", FILE_APPEND);

    $str = http_get($api);
    preg_match('/\((.*)\)/iUs', $str, $match);
    $ret = json_decode($match[1], 1);

    return $ret;
}

/**
 * 根据unionid 获取用户ccid
 * @param $openid
 * @param $unionid
 * @param bool|false $test_api
 * @return mixed
 */
function getUser($openid, $unionid, $test_api = false) {
    if($test_api)
        $api = 'http://121.201.7.97:8004/getccid4h5';
    else
        $api = 'http://proxy.icomico.com/getccid4h5';

    $url = $api.'?openid='.$openid.'&wx_union_id='.$unionid;
    $str = http_get($url);
    preg_match('/\((.*)\)/iUs', $str, $match);
    $ret = json_decode($match[1], 1);

    return $ret;
}

function http_redirect($url, $time=0, $msg='') {
    $url = str_replace(array("\n", "\r"), '', $url);
    if (empty($msg))
        $msg = "系统将在{$time}秒之后自动跳转到{$url}！";
    if (!headers_sent()) {
        // redirect
        if (0 === $time) {
            header("Location: " . $url);
        } else {
            header("refresh:{$time};url={$url}");
            echo($msg);
        }
        exit();
    } else {
        $str = "<meta http-equiv='Refresh' content='{$time};URL={$url}'>";
        if ($time != 0)
            $str .= $msg;
        exit($str);
    }
}

function isMobile2(){
    $useragent=isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
    $useragent_commentsblock=preg_match('|\(.*?\)|',$useragent,$matches)>0?$matches[0]:'';

    $mobile_os_list=array('iPad','Google Wireless Transcoder','Windows CE','WindowsCE','Symbian','Android','armv6l','armv5','Mobile','CentOS','mowser','AvantGo','Opera Mobi','J2ME/MIDP','Smartphone','Go.Web','Palm','iPAQ');
    $mobile_token_list=array('Profile/MIDP','Configuration/CLDC-','160×160','176×220','240×240','240×320','320×240','UP.Browser','UP.Link','SymbianOS','PalmOS','PocketPC','SonyEricsson','Nokia','BlackBerry','Vodafone','BenQ','Novarra-Vision','Iris','NetFront','HTC_','Xda_','SAMSUNG-SGH','Wapaka','DoCoMo','iPhone','iPod');

    $found_mobile= CheckSubstrs($mobile_os_list,$useragent_commentsblock) || CheckSubstrs($mobile_token_list,$useragent);

    if ($found_mobile){
        return true;
    }else{
        return false;
    }
}

function CheckSubstrs($substrs,$text){
    foreach($substrs as $substr)
        if(false!==strpos($text,$substr)){
            return true;
        }
    return false;
}

/**
 * 只保留字符串首尾字符，隐藏中间用*代替（两个字符时只显示第一个）
 * @param string $user_name 姓名
 * @return string 格式化后的姓名
 */
function substr_cut($user_name){
    $strlen     = mb_strlen($user_name, 'utf-8');
    $firstStr   = mb_substr($user_name, 0, 1, 'utf-8');
    $lastStr    = mb_substr($user_name, -1, 1, 'utf-8');
    return $strlen == 2 ? $firstStr . str_repeat('*', mb_strlen($user_name, 'utf-8') - 1) : $firstStr . str_repeat("*", $strlen - 2) . $lastStr;
}