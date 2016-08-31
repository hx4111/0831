<?php
/**
 * Created by PhpStorm.
 * User: Andy
 * Time: 11:25
 */

include 'lib/functions.php';
include "startup.php";
include "config.php";

//session改用redis存储
//ini_set('session.save_handler','redis');
//ini_set('session.save_path','tcp://'.$_config['session_redis']['host'].':'.$_config['session_redis']['port']);

session_start();
error_reporting(0);

define('APP_ROOT_PATH', __DIR__ . DS);

import('SaeTOAuthV2','lib/Ext');
$sae = new SaeTOAuthV2( $_config['weibo']['id'] , $_config['weibo']['key'] );

if($_GET['code'])
    $c = 'callback';
else
    $c = $_GET['c'] ? $_GET['c'] : 'login';

if(IN_WEIXIN) {
    $weObj = new \Ext\Wechat($_config['weixin']);
}

if($_GET['fromType'] == 'H5' || $_GET['fromType'] == 'h5') {
    session('ismobile', 1);
} else {
    session('ismobile', 0);
}

if($_GET['referer'])
    session('referer', $_GET['referer']);

if($_GET['device_id'])
    session('device_id', $_GET['device_id']);

if($_GET['callback_type'])
    session('callback_type', $_GET['callback_type']);

// 自动登陆
$auto_login = $_GET['autologin'];
$obj = new Common($_config['session_redis']);
$obj->$c();


class  Common
{
    public $redis_host;
    public $redis_port;

    public function __construct($session_redis)
    {
        $this->redis_host = $session_redis['host'];
        $this->redis_port = $session_redis['port'];
    }

    public function login()
    {
        global $_config, $sae, $auto_login;

        if (IN_WEIXIN) {
            global $weObj;
            session('uid', null);
            $weixin_url = $weObj->getOauthRedirect(SITE_PATH . '/index.php?c=callback&type=wx', 'wx');
            echo $weixin_url;
            sleep(5);
            http_redirect($weixin_url);
        } else {
            $sae_url = $sae->getAuthorizeURL(SITE_PATH . '/index.php?c=callback&type=wb');
            if (CLI_TYPE == "weibo") {
                header('location:' . $sae_url);
            }

            //qq
            $qqConnect = $this->initQQConnect();
            if (I('get.goqq')) {
                $qqConnect->login();
            }

            if(CLI_TYPE == 'web') {
                $redirect_uri = urlencode(SITE_PATH . '/index.php?c=callback&type=wxopen&cli=pc');
                $weixin_url = 'https://open.weixin.qq.com/connect/qrconnect?appid='.$_config['weixin_open']['appid'].'&redirect_uri='.$redirect_uri.'&response_type=code&scope=snsapi_login&state=5#wechat_redirect';
            }
        }
        
        $url = 'https://api.passport.pptv.com/codeToken.do';
        $data = $_config['pptv'];
        $result = http_post($url, $data);
        $arr = json_decode($result, true);

        switch($auto_login) {
            case "wxopen":
                http_redirect($weixin_url);
                break;

            case "wx":
                if($_GET['t']) {
                    dump($weixin_url);
                    exit;
                }
                http_redirect($weixin_url);
                break;

            case "wb":
                http_redirect($sae_url);
                break;

            case "qq":
                http_redirect(SITE_PATH . "/index.php?goqq=1");
                break;

            case "pptv":
                $url = "http://api.passport.pptv.com/authorize.do";

                $data = [
                    "client_id" => $_config["pptv"]["client_id"],
                    "client_secret" => $_config["pptv"]["client_secret"],
                    "response_type" => "code",
                    "state" => "pptv",
                    "redirect_uri" => SITE_PATH . '/index.php?c=callback',
                ];

                if($_GET['fromType'] == 'h5') {
                    $data['is_mobile'] = 1;
                }
                
                $qstr = arrayToQueryString($data);
                http_redirect($url."?".$qstr);
                break;
        }

        if(isMobile()) {
            include tpl('login', APP_ROOT_PATH);
        } else {
            include tpl('login_pc', APP_ROOT_PATH);
        }
    }

    public function callback()
    {
        global $sae, $_config;

        $login_type = $_GET['type'] ? $_GET['type'] : 'qq';
        $code = $_GET['code'];

        if($_POST['state'] == "pptv" || $login_type == "pptv") {
            $data = [
                'client_id'=>'a08CzmWpBs5OX2fzPnvXZZhtcxGRzWCi',
                'client_secret'=>'01',
                'grant_type'=>'authorization_code',
                'redirect_uri'=> SITE_PATH . "/index.php?c=callback&type=pptv",
                'code'=>$_POST['code'],
                'format'=>'json',
            ];
            $url = 'http://api.passport.pptv.com/codeToken.do';
            $result = http_post($url, $data);
            $arr = json_decode($result, true);

            if($arr["errorCode"] == 0) {
                $url = "https://api.passport.pptv.com/oAuthUserInfo.do";
                $data = [
                    "id" => $arr["result"]["id"],
                    "access_token" => urldecode($arr["result"]["access_token"]),
                    "format" => "json",
                ];

                $result = http_post($url, $data);
                $result = json_decode($result, 1);
                if($result["errorCode"] == 0) {
                    $result = $result["result"];
                    $openId =  $result["id"];
                    $nickname = $result["nickname"];
                    $avatar = $result["facePic"];
                    $type = 6;
                    $ac_token = $data["access_token"];
                    $unionid = "";
                    $refresh_token = urldecode($arr["result"]["refresh_token"]);
                    $phone = $result["phone"];
                }
            }

        } else if($login_type == "wxopen") {
            $type = 1;
            $appid = $_config['weixin_open']['appid'];
            $secret = $_config['weixin_open']['appsecret'];

            $code = $_GET['code'];
            $url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=".$appid."&secret=".$secret."&code=$code&grant_type=authorization_code";
            $result = json_decode(http_get($url), 1);
            $access_token = $result['access_token'];
            $refresh_token = $result['refresh_token'];

            if ($access_token) {
                $open_id = $result['openid'];
            }
            $is_success = json_decode(http_get("https://api.weixin.qq.com/sns/auth?access_token=$access_token&openid=$open_id"));
            if($is_success->errmsg == 'ok'){
                $user_info = json_decode(http_get("https://api.weixin.qq.com/sns/userinfo?access_token=$access_token&openid=$open_id"), 1);
            }else{
                echo '验证失败！';
                die();
            }
            $user_info['refresh_token'] = $refresh_token;
            $user_info['access_token'] = $access_token;

            $unionid = $user_info['unionid'];
            $ac_token = $user_info['access_token'];
            $avatar = $user_info['headimgurl'] ? $user_info['headimgurl'] : 'http://promote.comicool.cn/post/static/images/no_avatar.png';
            $nickname = $user_info['nickname'] ? $user_info['nickname'] : ' ';
            $openId = $user_info['openid'];
            $refresh_token = $user_info['refresh_token'];

        } else if ($login_type == 'wx') {
            global $weObj;
            $type = 1;

            if($_GET['referer'] && $_GET['redirectatcallback']) {
                // 带着code跳转， 领钱那边的特殊需求
                $redirect_url = urldecode($_GET['referer']."&code=".$code);
                http_redirect($redirect_url);
            }

            if(IN_WEIXIN) {
                $ret = $weObj->getOauthAccessToken();
                $wx_user = $weObj->getUserInfo($ret['openid']);
            } else {
                $wx_user = $_GET;
                $ret = $_GET;
            }

            $unionid = $wx_user['unionid'];
            $ac_token = $ret['access_token'];
            $avatar = $wx_user['headimgurl'] ? $wx_user['headimgurl'] : 'http://promote.comicool.cn/post/static/images/no_avatar.png';
            $nickname = $wx_user['nickname'] ? $wx_user['nickname'] : ' ';
            $openId = $wx_user['openid'];
            $refresh_token = $ret['refresh_token'];
            $refresh_token = $ac_token;

        } elseif ($login_type == 'wb') {
            $keys = array();
            $keys['code'] = $_REQUEST['code'];
            $keys['redirect_uri'] = $_config['weibo']['callback'];
            $token = $sae->getAccessToken('code', $keys);

            if ($token) {
                $_SESSION['token'] = $token;
                $sae_c = new SaeTClientV2($_config['weibo']['id'], $_config['weibo']['key'], $_SESSION['token']['access_token']);
                $uid_get = $sae_c->get_uid();
                $uid = $uid_get['uid'];
                $user_message = $sae_c->show_user_by_id($uid);

                $openId = $user_message['id'];
                $nickname = $user_message['screen_name'];
                $avatar = $user_message['avatar_hd'];
                $type = 3;
                $ac_token = $_SESSION['token']['access_token'];
                $refresh_token = $ac_token;
            }
        } else {
            $login_type = 'qq';
            $qqConnect = $this->initQQConnect();
            $qqConnect->setup();
            $accessToken = $qqConnect->getAccessToken();

            $openId = $qqConnect->getOpenId();
            $userInfo = $qqConnect->getUserInfo();
            $nickname = $userInfo['nickname'];
            $avatar = $userInfo['figureurl_qq_2'];
            $type = 2;
            $ac_token = $refresh_token = $accessToken;
        }

        if ((IN_WEIXIN && $type == 1) || ($login_type == 'wx') || $login_type == "wxopen") {
            $ret = getUser($wx_user['openid'], $wx_user['unionid'], false);
            if (!$ret['ccid'])
                $need_reg = true;

            $ret['msg'] = 'success';
            $ret['nickname'] = $wx_user['nickname'];
        } else {
            $need_reg = true;
        }

        if ($need_reg)
            $ret = regUser($openId, $nickname, $avatar, $type  , $ac_token, $unionid, $refresh_token,  session('tg_ccid'), false, session('device_id'), $phone);

        if ($ret['ccid']) {
            if(isMobile()) {
                $file_name = 'receive';
                $file_name2 = 'records';
            } else {
                $file_name = 'receive_pc';
                $file_name2 = 'records';
            }

            if($referer = session('referer')) {
                $ret['login'] = true;
                $qstr = arrayToQueryString($ret);

                if(session('callback_type') == "jsonp") {
                    // jsonp方式取数据
                    $key = md5($qstr. time());

                    $qstr = "key=".$key;
                    $qstr = "getdatauri=".urlencode(SITE_PATH . "/index.php?c=get_data_by_jsonp&key=".$key);
                    $this->savedata($key, $ret);
                }

                if(strpos($referer, '?') == false) {
                    $referer .= "?".$qstr;
                } else {
                    $referer .= "&".$qstr;
                }

                http_redirect($referer);
            }

        } else {
            error('', session('referer'));
        }
    }

    private function savedata($key, $data) {
        $redis = new redis();
        $redis->connect($this->redis_host, $this->redis_port);
        $key = 'webuser_' . $key;
        $redis->set($key, json_encode($data));
        $redis->expire($key, 180);
        $redis->close();
    }

    public function get_data_by_jsonp() {
        $redis = new redis();
        $redis->connect($this->redis_host, $this->redis_port);
        $key = 'webuser_' . $_GET['key'];
        $data = $redis->get($key);
        $result = [
            "code" => 0,
            "data" => json_decode($data),
        ];

        jsonp_return($result);
    }

    private function _getData($url) {
        $str = http_get($url);
        preg_match('/\((.*)\)/iUs', $str, $match);
        $ret = json_decode($match[1], 1);
        return $ret;
    }


    private function init_jsapi()
    {
        global $_config;

        if (IN_WEIXIN) {
            import('Wechat');
            $weObj = new Wechat($_config['weixin']);

            $weObj->checkAuth();
            $js_ticket = $weObj->getJsTicket();

            $url = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
            $js_sign = $weObj->getJsSign($url);
        }
        return $js_sign;
    }

    private  function initQQConnect() {
        global $_config;

        import('QQConnect', 'lib\Ext');
        \Ext\QQConnect::$appid = $_config['qqconnect']['id'];
        \Ext\QQConnect::$appkey = $_config['qqconnect']['key'];
        \Ext\QQConnect::$callback = SITE_PATH.'/index.php?c=callback&type=qq';
        \Ext\QQConnect::$scope = $_config['qqconnect']['scope'];

        $qqConnect = new \Ext\QQConnect();
        return $qqConnect;

    }

}
