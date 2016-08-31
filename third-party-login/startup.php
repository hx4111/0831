<?php
/**
 * Created by PhpStorm.
 * User: Andy
 * Date: 2015/11/5
 * Time: 14:32
 */

define('DEBUG', true);
ini_set('display_errors', true);
error_reporting(DEBUG ? 7 : 0);
date_default_timezone_set('PRC');

//定义环境常量
define('DS', DIRECTORY_SEPARATOR );
define('SERVER_PORT', $_SERVER['SERVER_PORT'] != 80 ? ':'.$_SERVER['SERVER_PORT'] : '');
define('ROOT_PATH',__DIR__.DS);

define('APP_PATH', dirname($_SERVER['DOCUMENT_URI']).'/');
define('SITE_URL', 'http://'.$_SERVER['SERVER_NAME']. SERVER_PORT . $_SERVER["SCRIPT_NAME"]);
//define('SITE_PATH', dirname(SITE_URL));
define('SITE_PATH', "http://comicool.cn/third-party-login");
define('STATIC_PATH', APP_PATH.'static/');
define('IS_AJAX', ( isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' ) ? true : false );

define("IS_MOBILE", isMobile());


//检查客户端类型
define('IN_WEIXIN', strpos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger') !== false ? true : false );
if(IN_WEIXIN) {
    $cli_type = 'weixin';
    $login_type = '微信';
} elseif(preg_match("/Weibo/iUs", $_SERVER['HTTP_USER_AGENT'])) {
    $cli_type = 'weibo';
    $login_type = '微博';
} elseif (preg_match("#QQ/#iUs", $_SERVER['HTTP_USER_AGENT'])) {
    $cli_type = 'qq';
    $login_type = 'QQ';
} else {
    $cli_type = 'web';
    if($_COOKIE['login_type']) {
        if($_COOKIE['login_type'] == 'weibo')
            $login_type = "微博";
        else if($_COOKIE['login_type'] == 'qq')
            $login_type = 'QQ';
    }
}

define('CLI_TYPE', $cli_type);
define('LOGIN_TYPE', $login_type ? $login_type : '社交');

spl_autoload_register('autoload');
function autoload($class){
    require_once ROOT_PATH.'/lib/'.str_replace('\\','/',$class).'.php';
}